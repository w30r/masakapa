# MasakApa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a recipe filtering web app where users select ingredients they have and see which recipes they can cook (from Khairul Aming & Che Nom), plus near-miss suggestions.

**Architecture:** Single-page React app with static JSON data. Filtering via custom `useRecipeFilter` hook using derived state (no extra libraries). Recipe detail in a modal popup. UI in Bahasa Malaysia.

**Tech Stack:** React 19, TypeScript 6, Vite 8 (existing setup). No additional dependencies.

**Global Constraints:**
- UI language: Bahasa Malaysia throughout
- All recipe/ingredient data in static JSON under `src/data/`
- No external state management libraries — `useState` + custom hooks only
- Recipe detail via modal, not separate page
- Responsive layout (desktop + mobile)
- Emoji icons for ingredients where possible

---

### Task 1: TypeScript Types + Data Files

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/ingredients.json`
- Create: `src/data/recipes.json`

**Interfaces:**
- Produces: `Ingredient`, `Recipe`, `IngredientCategory` types; ingredient catalog; recipe collection

- [ ] **Step 1: Create `src/types/index.ts`**

```ts
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

export type RecipeSource = "khairul-aming" | "che-nom";

export interface Recipe {
  id: string;
  title: string;
  source: RecipeSource;
  videoUrl: string;
  imageUrl?: string;
  ingredients: string[]; // array of ingredient IDs
  prepTime?: string;
  servings?: number;
}

