// app/api/bookings/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// IMPORTANT: Initialize Stripe with the Secret Key *server-side only*
// Ensure STRIPE_SECRET_KEY is set in your environment variables for deployment
// For local dev, it might be in .env.local (but don't commit it!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10', // Use the latest API version
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slots } = body; // Get selected slots (e.g., ['2025-05-10', '2025-05-17'])

        if (!slots || !Array.isArray(slots) || slots.length === 0) {
            return NextResponse.json({ error: 'Missing or invalid slot data' }, { status: 400 });
        }

        // *** TODO: Replace with actual logic ***
        // 1. Validate slots against database: Are they still available?
        // 2. Calculate the total price based on the number of slots and your pricing model.
        const numberOfSlots = slots.length;
        const pricePerSlot = 1000; // Example: $10.00 per slot (in cents)
        const amount = numberOfSlots * pricePerSlot;

        // 3. Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd', // Or your desired currency
            // Enable automatic confirmation recommended for most card flows
            automatic_payment_methods: {
                enabled: true,
            },
            // Optional: Add metadata linking to user/booking attempt
            metadata: {
                // userId: 'user_123', // Get from session/auth
                numberOfSlots: numberOfSlots,
                slotDates: slots.join(', '),
            }
        });

        console.log(`API: Created Payment Intent ${paymentIntent.id} for $${(amount / 100).toFixed(2)}`);

        // 4. Send the client_secret back to the frontend
        return NextResponse.json({ clientSecret: paymentIntent.client_secret, amount: amount });

    } catch (error: any) {
        console.error("API Error creating payment intent:", error);
        return NextResponse.json({ error: `Failed to create payment intent: ${error.message}` }, { status: 500 });
    }
}