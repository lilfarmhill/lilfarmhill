'use client';
import { getWeek } from '@/lib/calendar';
import Slot from './Slot';
import { slotDB } from '@/mock/slot';
import { format } from 'date-fns';

type Props = {
  date: Date;
  onSelect(id: string): void;
};

export default function WeekGrid({ date, onSelect }: Props) {
  const days = getWeek(date); // 7-day array, Sun-Sat

  return (
    <div className="grid grid-cols-7 gap-px rounded bg-gray-300">
      {days.map((day) => {
        const iso = format(day, 'yyyy-MM-dd');
        const slots = slotDB[iso] ?? [];

        return (
          <div key={iso} className="min-h-[150px] bg-white p-2">
            <div className="mb-1 text-xs font-semibold">
              {format(day, 'EEE d')}
            </div>

            {slots.map((s) => (
              <Slot key={s.id} slotId={s.id} time={s.time} spots={s.spots} onSelect={onSelect} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