export interface RecipeMatch {
  recipe: Recipe;
  matchedCount: number;
  missingCount: number;
  totalCount: number;
}
```

- [ ] **Step 2: Create `src/data/ingredients.json`**

```json
{
  "ingredients": [
    { "id": "ayam", "name": "Ayam", "category": "protein", "emoji": "🐓" },
    { "id": "daging", "name": "Daging", "category": "protein", "emoji": "🥩" },
    { "id": "ikan", "name": "Ikan", "category": "protein", "emoji": "🐟" },
    { "id": "udang", "name": "Udang", "category": "protein", "emoji": "🦐" },
    { "id": "telur", "name": "Telur", "category": "protein", "emoji": "🥚" },
    { "id": "tahu", "name": "Tahu", "category": "protein", "emoji": "🧊" },
    { "id": "bawang-merah", "name": "Bawang Merah", "category": "sayur", "emoji": "🧅" },
    { "id": "bawang-putih", "name": "Bawang Putih", "category": "sayur", "emoji": "🧄" },
    { "id": "bawang-besar", "name": "Bawang Besar", "category": "sayur", "emoji": "🧅" },
    { "id": "halia", "name": "Halia", "category": "sayur", "emoji": "🫚" },
    { "id": "cili-kering", "name": "Cili Kering", "category": "sayur", "emoji": "🌶️" },
    { "id": "cili-api", "name": "Cili Api", "category": "sayur", "emoji": "🌶️" },
    { "id": "cili-merah", "name": "Cili Merah", "category": "sayur", "emoji": "🌶️" },
    { "id": "tomato", "name": "Tomato", "category": "sayur", "emoji": "🍅" },
    { "id": "kentang", "name": "Kentang", "category": "sayur", "emoji": "🥔" },
    { "id": "lobak-merah", "name": "Lobak Merah", "category": "sayur", "emoji": "🥕" },
    { "id": "kobis", "name": "Kobis", "category": "sayur", "emoji": "🥬" },
    { "id": "terung", "name": "Terung", "category": "sayur", "emoji": "🍆" },
    { "id": "bendi", "name": "Bendi", "category": "sayur", "emoji": "🫘" },
    { "id": "kacang-panjang", "name": "Kacang Panjang", "category": "sayur", "emoji": "🫛" },
    { "id": "serai", "name": "Serai", "category": "aromatik", "emoji": "🌿" },
    { "id": "lengkuas", "name": "Lengkuas", "category": "aromatik", "emoji": "🌿" },
    { "id": "kunyit-hidup", "name": "Kunyit Hidup", "category": "aromatik", "emoji": "🌿" },
    { "id": "daun-limau", "name": "Daun Limau", "category": "aromatik", "emoji": "🍃" },
    { "id": "daun-pandan", "name": "Daun Pandan", "category": "aromatik", "emoji": "🍃" },
    { "id": "daun-kari", "name": "Daun Kari", "category": "aromatik", "emoji": "🍃" },
    { "id": "daun-bawang", "name": "Daun Bawang", "category": "aromatik", "emoji": "🧅" },
    { "id": "daun-ketumbar", "name": "Daun Ketumbar", "category": "aromatik", "emoji": "🌿" },
    { "id": "santan", "name": "Santan", "category": "perasa", "emoji": "🥥" },
    { "id": "kerisik", "name": "Kerisik", "category": "perasa", "emoji": "🥥" },
    { "id": "garam", "name": "Garam", "category": "perasa", "emoji": "🧂" },
    { "id": "gula", "name": "Gula", "category": "perasa", "emoji": "🍚" },
    { "id": "kicap", "name": "Kicap", "category": "perasa", "emoji": "🫗" },
    { "id": "kicap-manis", "name": "Kicap Manis", "category": "perasa", "emoji": "🫗" },
    { "id": "sos-tomato", "name": "Sos Tomato", "category": "perasa", "emoji": "🥫" },
    { "id": "sos-cili", "name": "Sos Cili", "category": "perasa", "emoji": "🌶️" },
    { "id": "belacan", "name": "Belacan", "category": "perasa", "emoji": "🦐" },
    { "id": "serbuk-kunyit", "name": "Serbuk Kunyit", "category": "rempah", "emoji": "🟡" },
    { "id": "serbuk-cili", "name": "Serbuk Cili", "category": "rempah", "emoji": "🔴" },
    { "id": "serbuk-kari", "name": "Serbuk Kari", "category": "rempah", "emoji": "🟠" },
    { "id": "serbuk-jintan", "name": "Serbuk Jintan", "category": "rempah", "emoji": "🟤" },
    { "id": "serbuk-ketumbar", "name": "Serbuk Ketumbar", "category": "rempah", "emoji": "🟤" },
    { "id": "lada-hitam", "name": "Lada Hitam", "category": "rempah", "emoji": "⚫" },
    { "id": "minyak", "name": "Minyak Masak", "category": "pantry", "emoji": "🫒" },
    { "id": "beras", "name": "Beras", "category": "pantry", "emoji": "🍚" },
    { "id": "tepung-gandum", "name": "Tepung Gandum", "category": "pantry", "emoji": "🌾" },
    { "id": "tepung-beras", "name": "Tepung Beras", "category": "pantry", "emoji": "🌾" },
    { "id": "bawang-goreng", "name": "Bawang Goreng", "category": "pantry", "emoji": "🧅" }
  ]
}
```

- [ ] **Step 3: Create `src/data/recipes.json`**

```json
{
  "recipes": [
    {
      "id": "ayam-masak-merah",
      "title": "Ayam Masak Merah",
      "source": "khairul-aming",
      "videoUrl": "https://youtube.com/watch?v=example1",
      "ingredients": ["ayam", "bawang-merah", "bawang-putih", "halia", "cili-kering", "tomato", "sos-tomato", "gula", "garam", "minyak"],
      "prepTime": "45 min",
      "servings": 4
    },
    {
      "id": "sambal-telur",
      "title": "Sambal Telur",
      "source": "khairul-aming",
      "videoUrl": "https://youtube.com/watch?v=example2",
      "ingredients": ["telur", "cili-kering", "bawang-merah", "bawang-putih", "belacan", "gula", "garam", "minyak"],
      "prepTime": "20 min",
      "servings": 3
    },
    {
      "id": "ayam-goreng-berempah",
      "title": "Ayam Goreng Berempah",
      "source": "khairul-aming",
      "videoUrl": "https://youtube.com/watch?v=example3",
      "ingredients": ["ayam", "serbuk-kunyit", "serbuk-kari", "garam", "tepung-beras", "tepung-gandum", "minyak"],
      "prepTime": "35 min",
      "servings": 4
    },
    {
      "id": "dalca-sayur",
      "title": "Dalca Sayur",
      "source": "khairul-aming",
      "videoUrl": "https://youtube.com/watch?v=example4",
      "ingredients": ["kentang", "lobak-merah", "terung", "kacang-panjang", "bendi", "bawang-merah", "bawang-putih", "halia", "serbuk-kari", "santan", "garam", "gula", "minyak"],
      "prepTime": "40 min",
      "servings": 5
    },
    {
      "id": "rendang-ayam",
      "title": "Rendang Ayam",
      "source": "che-nom",
      "videoUrl": "https://youtube.com/watch?v=example5",
      "ingredients": ["ayam", "santan", "kerisik", "serai", "lengkuas", "kunyit-hidup", "daun-limau", "cili-kering", "bawang-merah", "bawang-putih", "garam", "gula", "minyak"],
      "prepTime": "90 min",
      "servings": 6
    },
    {
      "id": "kari-ayam",
      "title": "Kari Ayam",
      "source": "che-nom",
      "videoUrl": "https://youtube.com/watch?v=example6",
      "ingredients": ["ayam", "kentang", "bawang-merah", "bawang-putih", "halia", "serbuk-kari", "santan", "daun-kari", "cili-api", "garam", "gula", "minyak"],
      "prepTime": "50 min",
      "servings": 5
    },
    {
      "id": "sup-daging",
      "title": "Sup Daging",
      "source": "che-nom",
      "videoUrl": "https://youtube.com/watch?v=example7",
      "ingredients": ["daging", "kentang", "lobak-merah", "bawang-merah", "bawang-putih", "halia", "serbuk-kari", "daun-bawang", "lada-hitam", "garam", "minyak"],
      "prepTime": "60 min",
      "servings": 4
    },
    {
      "id": "tahu-bergedil",
      "title": "Tahu Bergedil",
      "source": "che-nom",
      "videoUrl": "https://youtube.com/watch?v=example8",
      "ingredients": ["tahu", "kentang", "telur", "daun-bawang", "bawang-merah", "bawang-putih", "garam", "minyak"],
      "prepTime": "30 min",
      "servings": 4
    },
    {
      "id": "ikan-bakar",
      "title": "Ikan Bakar",
      "source": "khairul-aming",
      "videoUrl": "https://youtube.com/watch?v=example9",
      "ingredients": ["ikan", "serai", "kunyit-hidup", "cili-api", "bawang-merah", "bawang-putih", "garam", "minyak"],
      "prepTime": "35 min",
      "servings": 3
    },
    {
      "id": "nasi-lemak",
      "title": "Nasi Lemak",
      "source": "che-nom",
      "videoUrl": "https://youtube.com/watch?v=example10",
      "ingredients": ["beras", "santan", "daun-pandan", "halia", "bawang-merah", "bawang-putih", "garam"],
      "prepTime": "40 min",
      "servings": 4
    }
  ]
}
```

---

### Task 2: `useRecipeFilter` Hook

**Files:**
- Create: `src/hooks/useRecipeFilter.ts`

**Interfaces:**
- Consumes: `Recipe[]`, `Set<string>` (selected ingredient IDs), `number` (maxMissing)
- Produces: `RecipeMatch[]` (sorted: best match first)

- [ ] **Step 1: Create `src/hooks/useRecipeFilter.ts`**

```ts
import { useMemo } from "react";
import type { Recipe, RecipeMatch } from "../types";

