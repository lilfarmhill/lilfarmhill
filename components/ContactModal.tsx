// components/ContactModal.tsx
'use client';

import React from 'react';
import ContactForm from './ContactForm'; // We'll create this next

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  // Handle backdrop clicks
  const handleBackdropClick = () => {
    onClose();
  };

  // Prevent clicks inside the modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // Backdrop: Fixed position, full screen, semi-transparent background, high z-index
    <div
      className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleBackdropClick} // Close on backdrop click
    >
      {/* Modal Content Container */}
      <div
        className="bg-white rounded-lg shadow-xl w-full h-full sm:h-auto sm:w-auto sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" // Full screen on mobile (< sm), sized box on larger screens
        onClick={handleContentClick} // Prevent closing when clicking inside
      >
        {/* Modal Header (Optional, for title and close button) */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close modal"
          >
            &times; {/* HTML entity for 'X' */}
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {/* Render the contact form inside */}
          <ContactForm onSuccess={onClose} /> {/* Close modal on successful form submission */}
        </div>
      </div>
    </div>
  );
}
