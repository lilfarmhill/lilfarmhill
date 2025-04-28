// components/BookingCalendar.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
// ** IMPORTANT: Use DayPicker from react-day-picker/dist instead for better CSS targeting **
// If using App Router, check if this specific import path works or if normal import is sufficient with global CSS
import { DayPicker } from 'react-day-picker';
// Alternatively, keep the standard import if the global CSS works:
// import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Keep this import for base styles

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isBefore,
  startOfDay,
  isWithinInterval,
  getDay, // Added for checking weekdays
} from 'date-fns';

import BookingModal from './BookingModal'; // Ensure this path is correct

// --- Data Structures ---
interface TimeSlot {
  id: string;
  time: string;
  status: 'available' | 'booked';
}

interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

// --- Mock Data Generation ---
async function fetchAvailability(start: Date, end: Date): Promise<DayAvailability[]> {
  console.log(`MOCK: Fetching detailed availability from ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}`);
  // --->>> Add a console log right before returning to be sure data is generated
  // console.log("Generating mock data...");
  await new Promise(res => setTimeout(res, 300)); // Simulate network delay

  const days = eachDayOfInterval({ start, end });
  const availabilityData: DayAvailability[] = [];
  const possibleTimes = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM"];
  const today = startOfDay(new Date());

  days.forEach(day => {
    const dayOfWeek = getDay(day); // Use getDay from date-fns
    const dateStr = format(day, 'yyyy-MM-dd');
    const daySlots: TimeSlot[] = [];

    if (dayOfWeek > 0 && dayOfWeek < 6 && !isBefore(day, today)) { // Monday to Friday, not in the past
      possibleTimes.forEach(time => {
        const isBooked = Math.random() > 0.7;
        const slotId = `${dateStr}-${time.replace(/\s/g, '').replace(':', '')}`;
        daySlots.push({
          id: slotId,
          time: time,
          status: isBooked ? 'booked' : 'available',
        });
      });
    }

    if (daySlots.length > 0) {
      availabilityData.push({
        date: dateStr,
        slots: daySlots,
      });
    }
  });
  // --->>> Log the final generated data
  console.log(`MOCK: Generated availability data for ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')}:`, availabilityData);
  return availabilityData;
}


