import { useState, useCallback, useMemo } from "react";
import { Header } from "./components/Header";
import { IngredientPanel } from "./components/IngredientPanel";
import { MissingCountFilter } from "./components/MissingCountFilter";
import { RecipeGrid } from "./components/RecipeGrid";
import { RecipeModal } from "./components/RecipeModal";
import { useRecipeFilter } from "./hooks/useRecipeFilter";
import type { Ingredient, Recipe } from "./types";
import rawIngredients from "./data/ingredients.json";
import rawRecipes from "./data/recipes.json";

const ingredientsData = rawIngredients as { ingredients: Ingredient[] };
const recipesData = rawRecipes as { recipes: Recipe[] };
import "./App.css";

const DEFAULT_PANTRY = new Set([
  "garam", "gula", "beras", "minyak", "tepung-gandum",
  "bawang-putih", "cili-kering", "bawang-merah", "bawang-besar",
  "serbuk-kunyit", "serbuk-kari", "lada-hitam",
]);

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [maxMissing, setMaxMissing] = useState(-1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [proteinFilter, setProteinFilter] = useState<string | null>(null);

  const toggleIngredient = useCallback((id: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const resetIngredients = useCallback(() => {
    setSelectedIngredients(new Set());
  }, []);

  const selectPantry = useCallback(() => {
    setSelectedIngredients(new Set(DEFAULT_PANTRY));
  }, []);

  const matches = useRecipeFilter(
    recipesData.recipes,
    selectedIngredients,
    maxMissing
  );

  const filteredMatches = useMemo(() => {
    let result = matches;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((m) =>
        m.recipe.title.toLowerCase().includes(q)
      );
    }
    if (proteinFilter) {
      result = result.filter((m) =>
        m.recipe.ingredients.includes(proteinFilter)
      );
    }
    return result;
  }, [matches, searchTerm, proteinFilter]);

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <aside className="sidebar">
          <IngredientPanel
            ingredients={ingredientsData.ingredients}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
            onReset={resetIngredients}
            onSelectPantry={selectPantry}
          />
        </aside>

        <section className="results">
          <MissingCountFilter
            maxMissing={maxMissing}
            onChange={setMaxMissing}
          />

          <div className="protein-filter">
            <span className="filter-label">Protein:</span>
            <div className="filter-chips">
              {[
                { label: "Semua", value: null },
                { label: "🐓 Ayam", value: "ayam" },
                { label: "🥩 Daging", value: "daging" },
                { label: "🐟 Ikan", value: "ikan" },
                { label: "🥚 Telur", value: "telur" },
              ].map((opt) => (
                <button
                  key={opt.value ?? "all"}
                  className={`filter-chip ${proteinFilter === opt.value ? "active" : ""}`}
                  onClick={() => setProteinFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <input
            className="search-input"
            type="search"
            placeholder="Cari resepi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <RecipeGrid matches={filteredMatches} onSelectRecipe={setSelectedRecipe} />
        </section>
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          ingredients={ingredientsData.ingredients}
          selectedIngredients={selectedIngredients}
          onClose={() => setSelectedRecipe(null)}
          onToggleIngredient={toggleIngredient}
        />
      )}
    </div>
  );
}

export default App;
