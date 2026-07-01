import type { Recipe, RecipeMatch, RecipeSource } from "../types";

interface Props {
  match: RecipeMatch;
  onClick: (recipe: Recipe) => void;
}

const SOURCE_LABELS: Record<RecipeSource, string> = {
  "khairul-aming": "Khairul Aming",
  "che-nom": "Che Nom",
  "meor-syamil": "Meor Syamil",
};

function getMatchLabel(matched: number, total: number): string {
  if (matched === total) return `✅ ${matched}/${total}`;
  const missing = total - matched;
  return `⚠️ Kurang ${missing}`;
}

export function RecipeCard({ match, onClick }: Props) {
  const { recipe, matchedCount, totalCount } = match;
  const isExactMatch = matchedCount === totalCount;

  return (
    <article
      className={`recipe-card ${isExactMatch ? "exact-match" : "near-match"}`}
      onClick={() => onClick(recipe)}
    >
      <div className="card-header">
        <span className="card-source">{SOURCE_LABELS[recipe.source]}</span>
        {recipe.prepTime && (
          <span className="card-time">{recipe.prepTime}</span>
        )}
      </div>
      <h3 className="card-title">{recipe.title}</h3>
      <span className="card-match">
        {getMatchLabel(matchedCount, totalCount)}
      </span>
    </article>
  );
}
