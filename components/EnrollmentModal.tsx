'use client';

import React, { useState } from 'react';
import EnrollmentForm from './EnrollmentForm';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentModal({ isOpen, onClose }: EnrollmentModalProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setFormSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset form submitted state after modal is closed
      setTimeout(() => setFormSubmitted(false), 300);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Enrollment Inquiry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {formSubmitted ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Thank you!</h3>
              <p className="mt-2 text-gray-500">Your enrollment inquiry has been submitted successfully.</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Please fill out this form to inquire about enrolling your child at Lil Farm Hill. We'll get back to you as soon as possible.
              </p>
              <EnrollmentForm onSuccess={handleFormSuccess} />
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
