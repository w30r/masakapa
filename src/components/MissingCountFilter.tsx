interface Props {
  maxMissing: number;
  onChange: (value: number) => void;
}

const OPTIONS = [
  { label: "Semua", value: -1 },
  { label: "Tepat", value: 0 },
  { label: "Kurang 1", value: 1 },
  { label: "Kurang 2", value: 2 },
];

export function MissingCountFilter({ maxMissing, onChange }: Props) {
  return (
    <div className="missing-filter">
      <span className="filter-label">Kurang bahan:</span>
      <div className="filter-chips">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`filter-chip ${maxMissing === opt.value ? "active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
