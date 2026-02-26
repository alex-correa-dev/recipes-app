import { Recipe } from "@types/recipe";
import { storage } from "@utils/storage";
import { useCallback, useEffect, useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const data = await storage.getFavorites();
    setFavorites(data);
    setLoading(false);
  }, []);

  const addFavorite = useCallback(async (recipe: Recipe) => {
    try {
      const success = await storage.addFavorite(recipe);
      if (success) await loadFavorites();
      return success;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  }, []);

  const removeFavorite = useCallback(async (recipeId: string) => {
    const success = await storage.removeFavorite(recipeId);
    if (success) await loadFavorites();
    return success;
  }, []);

  const isFavorite = useCallback(async (recipeId: string) => {
    try {
      return await storage.isFavorite(recipeId);
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
};
