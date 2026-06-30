import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { initialRecipes, type Recipe } from './data';

type RecipeStore = {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  toggleFavorite: (recipeId: string) => void;
  getRecipe: (recipeId: string) => Recipe | undefined;
};

const RecipeContext = createContext<RecipeStore | null>(null);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  const value = useMemo<RecipeStore>(
    () => ({
      recipes,
      addRecipe: (recipe) => setRecipes((current) => [recipe, ...current]),
      toggleFavorite: (recipeId) =>
        setRecipes((current) =>
          current.map((recipe) =>
            recipe.id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe,
          ),
        ),
      getRecipe: (recipeId) => recipes.find((recipe) => recipe.id === recipeId),
    }),
    [recipes],
  );

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipes() {
  const store = useContext(RecipeContext);
  if (!store) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return store;
}
