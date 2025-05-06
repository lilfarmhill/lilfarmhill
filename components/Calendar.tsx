'use client';
import { useState } from 'react';
import { addMonths, subMonths, addWeeks, subWeeks, format } from 'date-fns';
import MonthGrid from './MonthGrid';
import WeekGrid from './WeekGrid';
import SlotModal from './SlotModal';

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => setCursor(view === 'month' ? subMonths(cursor, 1) : subWeeks(cursor, 1))}>
          ‹
        </button>
        <h2 className="flex-1 text-center text-lg font-bold">
          {format(cursor, view === 'month' ? 'LLLL yyyy' : 'MMM d')}
        </h2>
        <button onClick={() => setCursor(view === 'month' ? addMonths(cursor, 1) : addWeeks(cursor, 1))}>
          ›
        </button>

        <select
          className="ml-4 rounded border px-2 py-1"
          value={view}
          onChange={(e) => setView(e.target.value as any)}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>

      {view === 'month' ? (
        <MonthGrid date={cursor} onSelect={setActiveSlot} />
      ) : (
        <WeekGrid date={cursor} onSelect={setActiveSlot} />
      )}

      {activeSlot && <SlotModal slotId={activeSlot} onClose={() => setActiveSlot(null)} />}
    </>
  );
}
