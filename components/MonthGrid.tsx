import { getMonthMatrix } from '@/lib/calendar';
import Slot from './Slot';
import { slotDB } from '@/mock/slot';
import { format, isSameMonth } from 'date-fns';

export default function MonthGrid({
  date,
  onSelect,
}: {
  date: Date;
  onSelect(id: string): void;
}) {
  const days = getMonthMatrix(date);
  return (
    <div className="grid grid-cols-7 gap-px bg-gray-300 rounded">
      {days.map((day) => {
        const iso = format(day, 'yyyy-MM-dd');
        const slots = slotDB[iso] ?? [];
        return (
          <div
            key={iso}
            className={`min-h-[110px] bg-white p-1 ${isSameMonth(day, date) ? '' : 'opacity-30'}`}
          >
            <div className="mb-1 text-xs font-semibold">{day.getDate()}</div>
            {slots.map((s) => (
              <Slot key={s.id} slotId={s.id} time={s.time} spots={s.spots} onSelect={onSelect} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
