'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

interface EnrollmentFormProps {
  onSuccess?: () => void; // Optional callback for successful submission
}

// Define available days
const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface Child {
  name: string;
  birthday: string;
}

export default function EnrollmentForm({ onSuccess }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    interestedDays: [] as string[],
    children: [{ name: '', birthday: '' }] as Child[],
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

  const handleChildInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedChildren = [...prev.children];
      updatedChildren[index] = { ...updatedChildren[index], [name]: value };
      return { ...prev, children: updatedChildren };
    });
  };

  const handleAddChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', birthday: '' }]
    }));
  };

  const handleRemoveChild = (index: number) => {
    // Prevent removing if it's the only child
    if (formData.children.length <= 1) {
      return;
    }
    
    setFormData(prev => {
      const updatedChildren = [...prev.children];
      updatedChildren.splice(index, 1);
      return { ...prev, children: updatedChildren };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!formData.parentName || !formData.email) {
      setError("Please fill in your name and email.");
      setIsSubmitting(false);
      return;
    }

    if (formData.children.some(child => !child.name || !child.birthday)) {
      setError("Please fill in all children's information.");
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
      setSuccessMessage(result.message || 'Thank you! Your enrollment form has been sent.');
      // Reset form
      setFormData({
        parentName: '',
        email: '',
        phone: '',
        interestedDays: [],
        children: [{ name: '', birthday: '' }],
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

  // Helper function to format the date for input display
  const formatDateForInput = (date: string): string => {
    if (!date) return '';
    // Input date fields expect YYYY-MM-DD format
    return date;
  };

  // Helper function to ensure valid date input
  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // On some mobile devices, changing the input type to 'date' on focus can help
    e.currentTarget.setAttribute('type', 'date');
  };

  const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If the date field is empty, revert to a regular text field
    // This helps prevent some mobile browsers from showing their own UI
    if (!e.currentTarget.value) {
      e.currentTarget.setAttribute('type', 'text');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Parent's Name Input */}
      <div className="flex flex-col">
        <label htmlFor="parentName" className="text-sm font-medium text-[#707070] mb-1 text-left">
          Parent's Full Name <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          name="parentName"
          id="parentName"
          required
          value={formData.parentName}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Email Input */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-medium text-[#707070] mb-1 text-left">
          Email Address <span className="text-rose-400">*</span>
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
      <div className="flex flex-col">
        <label htmlFor="phone" className="text-sm font-medium text-[#707070] mb-1 text-left">
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
      <div className="flex flex-col">
        <label className="text-sm font-medium text-[#707070] mb-2 text-left">
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
              <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-[#4d4d4d]">
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Children Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#707070] text-left">Children Information</h3>
        
        {formData.children.map((child, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#707070]">Child #{index + 1}</span>
              {formData.children.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveChild(index)}
                  className="text-[#707070]/70 hover:text-red-700 text-sm focus:outline-none"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="flex flex-col">
              <label htmlFor={`childName-${index}`} className="text-sm font-medium text-[#707070] mb-1 text-left">
                Child's Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                id={`childName-${index}`}
                required
                value={child.name}
                onChange={(e) => handleChildInputChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor={`childBirthday-${index}`} className="text-sm font-medium text-[#707070] mb-1 text-left">
                Birthday <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birthday"
                  id={`childBirthday-${index}`}
                  required
                  value={formatDateForInput(child.birthday)}
                  onChange={(e) => handleChildInputChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                  onFocus={handleDateFocus}
                  onBlur={handleDateBlur}
                  placeholder="MM/DD/YYYY"
                  pattern="\d{4}-\d{2}-\d{2}" 
                  min="2000-01-01"
                  max={new Date().toISOString().split('T')[0]} // Today's date as max
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  style={{
                    /* Ensure the height is sufficient for touch */
                    minHeight: '48px',
                    /* Increase font size for better readability on mobile */
                    fontSize: '16px',
                    /* This prevents iOS from zooming in on focus */
                    touchAction: 'manipulation',
                  }}
                  disabled={isSubmitting}
                  // Additional mobile-specific attributes
                  inputMode="numeric"
                  aria-label={`Birthday for child #${index + 1}`}
                  // Add calendar icon with custom styling
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Please select or enter the child's date of birth
              </p>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddChild}
          disabled={isSubmitting}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-[#707070] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          + Add Another Child
        </button>
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
          {isSubmitting ? 'Sending...' : 'Send Enrollment Inquiry'}
        </button>
      </div>
    </form>
  );
} 