export function useRecipeFilter(
  recipes: Recipe[],
  selectedIngredients: Set<string>,
  maxMissing: number // -1 = semua, 0 = tepat, 1 = kurang 1, dll.
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
        // Exact match first, then by missing count ascending
        if (a.missingCount !== b.missingCount)
          return a.missingCount - b.missingCount;
        // Then by most matched count descending
        return b.matchedCount - a.matchedCount;
      });
  }, [recipes, selectedIngredients, maxMissing]);
}
```

---

### Task 3: IngredientChip + IngredientPanel

**Files:**
- Create: `src/components/IngredientChip.tsx`
- Create: `src/components/IngredientPanel.tsx`

**Interfaces:**
- Consumes: `Ingredient[]`, `Set<string>` (selected IDs), `(id: string) => void` (toggle handler)
- Produces: Rendered ingredient chips grouped by category

- [ ] **Step 1: Create `src/components/IngredientChip.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/IngredientPanel.tsx`**

```tsx
import { useMemo } from "react";
import type { Ingredient, IngredientCategory } from "../types";
import { IngredientChip } from "./IngredientChip";

interface Props {
  ingredients: Ingredient[];
  selectedIngredients: Set<string>;
  onToggleIngredient: (id: string) => void;
}

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  protein: "Protein",
  sayur: "Sayur-Sayuran",
  aromatik: "Aromatik",
  perasa: "Perasa",
  rempah: "Rempah",
  pantry: "Pantry",
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
}: Props) {
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

  return (
    <section className="ingredient-panel">
      <h2 className="panel-title">Bahan yang ada di peti sejuk 🧊</h2>
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} className="ingredient-category">
          <h3 className="category-label">{CATEGORY_LABELS[cat]}</h3>
          <div className="chip-grid">
            {grouped[cat].map((ing) => (
              <IngredientChip
                key={ing.id}
                ingredient={ing}
                isSelected={selectedIngredients.has(ing.id)}
                onToggle={onToggleIngredient}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
```

---

### Task 4: MissingCountFilter

**Files:**
- Create: `src/components/MissingCountFilter.tsx`

**Interfaces:**
- Consumes: `number` (current maxMissing), `(value: number) => void` (onChange)
- Produces: Filter bar with preset chips

- [ ] **Step 1: Create `src/components/MissingCountFilter.tsx`**

```tsx
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
```

---

### Task 5: RecipeCard + RecipeGrid

**Files:**
- Create: `src/components/RecipeCard.tsx`
- Create: `src/components/RecipeGrid.tsx`

**Interfaces:**
- Consumes: `RecipeMatch[]`, `(recipe: Recipe) => void` (on click)
- Produces: Grid of recipe cards with match badges

- [ ] **Step 1: Create `src/components/RecipeCard.tsx`**

```tsx
import type { Recipe, RecipeMatch } from "../types";
import type { RecipeSource } from "../types";

interface Props {
  match: RecipeMatch;
  onClick: (recipe: Recipe) => void;
}

const SOURCE_LABELS: Record<RecipeSource, string> = {
  "khairul-aming": "Khairul Aming",
  "che-nom": "Che Nom",
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
        {recipe.prepTime && <span className="card-time">{recipe.prepTime}</span>}
      </div>
      <h3 className="card-title">{recipe.title}</h3>
      <span className="card-match">{getMatchLabel(matchedCount, totalCount)}</span>
    </article>
  );
}
```

- [ ] **Step 2: Create `src/components/RecipeGrid.tsx`**

```tsx
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
```

---

### Task 6: RecipeModal

**Files:**
- Create: `src/components/RecipeModal.tsx`

**Interfaces:**
- Consumes: `Recipe` (selected), `Set<string>` (selectedIngredients), `() => void` (onClose)
- Produces: Modal overlay with ingredient checklist and video link

- [ ] **Step 1: Create `src/components/RecipeModal.tsx`**

```tsx
import { useEffect } from "react";
import type { Recipe } from "../types";
import type { Ingredient } from "../types";

interface Props {
  recipe: Recipe;
  ingredients: Ingredient[];
  selectedIngredients: Set<string>;
  onClose: () => void;
}

export function RecipeModal({
  recipe,
  ingredients,
  selectedIngredients,
  onClose,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const ingredientMap = new Map(ingredients.map((i) => [i.id, i]));

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
        <ul className="ingredient-list">
          {recipe.ingredients.map((ingId) => {
            const ing = ingredientMap.get(ingId);
            const hasIt = selectedIngredients.has(ingId);
            return (
              <li
                key={ingId}
                className={`ingredient-item ${hasIt ? "has-it" : "missing"}`}
              >
                <span className="ingredient-status">{hasIt ? "✅" : "❌"}</span>
                <span>
                  {ing?.emoji} {ing?.name ?? ingId}
                </span>
                <span className="ingredient-note">
                  {hasIt ? "— anda ada" : "— tak ada"}
                </span>
              </li>
            );
          })}
        </ul>

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
```

---

### Task 7: App Composition + Header + Styling

**Files:**
- Create: `src/components/Header.tsx`
- Modify: `src/App.tsx` (replace default template)
- Modify: `src/App.css` (full app styles)

- [ ] **Step 1: Create `src/components/Header.tsx`**

```tsx
export function Header() {
  return (
    <header className="app-header">
      <h1 className="app-title">🍳 MasakApa</h1>
      <p className="app-subtitle">
        Pilih bahan yang ada, kita carikan resipi untuk kamu!
      </p>
    </header>
  );
}
```

- [ ] **Step 2: Replace `src/App.tsx`**

```tsx
import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { IngredientPanel } from "./components/IngredientPanel";
import { MissingCountFilter } from "./components/MissingCountFilter";
import { RecipeGrid } from "./components/RecipeGrid";
import { RecipeModal } from "./components/RecipeModal";
import { useRecipeFilter } from "./hooks/useRecipeFilter";
import type { Recipe } from "./types";
import ingredientsData from "./data/ingredients.json";
import recipesData from "./data/recipes.json";
import "./App.css";

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [maxMissing, setMaxMissing] = useState(-1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const toggleIngredient = useCallback((id: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const matches = useRecipeFilter(
    recipesData.recipes,
    selectedIngredients,
    maxMissing
  );

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <aside className="sidebar">
          <IngredientPanel
            ingredients={ingredientsData.ingredients}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
          />
        </aside>

        <section className="results">
          <MissingCountFilter
            maxMissing={maxMissing}
            onChange={setMaxMissing}
          />
          <RecipeGrid matches={matches} onSelectRecipe={setSelectedRecipe} />
        </section>
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          ingredients={ingredientsData.ingredients}
          selectedIngredients={selectedIngredients}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default App;
```

- [ ] **Step 3: Replace `src/App.css`**

```css
/* ===== Layout ===== */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 24px;
  padding: 0 24px 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
}

.results {
  flex: 1;
  min-width: 0;
}

/* ===== Header ===== */
.app-header {
  text-align: center;
  padding: 32px 24px 16px;
}

.app-title {
  font-size: 48px;
  margin: 0;
  color: var(--text-h);
}

.app-subtitle {
  color: var(--text);
  margin: 8px 0 0;
  font-size: 16px;
}

/* ===== Ingredient Panel ===== */
.ingredient-panel {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.panel-title {
  font-size: 18px;
  margin: 0 0 16px;
  color: var(--text-h);
}

.ingredient-category {
  margin-bottom: 16px;
}

.ingredient-category:last-child {
  margin-bottom: 0;
}

.category-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text);
  margin: 0 0 8px;
  opacity: 0.7;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ingredient-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-h);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.ingredient-chip:hover {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.ingredient-chip.selected {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.chip-emoji {
  font-size: 15px;
}

/* ===== Missing Count Filter ===== */
.missing-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.filter-chips {
  display: flex;
  gap: 6px;
}

.filter-chip {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-h);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.filter-chip:hover {
  border-color: var(--accent);
}

.filter-chip.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

/* ===== Recipe Grid ===== */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text);
  border: 2px dashed var(--border);
  border-radius: 12px;
}

/* ===== Recipe Card ===== */
.recipe-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recipe-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.recipe-card.exact-match {
  border-left: 3px solid #22c55e;
}

.recipe-card.near-match {
  border-left: 3px solid #f59e0b;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-source {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--accent);
}

.card-time {
  font-size: 12px;
  color: var(--text);
}

.card-title {
  font-size: 16px;
  margin: 0;
  color: var(--text-h);
  font-weight: 500;
}

.card-match {
  font-size: 13px;
  font-weight: 500;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: var(--bg);
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text);
  padding: 4px 8px;
  border-radius: 6px;
}

.modal-close:hover {
  background: var(--code-bg);
}

.modal-title {
  font-size: 24px;
  margin: 0 0 4px;
  color: var(--text-h);
  padding-right: 32px;
}

.modal-source {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}

.modal-prep {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text);
}

.modal-subtitle {
  font-size: 16px;
  margin: 20px 0 12px;
  color: var(--text-h);
}

.ingredient-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.ingredient-item.has-it {
  background: rgba(34, 197, 94, 0.1);
}

.ingredient-item.missing {
  background: rgba(239, 68, 68, 0.08);
}

.ingredient-status {
  font-size: 16px;
  flex-shrink: 0;
}

.ingredient-note {
  margin-left: auto;
  font-size: 12px;
  color: var(--text);
  opacity: 0.7;
}

.video-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  padding: 12px;
  background: var(--accent);
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: opacity 0.15s ease;
}

.video-link:hover {
  opacity: 0.9;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 0 16px 16px;
  }

  .sidebar {
    width: 100%;
  }

  .app-title {
    font-size: 32px;
  }

  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .modal-content {
    padding: 24px 20px;
    max-height: 85vh;
  }
}
```

---

### Task 8: Update `src/index.css` (CSS Variables)

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace `src/index.css`**

```css
:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --card-bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #e85d3a;
  --accent-bg: rgba(232, 93, 58, 0.1);
  --accent-border: rgba(232, 93, 58, 0.4);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow: rgba(0, 0, 0, 0.08) 0 4px 12px;

  --sans: system-ui, "Segoe UI", Roboto, sans-serif;
  --heading: system-ui, "Segoe UI", Roboto, sans-serif;

  font: 16px/150% var(--sans);
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --card-bg: #1e1f2b;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #f07c5a;
    --accent-bg: rgba(240, 124, 90, 0.15);
    --accent-border: rgba(240, 124, 90, 0.4);
    --shadow: rgba(0, 0, 0, 0.3) 0 4px 12px;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

h1, h2, h3 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

#root {
  width: 100%;
  max-width: 100%;
}

button {
  font-family: inherit;
}
```

---

### Task 9: Run and Verify

- [ ] **Step 1: Run the dev server**

```bash
cd C:\GetSTACKED2024\masakapa
npm run dev
```

Expected output: Vite dev server starts on `http://localhost:5173`

- [ ] **Step 2: Verify in browser**
  1. Page loads with header "MasakApa"
  2. Ingredient categories visible (Protein, Sayur-Sayuran, etc.)
  3. Clicking an ingredient chip toggles its selection (orange highlight)
  4. Filter chips (Semua / Tepat / Kurang 1 / Kurang 2) work
  5. With no ingredients selected → all 10 recipes shown
  6. Select "Ayam" only → recipes with ayam shown, sorted by match
  7. Select "Ayam" + "Bawang Merah" + "Bawang Putih" → matches improve
  8. Click recipe card → modal opens with ingredient checklist
  9. Modal shows ✅/❌ correctly per ingredient
  10. "Tonton di YouTube" link opens in new tab
  11. Close modal with ✕ button or Escape key
  12. Resize browser → layout stacks vertically on mobile
