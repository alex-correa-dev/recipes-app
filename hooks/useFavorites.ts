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
    const success = await storage.addFavorite(recipe);
    if (success) await loadFavorites();
    return success;
  }, []);

  const removeFavorite = useCallback(async (recipeId: string) => {
    const success = await storage.removeFavorite(recipeId);
    if (success) await loadFavorites();
    return success;
  }, []);

  const isFavorite = useCallback(async (recipeId: string) => {
    return await storage.isFavorite(recipeId);
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
