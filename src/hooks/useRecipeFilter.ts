import { useMemo } from "react";
import type { Recipe, RecipeMatch } from "../types";

export function useRecipeFilter(
  recipes: Recipe[],
  selectedIngredients: Set<string>,
  maxMissing: number
): RecipeMatch[] {
  return useMemo(() => {
    return recipes
      .map((recipe) => {
        const matchedCount = recipe.ingredients.filter((id) =>
          selectedIngredients.has(id)
        ).length;
        const totalCount = recipe.ingredients.length;
        const missingCount = totalCount - matchedCount;
        return { recipe, matchedCount, missingCount, totalCount };
      })
      .filter(
        ({ missingCount }) => maxMissing < 0 || missingCount <= maxMissing
      )
      .sort((a, b) => {
        if (a.missingCount !== b.missingCount)
          return a.missingCount - b.missingCount;
        return b.matchedCount - a.matchedCount;
      });
  }, [recipes, selectedIngredients, maxMissing]);
}
