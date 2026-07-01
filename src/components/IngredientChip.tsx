import type { Ingredient } from "../types";

interface Props {
  ingredient: Ingredient;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function IngredientChip({ ingredient, isSelected, onToggle }: Props) {
  return (
    <button
      className={`ingredient-chip ${isSelected ? "selected" : ""}`}
      onClick={() => onToggle(ingredient.id)}
      aria-pressed={isSelected}
    >
      {ingredient.emoji && <span className="chip-emoji">{ingredient.emoji}</span>}
      <span>{ingredient.name}</span>
    </button>
  );
}
