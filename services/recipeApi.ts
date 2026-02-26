import { Category, Recipe } from "@types/recipe";
import axios from "axios";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export const recipeApi = {
  getRecipesByCategory: async (
    category: string = "Seafood",
  ): Promise<Recipe[]> => {
    try {
      const response = await axios.get(`${API_BASE}/filter.php?c=${category}`);
      return response.data.meals || [];
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      return [];
    }
  },

  getRecipeDetails: async (id: string): Promise<Recipe | null> => {
    try {
      const response = await axios.get(`${API_BASE}/lookup.php?i=${id}`);
      return response.data.meals?.[0] || null;
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      return null;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get(`${API_BASE}/categories.php`);
      return response.data.categories || [];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  },

  searchRecipes: async (query: string): Promise<Recipe[]> => {
    if (query.length < 2) return [];
    try {
      const response = await axios.get(`${API_BASE}/search.php?s=${query}`);
      return response.data.meals || [];
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      return [];
    }
  },
};
