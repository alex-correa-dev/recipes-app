import AsyncStorage from "@react-native-async-storage/async-storage";
import { Recipe } from "@types/recipe";
import { storage } from "./storage";

describe("Storage Utilities", () => {
  const mockRecipe: Recipe = {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    strCategory: "Chicken",
    strArea: "Japanese",
  };

  const mockRecipe2: Recipe = {
    idMeal: "52959",
    strMeal: "Sushi",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
    strCategory: "Seafood",
    strArea: "Japanese",
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe("getFavorites", () => {
    it("should return an empty array when no favorites are stored", async () => {
      const favorites = await storage.getFavorites();

      expect(favorites).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@recipes_favorites");
    });

    it("should return stored favorites when they exist", async () => {
      const storedData = JSON.stringify([mockRecipe]);
      await AsyncStorage.setItem("@recipes_favorites", storedData);

      const favorites = await storage.getFavorites();

      expect(favorites).toHaveLength(1);
      expect(favorites[0].idMeal).toBe("52772");
      expect(favorites[0].strMeal).toBe("Teriyaki Chicken Casserole");
    });

    it("should handle invalid JSON data and return empty array", async () => {
      await AsyncStorage.setItem("@recipes_favorites", "invalid json data");

      const favorites = await storage.getFavorites();

      expect(favorites).toEqual([]);
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      );

      const favorites = await storage.getFavorites();

      expect(favorites).toEqual([]);
    });
  });

  describe("addFavorite", () => {
    it("should add a new recipe to favorites", async () => {
      const result = await storage.addFavorite(mockRecipe);

      expect(result).toBe(true);

      const stored = await AsyncStorage.getItem("@recipes_favorites");
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].idMeal).toBe("52772");
    });

    it("should not add duplicate recipes", async () => {
      await storage.addFavorite(mockRecipe);

      const result = await storage.addFavorite(mockRecipe);

      expect(result).toBe(false);

      const stored = await AsyncStorage.getItem("@recipes_favorites");
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    it("should add multiple different recipes successfully", async () => {
      await storage.addFavorite(mockRecipe);
      await storage.addFavorite(mockRecipe2);

      const stored = await AsyncStorage.getItem("@recipes_favorites");
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(2);
      expect(parsed.map((r: Recipe) => r.idMeal)).toContain("52772");
      expect(parsed.map((r: Recipe) => r.idMeal)).toContain("52959");
    });

    it("should handle errors when saving to AsyncStorage", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Save failed"),
      );

      const result = await storage.addFavorite(mockRecipe);

      expect(result).toBe(false);
    });
  });

  describe("removeFavorite", () => {
    it("should remove an existing favorite", async () => {
      await storage.addFavorite(mockRecipe);

      const result = await storage.removeFavorite("52772");

      expect(result).toBe(true);

      const stored = await AsyncStorage.getItem("@recipes_favorites");
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });

    it("should return true even when removing non-existent recipe", async () => {
      const result = await storage.removeFavorite("non-existent-id");

      expect(result).toBe(true);

      const stored = await AsyncStorage.getItem("@recipes_favorites");
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(0);
    });

    it("should remove only the specified recipe when multiple exist", async () => {
      await storage.addFavorite(mockRecipe);
      await storage.addFavorite(mockRecipe2);

      await storage.removeFavorite("52772");

      const stored = await AsyncStorage.getItem("@recipes_favorites");
      const parsed = JSON.parse(stored!);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].idMeal).toBe("52959");
    });

    it("should handle AsyncStorage errors during removal", async () => {
      await storage.addFavorite(mockRecipe);

      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Save failed"),
      );

      const result = await storage.removeFavorite("52772");

      expect(result).toBe(false);
    });
  });

  describe("isFavorite", () => {
    it("should return true when recipe exists in favorites", async () => {
      await storage.addFavorite(mockRecipe);

      const result = await storage.isFavorite("52772");

      expect(result).toBe(true);
    });

    it("should return false when recipe does not exist in favorites", async () => {
      await storage.addFavorite(mockRecipe);

      const result = await storage.isFavorite("non-existent-id");

      expect(result).toBe(false);
    });

    it("should return false when favorites are empty", async () => {
      const result = await storage.isFavorite("52772");

      expect(result).toBe(false);
    });

    it("should handle AsyncStorage errors gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error"),
      );

      const result = await storage.isFavorite("52772");

      expect(result).toBe(false);
    });
  });

  describe("Integration Scenarios", () => {
    it("should maintain data consistency across multiple operations", async () => {
      await storage.addFavorite(mockRecipe);
      expect(await storage.isFavorite("52772")).toBe(true);

      await storage.addFavorite(mockRecipe2);
      expect(await storage.isFavorite("52959")).toBe(true);

      const favorites = await storage.getFavorites();
      expect(favorites).toHaveLength(2);

      await storage.removeFavorite("52772");
      expect(await storage.isFavorite("52772")).toBe(false);
      expect(await storage.isFavorite("52959")).toBe(true);

      const finalFavorites = await storage.getFavorites();
      expect(finalFavorites).toHaveLength(1);
      expect(finalFavorites[0].idMeal).toBe("52959");
    });

    it("should handle sequential operations correctly", async () => {
      await storage.addFavorite(mockRecipe);

      await storage.addFavorite(mockRecipe2);

      const favorites = await storage.getFavorites();
      expect(favorites).toHaveLength(2);
      expect(favorites.map((f) => f.idMeal)).toContain("52772");
      expect(favorites.map((f) => f.idMeal)).toContain("52959");
    });
  });
});
