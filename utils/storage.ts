import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "@types/recipe";

const FAVORITES_KEY = "@recipes_favorites";

export const storage = {
  getFavorites: async (): Promise<Recipe[]> => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      return [];
    }
  },

  addFavorite: async (recipe: Recipe): Promise<boolean> => {
    try {
      const favorites = await storage.getFavorites();
      if (!favorites.some((fav) => fav.idMeal === recipe.idMeal)) {
        const newFavorites = [...favorites, recipe];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      return false;
    }
  },

  removeFavorite: async (recipeId: string): Promise<boolean> => {
    try {
      const favorites = await storage.getFavorites();
      const newFavorites = favorites.filter((fav) => fav.idMeal !== recipeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return true;
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      return false;
    }
  },

  isFavorite: async (recipeId: string): Promise<boolean> => {
    try {
      const favorites = await storage.getFavorites();
      return favorites.some((fav) => fav.idMeal === recipeId);
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      return false;
    }
  },
};
