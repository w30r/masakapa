import { useEffect, useMemo, useState } from "react";
import type { Recipe, Ingredient, IngredientCategory } from "../types";

interface Props {
  recipe: Recipe;
  ingredients: Ingredient[];
  selectedIngredients: Set<string>;
  onClose: () => void;
  onToggleIngredient: (id: string) => void;
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

export function RecipeModal({
  recipe,
  ingredients,
  selectedIngredients,
  onClose,
  onToggleIngredient,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(
    () => new Set(CATEGORY_ORDER)
  );
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const ingredientMap = useMemo(
    () => new Map(ingredients.map((i) => [i.id, i])),
    [ingredients]
  );

  const grouped = useMemo(() => {
    const groups: Record<IngredientCategory, { id: string; ing: Ingredient | undefined; hasIt: boolean }[]> = {
      protein: [],
      sayur: [],
      aromatik: [],
      perasa: [],
      rempah: [],
      pantry: [],
    };
    for (const ingId of recipe.ingredients) {
      const ing = ingredientMap.get(ingId);
      const cat = ing?.category ?? "pantry";
      groups[cat].push({ id: ingId, ing, hasIt: selectedIngredients.has(ingId) });
    }
    return groups;
  }, [recipe.ingredients, ingredientMap, selectedIngredients]);

  const toggleCategory = (cat: IngredientCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">{recipe.title}</h2>

        <span className="modal-source">
          {recipe.source === "khairul-aming" ? "Khairul Aming" : "Che Nom"}
        </span>

        {recipe.prepTime && (
          <p className="modal-prep">⏱️ {recipe.prepTime}</p>
        )}

        <h3 className="modal-subtitle">Bahan-bahan:</h3>

        <div className="modal-toggle-row">
          <span className={`toggle-label ${!showMissingOnly ? "active" : ""}`}>Semua</span>
          <button
            className={`toggle-switch ${showMissingOnly ? "on" : ""}`}
            onClick={() => setShowMissingOnly((p) => !p)}
            aria-label="Tunjuk bahan tak ada saja"
          >
            <span className="toggle-knob" />
          </button>
          <span className={`toggle-label ${showMissingOnly ? "active" : ""}`}>Tak Ada</span>
        </div>

        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (items.length === 0) return null;
          const filtered = showMissingOnly
            ? items.filter((i) => !i.hasIt)
            : items;
          if (filtered.length === 0) return null;
          const isExpanded = expandedCategories.has(cat);
          return (
            <div key={cat} className="modal-ingredient-group">
              <button
                className="modal-group-header"
                onClick={() => toggleCategory(cat)}
              >
                <span className="modal-group-label">{CATEGORY_LABELS[cat]}</span>
                <span className="modal-group-count">{filtered.length}</span>
                <span className={`modal-chevron ${isExpanded ? "expanded" : ""}`}>▸</span>
              </button>
              {isExpanded && (
                <ul className="ingredient-list">
                  {filtered.map(({ id, ing, hasIt }) => (
                    <li
                      key={id}
                      className={`ingredient-item ${hasIt ? "has-it" : "missing"}`}
                    >
                      <span className="ingredient-status">{hasIt ? "✅" : "❌"}</span>
                      <span>
                        {ing?.emoji} {ing?.name ?? id}
                      </span>
                      {hasIt ? (
                        <button
                          className="ada-btn tak-ada"
                          onClick={() => onToggleIngredient(id)}
                        >
                          Tak Ada
                        </button>
                      ) : (
                        <button
                          className="ada-btn"
                          onClick={() => onToggleIngredient(id)}
                        >
                          Ada
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <a
          href={recipe.videoUrl}
          className="video-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          📺 Tonton di YouTube
        </a>
      </div>
    </div>
  );
}
