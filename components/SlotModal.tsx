/* components/SlotModal.tsx */
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { slotDB } from '@/mock/slot';
import { format } from 'date-fns';

type Props = {
  slotId: string;
  onClose(): void;
};

export default function SlotModal({ slotId, onClose }: Props) {
  /* ────────────────────────────────── helpers ────────────────────────────────── */
  const [dateKey] =
    Object.entries(slotDB).find(([_, arr]) => arr.some((s) => s.id === slotId)) ??
    [];
  const slot = slotDB[dateKey]?.find((s) => s.id === slotId);
  const [recurringEnd, setRecurringEnd] = useState('');
  const [loading, setLoading] = useState(false);

  /* ────────────────────────────── keyboard / focus ───────────────────────────── */
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    // trap initial focus
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* ─────────────────────────────── checkout stub ─────────────────────────────── */
  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ slotId, recurringEnd }),
    }).then((r) => r.json());

    const stripe = (
      await import('@stripe/stripe-js')
    ).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);
    (await stripe).redirectToCheckout({ sessionId: res.id });
  };

  if (!slot) return null;

  /* ─────────────────────────────── rendered modal ────────────────────────────── */
  const modal = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      aria-labelledby="slot-modal-title"
      role="dialog"
    >
      {/* backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded bg-white p-6 shadow-xl focus:outline-none"
      >
        <h2 id="slot-modal-title" className="mb-4 text-lg font-semibold">
          Book slot
        </h2>

        <p>
          {format(new Date(dateKey), 'PPPP')} · {slot.time}
        </p>

        {/* recurring picker */}
        <label className="mt-4 block text-sm">
          Repeat weekly until:
          <input
            type="date"
            value={recurringEnd}
            onChange={(e) => setRecurringEnd(e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1"
          />
        </label>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Pay & Reserve
        </button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
