import { Category, Recipe } from "@types/recipe";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error);
    return null;
  }
}

export const recipeApi = {
  getRecipesByCategory: async (
    category: string = "Seafood",
  ): Promise<Recipe[]> => {
    const data = await fetchAPI<{ meals: Recipe[] | null }>(
      `/filter.php?c=${category}`,
    );
    return data?.meals || [];
  },

  getRecipeDetails: async (id: string): Promise<Recipe | null> => {
    const data = await fetchAPI<{ meals: Recipe[] | null }>(
      `/lookup.php?i=${id}`,
    );
    return data?.meals?.[0] || null;
  },

  getCategories: async (): Promise<Category[]> => {
    const data = await fetchAPI<{ categories: Category[] | null }>(
      `/categories.php`,
    );
    return data?.categories || [];
  },

  searchRecipes: async (query: string): Promise<Recipe[]> => {
    if (query.length < 2) return [];

    const data = await fetchAPI<{ meals: Recipe[] | null }>(
      `/search.php?s=${query}`,
    );
    return data?.meals || [];
  },
};
