// components/ContactForm.tsx
'use client';

import React, { useState } from 'react';

interface ContactFormProps {
    onSuccess?: () => void; // Optional callback for successful submission
}

// Define available days
const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedDays: [] as string[], // Store selected days in an array
    numChildren: '', // Keep as string initially for input control if needed
    childrenBirthdays: '', // Simple textarea for now
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentDays = prev.interestedDays;
      if (checked) {
        // Add day if checked and not already present
        return { ...prev, interestedDays: [...currentDays, value] };
      } else {
        // Remove day if unchecked
        return { ...prev, interestedDays: currentDays.filter(day => day !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation (add more as needed)
    if (!formData.name || !formData.email) {
        setError("Please fill in your name and email.");
        setIsSubmitting(false);
        return;
    }

    console.log("Form Data Submitted:", formData); // Log data before sending

    try {
      // Send data to your API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get error message from response body
        let errorMsg = `HTTP error! Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (jsonError) {
            // Ignore if response is not JSON
        }
        throw new Error(errorMsg);
      }

      // Success!
      const result = await response.json();
      setSuccessMessage(result.message || 'Thank you! Your message has been sent.');
      // Reset form (optional)
      setFormData({
        name: '', email: '', phone: '', interestedDays: [], numChildren: '', childrenBirthdays: '',
      });
      // Call the onSuccess callback (e.g., to close the modal)
      if (onSuccess) {
        setTimeout(onSuccess, 1500); // Close modal after a short delay
      }

    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Phone Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Interested Days Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Days Interested In (Select all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableDays.map(day => (
            <div key={day} className="flex items-center">
              <input
                id={`day-${day}`}
                name="interestedDays"
                type="checkbox"
                value={day}
                checked={formData.interestedDays.includes(day)}
                onChange={handleCheckboxChange}
                disabled={isSubmitting}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-900">
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Number of Children */}
      <div>
        <label htmlFor="numChildren" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Children
        </label>
        <input
          type="number"
          name="numChildren"
          id="numChildren"
          min="1"
          value={formData.numChildren}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

       {/* Children's Birthdays Textarea */}
      <div>
        <label htmlFor="childrenBirthdays" className="block text-sm font-medium text-gray-700 mb-1">
          Children's Birthdays (Please list MM/DD/YYYY for each child)
        </label>
        <textarea
          id="childrenBirthdays"
          name="childrenBirthdays"
          rows={3}
          value={formData.childrenBirthdays}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="e.g., 05/15/2018, 11/02/2020"
          disabled={isSubmitting}
        ></textarea>
      </div>

      {/* Submit Button & Messages */}
      <div className="pt-2">
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {successMessage && <p className="text-sm text-green-600 mb-3">{successMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#d7a271] hover:bg-[#d7a271]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d7a271] disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
    </form>
  );
}
