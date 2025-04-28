// app/api/bookings/confirm/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentIntentId, bookedSlots } = body; // Expect PI ID and slot details

    if (!paymentIntentId || !bookedSlots || !Array.isArray(bookedSlots)) {
      return NextResponse.json({ error: 'Missing paymentIntentId or bookedSlots' }, { status: 400 });
    }

    console.log(`API: Confirming booking for Payment Intent ${paymentIntentId}`);

    // *** TODO: Replace with actual logic ***
    // 1. Retrieve the PaymentIntent from Stripe to verify its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 2. Check if payment was successful
    if (paymentIntent.status === 'succeeded') {
      // 3. **CRITICAL:** Idempotency Check - Check if this booking (for this PaymentIntent) has already been processed in your DB.
      //    If yes, return success without creating duplicate bookings.

      // 4. Create Booking Records in your PostgreSQL database
      //    - Create a main booking record (linking user, paymentIntentId, total amount).
      //    - Create individual records for each booked slot (date, time, student, booking_id), marking them as unavailable.
      //    - Use a transaction to ensure all DB operations succeed or fail together.
      console.log(`Payment successful for ${paymentIntentId}. Creating booking records for:`, bookedSlots);
      // db.createBooking(....); // Your database logic here

      // 5. Return success to the frontend
      return NextResponse.json({ success: true, message: 'Booking confirmed and slots reserved.' });

    } else {
      // Payment was not successful
      console.warn(`Payment Intent ${paymentIntentId} status: ${paymentIntent.status}`);
      return NextResponse.json({ success: false, message: `Payment status: ${paymentIntent.status}` }, { status: 400 });
    }

  } catch (error: any) {
    console.error("API Error confirming booking:", error);
    return NextResponse.json({ error: `Failed to confirm booking: ${error.message}` }, { status: 500 });
  }
}