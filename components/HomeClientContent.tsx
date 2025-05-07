// components/HomeClientContent.tsx
'use client'; // <--- Make this a Client Component

import { useState } from 'react';
import EnrollmentModal from './EnrollmentModal'; // Updated to use the new EnrollmentModal

export default function HomeClientContent() {
  // State to control modal visibility lives here now
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#d7a271] text-white px-8 py-4 rounded-md cursor-pointer shadow hover:bg-[#d7a271]/80  mt-6" // Using the green button style from previous example
      >
        Enroll Now / Inquire
      </button>

      {/* The Modal Component is rendered by this Client Component */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
