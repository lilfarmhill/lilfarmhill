// components/BookingModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { format } from 'date-fns'; // Only needed if displaying formatted dates/times

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlotIds: string[]; // Accept slot IDs
  stripePk: string;
}

// Load Stripe outside of component render
// Make sure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in your .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// --- Inner Checkout Form Component ---
const CheckoutForm = ({ selectedSlotIds, onClose }: { selectedSlotIds: string[], onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false);
  const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null);

  // 1. Create Payment Intent when component mounts or selection changes
  useEffect(() => {
    if (selectedSlotIds.length === 0) {
        setClientSecret(null); // Reset if selection is cleared
        return;
    };

    setProcessing(true); // Indicate loading state
    setError(null);
    setPaymentSucceeded(false);
    setEstimatedAmount(null);
    console.log("Modal requesting Payment Intent for slots:", selectedSlotIds);

    // **BACKEND CALL NEEDED HERE**
    fetch('/api/bookings/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotIds: selectedSlotIds }),
    })
    .then(res => {
        if (!res.ok) {
           return res.json().then(err => Promise.reject(err)); // Throw detailed error if possible
        }
        return res.json();
    })
    .then(data => {
      if (!data.clientSecret) {
          throw new Error("Client secret not received from server");
      }
      console.log("Received client secret:", data.clientSecret);
      setClientSecret(data.clientSecret);
      setEstimatedAmount(data.amount); // Store amount received from backend (in cents)
      setProcessing(false); // Ready for payment input
    })
    .catch(err => {
      console.error("Failed to create payment intent:", err);
      setError(err.error || err.message || "Failed to initialize payment.");
      setProcessing(false);
    });
  }, [selectedSlotIds]); // Re-run if selected slots change

  // 2. Handle Payment Submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system not ready. Please wait or refresh.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details element not found.");
      return;
    }

    setProcessing(true);
    setError(null);

    // Confirm the payment on the client-side
    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          // Add billing_details if needed/collected
          // billing_details: { name: 'Customer Name' },
        },
      }
    );

    if (paymentError) {
      setError(paymentError.message || "An unexpected error occurred during payment.");
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      console.log('Payment successful!', paymentIntent);
      setError(null);

      // **BACKEND CALL NEEDED HERE**
      // 3. Confirm Booking on Backend
      try {
        const confirmResponse = await fetch('/api/bookings/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            bookedSlotIds: selectedSlotIds, // Send IDs
          }),
        });

        if (!confirmResponse.ok) {
            const confirmError = await confirmResponse.json();
            throw new Error(confirmError.error || 'Booking confirmation failed on server.');
        }

        // Booking confirmed on backend!
        setPaymentSucceeded(true); // Show success message
        // Don't close modal immediately, let user see success msg

      } catch (confirmErr: any) {
        setError(`Payment succeeded but booking confirmation failed: ${confirmErr.message}. Please contact support.`);
        // Handle this state - payment taken but booking not finalized
      } finally {
        setProcessing(false); // Stop processing indicator after confirmation attempt
      }

    } else {
      setError(`Payment status: ${paymentIntent?.status ?? 'unknown'}. Please try again.`);
      setProcessing(false);
    }
  };

  // --- Card Element Styling ---
  const cardElementOptions = {
      style: {
          base: {
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                  color: "#aab7c4"
              },
              border: '1px solid #ced4da', // Doesn't work directly here, apply to wrapper
              padding: '10px 12px'       // Doesn't work directly here, apply to wrapper
          },
          invalid: {
              color: "#fa755a",
              iconColor: "#fa755a"
          }
      },
      hidePostalCode: true // Optional: Hide postal code field
  };

  return (
    <form onSubmit={handleSubmit}>
        {/* Show success message instead of form */}
        {paymentSucceeded ? (
             <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">Your payment was successful and the slots have been reserved.</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Close
                </button>
            </div>
        ) : (
            <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Your Booking</h3>
                <p className="mb-2 text-sm text-gray-600">You are booking {selectedSlotIds.length} slot(s).</p>
                {estimatedAmount !== null && (
                    <p className="mb-4 font-medium text-gray-700">
                        Total: ${(estimatedAmount / 100).toFixed(2)} {/* Display amount from backend */}
                    </p>
                )}

                {/* Card Element Wrapper */}
                <div className="mb-4 p-3 border rounded border-gray-300 bg-white">
                    <CardElement options={cardElementOptions} />
                </div>

                {error && <div className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded border border-red-200">{error}</div>}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || !elements || processing || !clientSecret || paymentSucceeded}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {processing ? 'Processing...' : 'Pay & Book Now'}
                    </button>
                </div>
                {!clientSecret && !error && !processing && (
                    <p className="text-sm text-gray-500 mt-4 text-center">Initializing payment...</p>
                )}
            </>
        )}
    </form>
  );
};


// --- Main Modal Component ---
export default function BookingModal({ isOpen, onClose, selectedSlotIds, stripePk }: BookingModalProps) {
  if (!isOpen) return null;
  if (!stripePk) {
      console.error("Stripe Publishable Key is missing.");
      // Optionally render an error message within the modal structure
      return (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Configuration Error</h3>
                  <p className="text-gray-700">Payment processing cannot be initialized. Please contact support.</p>
                  <button onClick={onClose} className="mt-4 px-4 py-2 border rounded hover:bg-gray-100">Close</button>
              </div>
          </div>
      );
  }

  // Options for Stripe Elements provider (can customize appearance etc.)
  const options: StripeElementsOptions = {
    // clientSecret is fetched within CheckoutForm, so not needed here
    // appearance: { theme: 'stripe' },
  };

  return (
    // Modal backdrop and container
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm selectedSlotIds={selectedSlotIds} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}