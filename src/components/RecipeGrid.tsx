import type { Recipe, RecipeMatch } from "../types";
import { RecipeCard } from "./RecipeCard";

interface Props {
  matches: RecipeMatch[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export function RecipeGrid({ matches, onSelectRecipe }: Props) {
  if (matches.length === 0) {
    return (
      <div className="empty-state">
        <p>Tiada resipi dijumpai. Cuba pilih lebih banyak bahan atau tukar filter.</p>
      </div>
    );
  }

  return (
    <section className="recipe-grid">
      {matches.map((match) => (
        <RecipeCard
          key={match.recipe.id}
          match={match}
          onClick={onSelectRecipe}
        />
      ))}
    </section>
  );
}
