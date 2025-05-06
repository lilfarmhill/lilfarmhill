type Props = { slotId: string; time: string; spots: number; onSelect(id: string): void };

export default function Slot({ slotId, time, spots, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(slotId)}
      className="w-full rounded border border-gray-300 py-1 text-sm hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-30"
      disabled={spots === 0}
    >
      {time} · {spots}
    </button>
  );
}
