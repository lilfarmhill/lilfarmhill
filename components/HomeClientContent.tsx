// components/HomeClientContent.tsx
'use client'; // <--- Make this a Client Component

import { useState } from 'react';
import ContactModal from './ContactModal'; // Assuming ContactModal is in the same folder or adjust path

export default function HomeClientContent() {
  // State to control modal visibility lives here now
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        // Use the existing button style or create a new one
        // className="bg-[#d7a271] text-white px-8 py-4 rounded-md cursor-pointer"
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors mt-6" // Using the green button style from previous example
        // Or change text to "Contact Us / Inquire" if preferred
      >
        Enroll Now / Inquire
      </button>

      {/* The Modal Component is rendered by this Client Component */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
