interface CategoryChipProps {
  category: string;
}

export function CategoryChip({ category }: CategoryChipProps) {
  return (
    <span className="inline-flex items-center rounded-sm border border-ink-300 bg-white px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ink-600">
      {category}
    </span>
  );
}
