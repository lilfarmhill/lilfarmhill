'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DonatePage() {
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const presetAmounts = ['25', '50', '100', '250', '500'];

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCustomAmount(value);
      setDonationAmount('custom');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate form
    if (!donorEmail || !donorName) {
      setError('Please provide your name and email.');
      setIsProcessing(false);
      return;
    }

    if (donationAmount === 'custom' && (!customAmount || parseFloat(customAmount) <= 0)) {
      setError('Please enter a valid donation amount.');
      setIsProcessing(false);
      return;
    }

    const finalAmount = donationAmount === 'custom' ? customAmount : donationAmount;

    try {
      // Here you would integrate with a payment processor like Stripe
      // For now, we'll just simulate a successful payment
      setTimeout(() => {
        setSuccess(true);
        setIsProcessing(false);
      }, 1500);

      // For actual implementation:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     amount: finalAmount,
      //     name: donorName,
      //     email: donorEmail,
      //     message: donorMessage,
      //   }),
      // });
      //
      // const { url } = await response.json();
      // window.location.href = url;
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="text-[#d7a271] mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-semibold mb-4 text-[#4d4d4d]">Thank You For Your Donation!</h1>
          <p className="text-lg mb-6 text-[#707070]">
            Your generous support helps us continue to provide nature-based education for children in our community.
          </p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#d7a271] text-white rounded-md hover:bg-[#d7a271]/90 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-[#4d4d4d]">Support Lil Farm Hill</h1>
        <p className="text-lg text-[#707070] max-w-2xl mx-auto">
          Your donation helps us provide nature-based education and create meaningful learning experiences for children in our community.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Image and Info - 3 columns on desktop */}
        <div className="md:col-span-2 space-y-6">
             <div className="justify-center flex bg-[#f5f0ea] rounded-lg overflow-hidden  p-4">
               <Image className="rounded-lg overflow-hidden shadow-md " src="/logo.png" alt="Lil Farm Hill Logo" width={400} height={235} />
             </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Donation Supports:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600">Educational materials and supplies</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600">Scholarship opportunities for families in need</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600">Nature-based learning environment improvements</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600">Special projects and community events</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Donation Form - 3 columns on desktop */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Make a Donation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Preset Amounts */}
              <div>
                <label className="block text-sm font-medium text-[#707070] mb-2">
                  Select an Amount
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`py-3 px-4 rounded-md border text-base transition-all duration-200 ${
                        donationAmount === amount
                          ? 'bg-[#d7a271] text-white border-[#d7a271] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`py-3 px-4 rounded-md border text-base transition-all duration-200 ${
                      donationAmount === 'custom'
                        ? 'bg-[#d7a271] text-white border-[#d7a271] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                    onClick={() => setDonationAmount('custom')}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Custom Amount */}
              {donationAmount === 'custom' && (
                <div>
                  <label htmlFor="customAmount" className="block text-sm font-medium text-[#707070] mb-2">
                    Enter Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="customAmount"
                      id="customAmount"
                      className="focus:ring-[#d7a271] focus:border-[#d7a271] block w-full pl-10 pr-12 py-3 text-base border-gray-300 rounded-md shadow-sm"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      aria-describedby="price-currency"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm" id="price-currency">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Donor Information */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#707070] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="focus:ring-[#d7a271] focus:border-[#d7a271] block w-full py-3 px-4 text-base border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#707070] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="focus:ring-[#d7a271] focus:border-[#d7a271] block w-full py-3 px-4 text-base border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#707070] mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="focus:ring-[#d7a271] focus:border-[#d7a271] block w-full py-3 px-4 text-base border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !donationAmount || (donationAmount === 'custom' && !customAmount)}
                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-[#d7a271] hover:bg-[#d7a271]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d7a271] disabled:opacity-50 transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Donate Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
