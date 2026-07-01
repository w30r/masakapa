export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  emoji?: string;
}

export type IngredientCategory =
  | "protein"
  | "sayur"
  | "aromatik"
  | "perasa"
  | "rempah"
  | "pantry";

export type RecipeSource = "khairul-aming" | "che-nom" | "meor-syamil";

export interface Recipe {
  id: string;
  title: string;
  source: RecipeSource;
  videoUrl: string;
  imageUrl?: string;
  ingredients: string[];
  prepTime?: string;
  servings?: number;
}

export interface RecipeMatch {
  recipe: Recipe;
  matchedCount: number;
  missingCount: number;
  totalCount: number;
}
