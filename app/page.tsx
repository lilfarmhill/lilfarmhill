import BookingCalendar from '@/components/BookingCalendar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lil Farm Hill | Nature-Based Learning in Upper Ojai, California',
  description: 'Lil Farm Hill Learning Village is a nature-based outdoor learning program supporting homeschool families in Upper Ojai, California.',
};

// app/page.tsx
export default function Home() {
  return (
    <main className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="text-center">
        <h1 className="text-6xl font-black mb-2 text-[#707070]">Lil Farm Hill</h1>
        <p className="text-xl font-sans mb-6 text-[#707070]">Upper Ojai, California</p>
        <p className="max-w-md mx-auto text-[#707070]/80">
          A nature-based outdoor learning program supporting homeschool families.
          We believe that by nature we are all connected, curious, creative and capable.
        </p>
        <BookingCalendar />
      </div>
    </main>
  );
}
