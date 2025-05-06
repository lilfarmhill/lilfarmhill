/**
 * keyed by ISO date → array of slots
 */
export const slotDB: Record<string, { id: string; time: string; spots: number }[]> = {
    '2025-05-01': [
      { id: 'm0501-1', time: '09:00', spots: 5 },
      { id: 'm0501-2', time: '10:00', spots: 2 },
    ],
    '2025-05-05': [
      { id: 'm0505-1', time: '09:00', spots: 6 },
    ],
    // …extend as needed
  };
  