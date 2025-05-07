
import HomeClientContent from '@/components/HomeClientContent';
import type { Metadata } from 'next';
import Image from 'next/image';
export const metadata: Metadata = {
  title: 'Lil Farm Hill | Nature-Based Learning in Upper Ojai, California',
  description: 'Lil Farm Hill Learning Village is a nature-based outdoor learning program supporting homeschool families in Upper Ojai, California.',
};

// app/page.tsx
export default function Home() {

  return (
    <main className="flex flex-col gap-4 text-center items-center p-12">
        <h1 className="text-6xl font-black text-[#707070]">Lil Farm Hill</h1>
        <p className="text-xl font-sans text-[#707070]">Upper Ojai, California</p>
        <p className="max-w-[800px] mx-auto text-[#707070]/80">
          A nature-based outdoor learning program supporting homeschool families.
          We believe that by nature we are all connected, curious, creative and capable.
        </p>
        <Image className='rounded-lg shadow-xl border-8 mb-10 border-white' src="/bg2.jpg" alt="Lil Farm Hill Logo" width={1500} height={485} />
        <p className='text-xl font-sans text-[#707070]'>We are currently accepting applications for the 2025-2026 school year.</p>
        <p className='font-sans text-[#707070]/80'>Daily enrollment is limited to 10 full-term students per day—because small groups lead to big growth.</p>
        <HomeClientContent />
    </main>
  );
}