// --- Main Calendar Component ---
export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const visibleRange = useMemo(() => {
    const start = view === 'month' ? startOfMonth(currentDate) : startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = view === 'month' ? endOfMonth(currentDate) : endOfWeek(currentDate, { weekStartsOn: 1 });
    return { start, end };
  }, [currentDate, view]);

  useEffect(() => {
    console.log("Visible range changed, fetching availability...", visibleRange);
    setLoading(true);
    setSelectedSlots([]);
    fetchAvailability(visibleRange.start, visibleRange.end)
      .then(data => {
        // --->>> Log the received data in the component state update
        console.log("Setting availability state:", data);
        setAvailability(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch availability:", error);
        setAvailability([]);
        setLoading(false);
      });
  }, [visibleRange]);

  const handleSlotClick = (slot: TimeSlot, event: React.MouseEvent) => {
    event.stopPropagation();
    if (slot.status !== 'available') return;
    console.log("Slot clicked:", slot.id); // Log clicked slot

    setSelectedSlots(prevSelected => {
        const newSelection = prevSelected.includes(slot.id)
          ? prevSelected.filter(id => id !== slot.id)
          : [...prevSelected, slot.id];
        console.log("Updated selected slots:", newSelection); // Log selection change
        return newSelection;
    });
  };

  const goToNext = () => setCurrentDate(view === 'month' ? addMonths(currentDate, 1) : addWeeks(currentDate, 1));
  const goToPrevious = () => setCurrentDate(view === 'month' ? subMonths(currentDate, 1) : subWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // --- Updated renderDayContent to provide wrapper for CSS ---
  const renderDayContent = (day: Date): React.ReactNode => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const dayAvailability = availability.find(a => a.date === formattedDay);
    const dayNumber = format(day, 'd');
    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
    const isOutsideView = (view === 'month' && !isCurrentMonth); // Simplified outside logic for month
                      // Week view requires checking against visibleRange if implemented differently
    const isPast = isBefore(day, startOfDay(new Date()));

    // --->>> Log data for a specific day to debug rendering
    // if (formattedDay === '2025-05-15') { // Example: Log for May 15th, 2025
    //     console.log(`Rendering day ${formattedDay}:`, dayAvailability);
    // }

    return (
        // This wrapper div will be targeted by the CSS in globals.css
      <div className={`day-content-wrapper ${isPast ? 'text-gray-400' : ''}`}>
        {/* Day number */}
        <span className={`text-xs text-right font-medium ${isOutsideView ? 'text-gray-400' : 'text-gray-700'}`}>
            {dayNumber}
        </span>

        {/* Slots container */}
        <div className="day-slots-container">
          {/* Show loading indicator only inside the current view */}
          {loading && !isOutsideView && <span className="text-gray-400 text-xs italic">...</span>}
          {/* Render slots only if not loading, day has availability, and is not outside the main view */}
          {!loading && !isOutsideView && dayAvailability?.slots.map(slot => {
            const isSelected = selectedSlots.includes(slot.id);
            const isBooked = slot.status === 'booked';
            const isAvailable = slot.status === 'available';

            let slotClasses = "p-1 rounded border text-center transition-colors duration-150 text-xs mb-1 "; // Added mb-1 for spacing
            if (isPast || isBooked) {
              slotClasses += "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed";
            } else if (isSelected) {
              slotClasses += "bg-blue-500 border-blue-600 text-white font-semibold ring-2 ring-blue-300";
            } else if (isAvailable) {
              slotClasses += "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 hover:border-green-400 cursor-pointer";
            }

            return (
              <div key={slot.id} className={slotClasses} onClick={(e) => handleSlotClick(slot, e)}>
                {slot.time}
              </div>
            );
          })}
          {/* Message for days with no slots */}
          {!loading && !isOutsideView && !dayAvailability && !isPast && (
            <span className="text-gray-300 text-xs italic block text-center mt-2"></span> // Display nothing or 'No slots'
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto">
       {/* Header (No changes) */}
       <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button onClick={goToPrevious} className="px-2 py-1 sm:px-3 border rounded hover:bg-gray-100 text-sm sm:text-base shadow-sm">Prev</button>
          <button onClick={goToToday} className="px-2 py-1 sm:px-3 border rounded hover:bg-gray-100 text-sm sm:text-base shadow-sm">Today</button>
          <button onClick={goToNext} className="px-2 py-1 sm:px-3 border rounded hover:bg-gray-100 text-sm sm:text-base shadow-sm">Next</button>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold order-first sm:order-none w-full sm:w-auto text-center">
          {format(currentDate, view === 'month' ? 'MMMM yyyy' : `'Week of' MMM d, yyyy`)}
        </h2>
        <div className="flex items-center space-x-0">
          <button onClick={() => setView('month')} className={`px-2 py-1 sm:px-3 border rounded-l text-sm sm:text-base shadow-sm ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>Month</button>
          <button onClick={() => setView('week')} className={`px-2 py-1 sm:px-3 border border-l-0 rounded-r text-sm sm:text-base shadow-sm ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>Week</button>
        </div>
      </div>

      {/* Calendar Grid - Removed inline <style> */}
      <div className="border rounded shadow-md bg-white overflow-hidden">
        <DayPicker
          key={view} // Add key to force re-render on view change if needed
          mode="none"
          month={currentDate}
          weekStartsOn={1} // Monday
          showOutsideDays={view === 'month'} // Show outside days only in month view
          fixedWeeks={view === 'month'} // Only fix weeks in month view for consistent height
          numberOfMonths={1}
          components={{
              // react-day-picker expects the component rendered inside its button/day structure
              // The CSS targets .rdp-day which contains .rdp-button which contains our DayContent
              DayContent: ({ date, displayMonth }) => {
                 // Only render content if the date is within the displayed month for month view
                 if (view === 'month' && date.getMonth() !== displayMonth.getMonth()) {
                     return <div className="day-content-wrapper opacity-50"><span className="text-xs text-right font-medium text-gray-400">{format(date, 'd')}</span></div>;
                 }
                 // For week view or days within the current month, render normally
                 return renderDayContent(date);
              }
          }}
          // Removed classNames prop, relying on global CSS
        />
      </div>

      {/* Booking Confirmation Trigger (No changes) */}
      {selectedSlots.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-gray-50 text-center shadow">
          <h3 className="font-semibold mb-2 text-gray-800">Selected Slots: {selectedSlots.length}</h3>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Proceed to Book
          </button>
        </div>
      )}

      {/* Booking Modal (No changes needed here if previous code was okay) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedSlotIds={selectedSlots}
        stripePk={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
      />
    </div>
  );
}