import { Category, Recipe } from "@types/recipe";
import { recipeApi } from "./recipeApi";

global.fetch = jest.fn();

describe("Recipe API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

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

  const mockCategory: Category = {
    idCategory: "1",
    strCategory: "Beef",
    strCategoryThumb: "https://www.themealdb.com/images/category/beef.png",
    strCategoryDescription: "Beef description",
  };

  describe("getRecipesByCategory", () => {
    it("should fetch recipes by category successfully", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: [mockRecipe, mockRecipe2],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipesByCategory("Seafood");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood",
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(2);
      expect(result[0].idMeal).toBe("52772");
      expect(result[1].idMeal).toBe("52959");
    });

    it("should use default category 'Seafood' when no category is provided", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: [mockRecipe],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await recipeApi.getRecipesByCategory();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood",
      );
    });

    it("should return empty array when API returns null", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: null,
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipesByCategory("Seafood");

      expect(result).toEqual([]);
    });

    it("should return empty array when API returns no meals property", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipesByCategory("Seafood");

      expect(result).toEqual([]);
    });

    it("should handle network errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await recipeApi.getRecipesByCategory("Seafood");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle HTTP errors (non-200 responses)", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipesByCategory("Seafood");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getRecipeDetails", () => {
    it("should fetch recipe details by id successfully", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: [mockRecipe],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipeDetails("52772");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772",
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockRecipe);
      expect(result?.idMeal).toBe("52772");
      expect(result?.strMeal).toBe("Teriyaki Chicken Casserole");
    });

    it("should return null when recipe is not found", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: null,
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipeDetails("invalid-id");

      expect(result).toBeNull();
    });

    it("should return null when API returns no meals property", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipeDetails("52772");

      expect(result).toBeNull();
    });

    it("should handle network errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await recipeApi.getRecipeDetails("52772");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getCategories", () => {
    it("should fetch categories successfully", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          categories: [mockCategory],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getCategories();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/categories.php",
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(1);
      expect(result[0].idCategory).toBe("1");
      expect(result[0].strCategory).toBe("Beef");
    });

    it("should return empty array when API returns null", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          categories: null,
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getCategories();

      expect(result).toEqual([]);
    });

    it("should return empty array when API returns no categories property", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getCategories();

      expect(result).toEqual([]);
    });

    it("should handle network errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await recipeApi.getCategories();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("searchRecipes", () => {
    it("should search recipes by query successfully", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: [mockRecipe, mockRecipe2],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.searchRecipes("chicken");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken",
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(2);
      expect(result[0].idMeal).toBe("52772");
      expect(result[1].idMeal).toBe("52959");
    });

    it("should return empty array when query is less than 2 characters", async () => {
      const result = await recipeApi.searchRecipes("a");

      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should return empty array when API returns null", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: null,
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.searchRecipes("chicken");

      expect(result).toEqual([]);
    });

    it("should return empty array when API returns no meals property", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.searchRecipes("chicken");

      expect(result).toEqual([]);
    });

    it("should handle network errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await recipeApi.searchRecipes("chicken");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle search with special characters", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          meals: [mockRecipe],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.searchRecipes("chicken & rice");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=chicken & rice",
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("Error handling", () => {
    it("should handle 404 errors gracefully", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getRecipesByCategory("Seafood");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle timeout errors gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("timeout of 5000ms exceeded"),
      );

      const result = await recipeApi.getRecipeDetails("52772");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle malformed JSON responses", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error("Invalid JSON")),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await recipeApi.getCategories();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("API integration scenarios", () => {
    it("should handle multiple API calls in sequence", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ categories: [mockCategory] }),
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ meals: [mockRecipe] }),
      });

      const categories = await recipeApi.getCategories();
      const recipes = await recipeApi.getRecipesByCategory("Beef");

      expect(categories).toHaveLength(1);
      expect(recipes).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should handle concurrent API calls", async () => {
      const mockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ meals: [mockRecipe] }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

      const [result1, result2] = await Promise.all([
        recipeApi.getRecipesByCategory("Seafood"),
        recipeApi.getRecipesByCategory("Beef"),
      ]);

      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("c=Seafood"),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("c=Beef"),
      );
    });
  });
});
