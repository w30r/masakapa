import { useMemo, useState } from "react";
import type { Ingredient, IngredientCategory } from "../types";
import { IngredientChip } from "./IngredientChip";

interface Props {
  ingredients: Ingredient[];
  selectedIngredients: Set<string>;
  onToggleIngredient: (id: string) => void;
  onReset: () => void;
  onSelectPantry: () => void;
}

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  protein: "🥩 Protein",
  sayur: "🥬 Sayur-Sayuran",
  aromatik: "🌿 Aromatik",
  perasa: "🧂 Perasa",
  rempah: "🍛 Rempah",
  pantry: "🫒 Pantry",
};

const CATEGORY_ORDER: IngredientCategory[] = [
  "protein",
  "sayur",
  "aromatik",
  "perasa",
  "rempah",
  "pantry",
];

export function IngredientPanel({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  onReset,
  onSelectPantry,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(
    () => new Set(CATEGORY_ORDER)
  );

  const grouped = useMemo(() => {
    const map: Record<IngredientCategory, Ingredient[]> = {
      protein: [],
      sayur: [],
      aromatik: [],
      perasa: [],
      rempah: [],
      pantry: [],
    };
    for (const ing of ingredients) {
      map[ing.category].push(ing);
    }
    return map;
  }, [ingredients]);

  const toggleCategory = (cat: IngredientCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <section className="ingredient-panel">
      <div className="panel-title-row">
        <h2 className="panel-title">PILIH BAHAN APA YANG ADA</h2>
        {expandedCategories.size > 0 && (
          <button className="collapse-all-btn" onClick={collapseAll} title="Tutup Semua">
            ▲ Tutup
          </button>
        )}
      </div>
      <button className="pantry-btn" onClick={onSelectPantry}>
        📦 Barang Biasa Ada
      </button>
      {selectedIngredients.size > 0 && (
        <button className="reset-btn" onClick={onReset}>
          ✕ Semula
        </button>
      )}
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped[cat];
        const isExpanded = expandedCategories.has(cat);
        return (
          <div key={cat} className="ingredient-category">
            <button
              className="category-header"
              onClick={() => toggleCategory(cat)}
            >
              <span className="category-label">{CATEGORY_LABELS[cat]}</span>
              <span className="category-count">{items.length}</span>
              <span className={`category-chevron ${isExpanded ? "expanded" : ""}`}>▸</span>
            </button>
            {isExpanded && (
              <div className="chip-grid">
                {items.map((ing) => (
                  <IngredientChip
                    key={ing.id}
                    ingredient={ing}
                    isSelected={selectedIngredients.has(ing.id)}
                    onToggle={onToggleIngredient}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
