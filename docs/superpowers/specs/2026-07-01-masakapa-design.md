# MasakApa — Design Spec

## Ringkasan (Summary)
Aplikasi web carian resipi berdasarkan bahan yang ada di peti sejuk. Pengguna pilih bahan yang mereka ada, dan aplikasi akan menapis resipi yang boleh dimasak. Resipi diambil dari Khairul Aming dan Che Nom. Aplikasi juga akan tunjuk resipi yang **hampir boleh dimasak** (kurang 1-2 bahan).

## Tech Stack
- **Frontend:** React 19 + TypeScript 6 + Vite 8 (sedia ada)
- **State Management:** React `useState` + custom hooks — tiada dependency tambahan
- **Routing:** SPA single-page — modal untuk detail resipi
- **Data:** Static JSON dalam `src/data/`

## Data Model

### Ingredient
```ts
{
  id: string,        // e.g. "bawang-merah"
  name: string,      // e.g. "Bawang Merah"
  category: "protein" | "sayur" | "aromatik" | "perasa" | "rempah" | "pantry"
  emoji?: string     // optional 🧅
}
```

### Recipe
```ts
{
  id: string,
  title: string,             // e.g. "Ayam Masak Merah"
  source: "khairul-aming" | "che-nom",
  videoUrl: string,          // YouTube link
  imageUrl?: string,         // optional thumbnail
  ingredients: string[],     // array of ingredient IDs
  prepTime?: string,
  servings?: number
}
```

## Seni Bina Komponen (Component Architecture)

```
src/
  data/
    ingredients.json          # Senarai bahan-bahan
    recipes-khairul.json      # Resipi dari Khairul Aming
    recipes-chenom.json       # Resipi dari Che Nom
  components/
    Header.tsx                # Tajuk app + logo
    IngredientPanel.tsx       # Panel pemilihan bahan (berkategori)
    IngredientChip.tsx        # Chip untuk satu bahan
    RecipeCard.tsx            # Kad resipi
    RecipeGrid.tsx            # Grid kad resipi
    RecipeModal.tsx           # Popup detail resipi
    MissingCountFilter.tsx    # Filter bilangan bahan kurang
  hooks/
    useRecipeFilter.ts       # Logic penapisan resipi
  types/
    index.ts                  # TypeScript types
  App.tsx                     # Halaman utama
  App.css                     # Gaya
```

## Aliran Data (Data Flow)

1. Pengguna pilih bahan → `IngredientPanel` kemas kini `selectedIngredients: Set<string>`
2. `useRecipeFilter` menerima `selectedIngredients` + `maxMissing` (filter)
3. Untuk setiap resipi, kira:
   - `matchedIngredients = ingredients.filter(i => selectedIngredients.has(i))`
   - `missingCount = ingredients.length - matchedIngredients.length`
4. Tapis: resipi dengan `missingCount <= maxMissing` sahaja ditunjuk
5. Susun: exact match dulu, kemudian kurang 1, kurang 2, ...
6. Kad tunjuk badge: ✅ "5/5" / ⚠️ "Kurang 1" / ❌ "Kurang 3"
7. Klik kad → `RecipeModal` dengan senarai bahan (✅ ada / ❌ tak ada) + pautan YouTube

## Ciri-ciri (Features)

### 1. Pemilihan Bahan
- Bahan dikumpul dalam kategori (Protein, Sayur, Aromatik, Perasa, Rempah, Pantry)
- Setiap bahan adalah chip yang boleh toggle (pilih / nyah pilih)
- Kategori boleh dilipat (collapsible) untuk skrin kecil

### 2. Penapisan Resipi
- Filter "Kurang bahan": chips untuk Semua / Tepat / Kurang 1 / Kurang 2
- Kadar padanan dikira dan dipaparkan pada setiap kad
- Resipi yang kurang 3+ bahan akan dikelabukan (dim) atau disembunyikan

### 3. Paparan Resipi
- Kad: gambar (jika ada), nama resipi, sumber (Khairul Aming / Che Nom), badge padanan
- Modal: senarai bahan penuh dengan tanda ✅/❌, pautan video YouTube
- Butang "Tonton di YouTube" buka pautan dalam tab baru

### 4. Mobiliti (Responsive)
- Storan bahan di atas, grid resipi di bawah
- Pada skrin telefon: kategori bahan dalam accordion, grid resipi 2 kolum
- Modal guna full-screen pada skrin kecil

## Fasa Pembangunan (Implementation Phases)

**Fasa 1 — Asas**
1. Setup TypeScript types (`types/index.ts`)
2. Data ingredient contoh (`data/ingredients.json`)
3. Data resipi contoh (5-10 resipi, gabungan kedua-dua sumber)
4. `useRecipeFilter` hook
5. `IngredientPanel` + `IngredientChip`
6. `RecipeCard` + `RecipeGrid`
7. `Header` + susun atur `App.tsx`
8. Gaya asas (App.css)

**Fasa 2 — Detail & Filter**
9. `MissingCountFilter`
10. `RecipeModal` dengan senarai bahan ✅/❌
11. Pautan video YouTube

**Fasa 3 — Polishing**
12. Responsive design untuk mobile
13. Animasi/layout tambahan
14. Lebih banyak resipi data

## Verifikasi
- `npm run dev` untuk lihat app dalam browser
- Pilih beberapa bahan → resipi yang sepadan muncul
- Tukar filter "Kurang bahan" → senarai berubah
- Klik kad → modal muncul dengan detail betul
- Ubah saiz browser → layout responsif
