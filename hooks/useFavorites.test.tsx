import { act, renderHook, waitFor } from "@testing-library/react-native";
import { Recipe } from "@types/recipe";
import { storage } from "@utils/storage";
import { useFavorites } from "./useFavorites";

jest.mock("@utils/storage", () => ({
  storage: {
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: jest.fn(),
  },
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe("useFavorites Hook", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load favorites on initial render", async () => {
    mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

    const { result } = renderHook(() => useFavorites());

    expect(result.current.loading).toBe(true);
    expect(result.current.favorites).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].idMeal).toBe("52772");
    expect(mockedStorage.getFavorites).toHaveBeenCalledTimes(1);
  });

  it("should handle empty favorites list", async () => {
    mockedStorage.getFavorites.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favorites).toEqual([]);
    expect(mockedStorage.getFavorites).toHaveBeenCalledTimes(1);
  });

  describe("addFavorite", () => {
    it("should add a recipe to favorites successfully", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);

      mockedStorage.addFavorite.mockResolvedValueOnce(true);

      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let success;
      await act(async () => {
        success = await result.current.addFavorite(mockRecipe);
      });

      expect(success).toBe(true);
      expect(mockedStorage.addFavorite).toHaveBeenCalledWith(mockRecipe);
      expect(mockedStorage.addFavorite).toHaveBeenCalledTimes(1);

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].idMeal).toBe("52772");
    });

    it("should not update favorites if add fails", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);

      mockedStorage.addFavorite.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const success = await result.current.addFavorite(mockRecipe);
        expect(success).toBe(false);
      });

      expect(result.current.favorites).toEqual([]);
      expect(mockedStorage.getFavorites).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during add", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);
      mockedStorage.addFavorite.mockRejectedValueOnce(new Error("Add failed"));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        const success = await result.current.addFavorite(mockRecipe);
        expect(success).toBe(false);
      });

      expect(mockedStorage.addFavorite).toHaveBeenCalledWith(mockRecipe);
    });
  });

  describe("removeFavorite", () => {
    it("should remove a recipe from favorites successfully", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

      mockedStorage.removeFavorite.mockResolvedValueOnce(true);

      mockedStorage.getFavorites.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.favorites).toHaveLength(1);

      let success;
      await act(async () => {
        success = await result.current.removeFavorite("52772");
      });

      expect(success).toBe(true);
      expect(mockedStorage.removeFavorite).toHaveBeenCalledWith("52772");
      expect(mockedStorage.removeFavorite).toHaveBeenCalledTimes(1);

      expect(result.current.favorites).toHaveLength(0);
    });

    it("should not update favorites if remove fails", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

      mockedStorage.removeFavorite.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.favorites).toHaveLength(1);

      await act(async () => {
        const success = await result.current.removeFavorite("52772");
        expect(success).toBe(false);
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].idMeal).toBe("52772");
    });
  });

  describe("isFavorite", () => {
    it("should return true if recipe is favorite", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);
      mockedStorage.isFavorite.mockResolvedValueOnce(true);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let isFav;
      await act(async () => {
        isFav = await result.current.isFavorite("52772");
      });

      expect(isFav).toBe(true);
      expect(mockedStorage.isFavorite).toHaveBeenCalledWith("52772");
    });

    it("should return false if recipe is not favorite", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);
      mockedStorage.isFavorite.mockResolvedValueOnce(false);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let isFav;
      await act(async () => {
        isFav = await result.current.isFavorite("non-existent");
      });

      expect(isFav).toBe(false);
      expect(mockedStorage.isFavorite).toHaveBeenCalledWith("non-existent");
    });

    it("should handle errors during check", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);
      mockedStorage.isFavorite.mockRejectedValueOnce(new Error("Check failed"));

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let isFav;
      await act(async () => {
        isFav = await result.current.isFavorite("52772");
      });

      expect(isFav).toBe(false);
    });
  });

  describe("refresh", () => {
    it("should reload favorites when refresh is called", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);

      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.favorites).toEqual([]);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].idMeal).toBe("52772");
      expect(mockedStorage.getFavorites).toHaveBeenCalledTimes(2);
    });

    it("should set loading state during refresh", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);

      mockedStorage.getFavorites.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve([mockRecipe]), 100),
          ),
      );

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let refreshPromise: Promise<void>;
      await act(async () => {
        refreshPromise = result.current.refresh();
      });

      await act(async () => {
        await refreshPromise!;
      });

      expect(result.current.favorites).toHaveLength(1);
    });
  });

  describe("real-time updates", () => {
    it("should reflect changes after multiple operations", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.favorites).toEqual([]);

      mockedStorage.addFavorite.mockResolvedValueOnce(true);
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

      await act(async () => {
        await result.current.addFavorite(mockRecipe);
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].idMeal).toBe("52772");

      mockedStorage.addFavorite.mockResolvedValueOnce(true);
      mockedStorage.getFavorites.mockResolvedValueOnce([
        mockRecipe,
        mockRecipe2,
      ]);

      await act(async () => {
        await result.current.addFavorite(mockRecipe2);
      });

      expect(result.current.favorites).toHaveLength(2);
      expect(result.current.favorites.map((r) => r.idMeal)).toContain("52772");
      expect(result.current.favorites.map((r) => r.idMeal)).toContain("52959");

      mockedStorage.removeFavorite.mockResolvedValueOnce(true);
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe2]);

      await act(async () => {
        await result.current.removeFavorite("52772");
      });

      expect(result.current.favorites).toHaveLength(1);
      expect(result.current.favorites[0].idMeal).toBe("52959");
    });
  });

  describe("cleanup on unmount", () => {
    it("should not update state after unmount", async () => {
      mockedStorage.getFavorites.mockResolvedValueOnce([mockRecipe]);

      const { result, unmount } = renderHook(() => useFavorites());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      unmount();

      mockedStorage.addFavorite.mockResolvedValueOnce(true);
      mockedStorage.getFavorites.mockResolvedValueOnce([
        mockRecipe,
        mockRecipe2,
      ]);

      await act(async () => {
        await result.current.addFavorite(mockRecipe2);
      });
    });
  });
});
