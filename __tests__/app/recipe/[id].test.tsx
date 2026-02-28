import { useFavorites } from "@hooks/useFavorites";
import { recipeApi } from "@services/recipeApi";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Linking } from "react-native";
import RecipeDetailScreen from "../../../app/recipe/[id]";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

jest.mock("@services/recipeApi", () => ({
  recipeApi: {
    getRecipeDetails: jest.fn(),
  },
}));

jest.mock("@hooks/useFavorites", () => ({
  useFavorites: jest.fn(),
}));

jest.mock("@/components/ui/LoadingSpinner/LoadingSpinner", () => ({
  LoadingSpinner: () => {
    const { View } = require("react-native");
    return <View testID="loading-spinner" />;
  },
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: jest.fn().mockImplementation(({ name, color, size, testID }) => {
    const { View } = require("react-native");
    return <View testID={testID} name={name} color={color} size={size} />;
  }),
}));

jest.spyOn(Alert, "alert");

describe("RecipeDetailScreen", () => {
  const mockRecipe = {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strMealThumb: "https://example.com/image.jpg",
    strCategory: "Chicken",
    strArea: "Japanese",
    strInstructions: "Mix all ingredients and cook.",
    strYoutube: "https://youtube.com/watch?v=123",
    strIngredient1: "Chicken",
    strMeasure1: "500g",
    strIngredient2: "Soy Sauce",
    strMeasure2: "2 tbsp",
    strIngredient3: "",
    strMeasure3: "",
  };

  const mockIsFavorite = jest.fn();
  const mockAddFavorite = jest.fn();
  const mockRemoveFavorite = jest.fn();
  let openURLSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    openURLSpy = jest
      .spyOn(Linking, "openURL")
      .mockImplementation(() => Promise.resolve());

    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "52772" });

    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: mockIsFavorite,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
    });

    (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValue(mockRecipe);
  });

  afterEach(() => {
    openURLSpy.mockRestore();
  });

  it("should show loading spinner while fetching data", async () => {
    (recipeApi.getRecipeDetails as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}),
    );

    render(<RecipeDetailScreen />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("should render recipe details correctly", async () => {
    render(<RecipeDetailScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    const image = screen.getByTestId("recipe-image");
    expect(image.props.source.uri).toBe(mockRecipe.strMealThumb);

    expect(screen.getByText(mockRecipe.strMeal)).toBeTruthy();

    expect(screen.getByText(mockRecipe.strCategory)).toBeTruthy();
    expect(screen.getByText(mockRecipe.strArea)).toBeTruthy();

    expect(screen.getByText("• Chicken: 500g")).toBeTruthy();
    expect(screen.getByText("• Soy Sauce: 2 tbsp")).toBeTruthy();

    expect(screen.getByText(mockRecipe.strInstructions)).toBeTruthy();

    expect(screen.getByText("Assistir no YouTube")).toBeTruthy();
  });

  it("should render without category and area when not provided", async () => {
    const recipeWithoutMeta = {
      ...mockRecipe,
      strCategory: null,
      strArea: null,
    };
    (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(
      recipeWithoutMeta,
    );

    render(<RecipeDetailScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    expect(screen.queryByText(mockRecipe.strCategory)).toBeNull();
    expect(screen.queryByText("•")).toBeNull();
  });

  it("should render without YouTube button when not available", async () => {
    const recipeWithoutVideo = {
      ...mockRecipe,
      strYoutube: null,
    };
    (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(
      recipeWithoutVideo,
    );

    render(<RecipeDetailScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    expect(screen.queryByText("Assistir no YouTube")).toBeNull();
  });

  describe("Favorite functionality", () => {
    it("should show heart outline when recipe is not favorite", async () => {
      mockIsFavorite.mockResolvedValueOnce(false);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const favoriteButton = screen.getByTestId("favorite-button");
      const icon = screen.getByTestId("favorite-icon");

      expect(icon.props.name).toBe("heart-outline");
      expect(icon.props.color).toBe("#fff");
    });

    it("should show filled heart when recipe is favorite", async () => {
      mockIsFavorite.mockResolvedValueOnce(true);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const icon = screen.getByTestId("favorite-icon");
      expect(icon.props.name).toBe("heart");
      expect(icon.props.color).toBe("#ff4444");
    });

    it("should add to favorites when pressing heart outline", async () => {
      mockIsFavorite.mockResolvedValueOnce(false);
      mockAddFavorite.mockResolvedValueOnce(true);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const favoriteButton = screen.getByTestId("favorite-button");
      fireEvent.press(favoriteButton);

      await waitFor(() => {
        expect(mockAddFavorite).toHaveBeenCalledWith(mockRecipe);
        expect(Alert.alert).toHaveBeenCalledWith(
          "Sucesso",
          "Receita adicionada aos favoritos",
        );
      });
    });

    it("should remove from favorites when pressing filled heart", async () => {
      mockIsFavorite.mockResolvedValueOnce(true);
      mockRemoveFavorite.mockResolvedValueOnce(true);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const favoriteButton = screen.getByTestId("favorite-button");
      fireEvent.press(favoriteButton);

      await waitFor(() => {
        expect(mockRemoveFavorite).toHaveBeenCalledWith("52772");
        expect(Alert.alert).toHaveBeenCalledWith(
          "Sucesso",
          "Receita removida dos favoritos",
        );
      });
    });

    it("should not toggle favorite if recipe is null", async () => {
      (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(null);
      mockIsFavorite.mockResolvedValueOnce(false);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(recipeApi.getRecipeDetails).toHaveBeenCalled();
      });

      expect(screen.getByTestId("loading-spinner")).toBeTruthy();

      expect(screen.queryByTestId("favorite-button")).toBeNull();
    });
  });

  describe("YouTube video", () => {
    it("should open YouTube link when button is pressed", async () => {
      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const videoButton = screen.getByText("Assistir no YouTube");
      fireEvent.press(videoButton);

      expect(openURLSpy).toHaveBeenCalledWith(mockRecipe.strYoutube);
    });

    it("should not open link if YouTube URL is not available", async () => {
      const recipeWithoutVideo = {
        ...mockRecipe,
        strYoutube: null,
      };
      (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(
        recipeWithoutVideo,
      );

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      expect(screen.queryByText("Assistir no YouTube")).toBeNull();
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
  });

  describe("Ingredients parsing", () => {
    it("should only show ingredients with non-empty values", async () => {
      const recipeWithEmptyIngredients = {
        ...mockRecipe,
        strIngredient1: "Chicken",
        strMeasure1: "500g",
        strIngredient2: "",
        strMeasure2: "",
        strIngredient3: "Rice",
        strMeasure3: "1 cup",
      };
      (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(
        recipeWithEmptyIngredients,
      );

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      expect(screen.getByText("• Chicken: 500g")).toBeTruthy();
      expect(screen.getByText("• Rice: 1 cup")).toBeTruthy();
      expect(screen.queryByText("• :")).toBeNull();
    });

    it("should handle up to 20 ingredients", async () => {
      const recipeWithManyIngredients = { ...mockRecipe };
      for (let i = 1; i <= 20; i++) {
        recipeWithManyIngredients[`strIngredient${i}`] = `Ingredient ${i}`;
        recipeWithManyIngredients[`strMeasure${i}`] = `${i} units`;
      }
      (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(
        recipeWithManyIngredients,
      );

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      for (let i = 1; i <= 20; i++) {
        expect(screen.getByText(`• Ingredient ${i}: ${i} units`)).toBeTruthy();
      }
    });
  });

  describe("Error handling", () => {
    it("should handle API error gracefully", async () => {
      (recipeApi.getRecipeDetails as jest.Mock).mockRejectedValueOnce(
        new Error("API Error"),
      );
      mockIsFavorite.mockResolvedValueOnce(false);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(recipeApi.getRecipeDetails).toHaveBeenCalled();
      });
      expect(screen.getByTestId("loading-spinner")).toBeTruthy();

      expect(screen.queryByTestId("favorite-button")).toBeNull();
    });

    it("should handle null recipe response", async () => {
      (recipeApi.getRecipeDetails as jest.Mock).mockResolvedValueOnce(null);

      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeTruthy();
      });
    });
  });

  describe("Styles", () => {
    it("should apply correct styles to container", async () => {
      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const container = screen.getByTestId("recipe-container");
      expect(container.props.style).toMatchObject({
        flex: 1,
        backgroundColor: "#fff",
      });
    });

    it("should apply correct styles to favorite button", async () => {
      render(<RecipeDetailScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      const favoriteButton = screen.getByTestId("favorite-button");
      expect(favoriteButton.props.style).toMatchObject({
        position: "absolute",
        top: 20,
        right: 20,
        borderRadius: 25,
      });
    });
  });
});
