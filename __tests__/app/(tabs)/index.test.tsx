import { recipeApi } from "@services/recipeApi";
import { useQuery } from "@tanstack/react-query";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { Recipe } from "@types/recipe";
import { router } from "expo-router";
import React from "react";
import HomeScreen from "../../../app/(tabs)/index";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@services/recipeApi", () => ({
  recipeApi: {
    getRecipesByCategory: jest.fn(),
  },
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@/components/ui/LoadingSpinner/LoadingSpinner", () => ({
  LoadingSpinner: () => {
    const { View } = require("react-native");
    return <View testID="loading-spinner" />;
  },
}));

jest.mock("@/components/ui/RecipeCard/RecipeCard", () => ({
  RecipeCard: ({
    recipe,
    onPress,
  }: {
    recipe: Recipe;
    onPress: () => void;
  }) => {
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity
        onPress={onPress}
        testID={`recipe-card-${recipe.idMeal}`}
      >
        <Text>{recipe.strMeal}</Text>
      </TouchableOpacity>
    );
  },
}));

describe("HomeScreen", () => {
  const mockRecipes: Recipe[] = [
    {
      idMeal: "52772",
      strMeal: "Teriyaki Chicken Casserole",
      strMealThumb: "https://example.com/image1.jpg",
      strCategory: "Chicken",
      strArea: "Japanese",
    },
    {
      idMeal: "52959",
      strMeal: "Sushi",
      strMealThumb: "https://example.com/image2.jpg",
      strCategory: "Seafood",
      strArea: "Japanese",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading spinner while fetching data", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<HomeScreen />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("should render list of recipes correctly", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    expect(
      screen.getByTestId(`recipe-card-${mockRecipes[0].idMeal}`),
    ).toBeTruthy();
    expect(
      screen.getByTestId(`recipe-card-${mockRecipes[1].idMeal}`),
    ).toBeTruthy();

    expect(screen.getByText(mockRecipes[0].strMeal)).toBeTruthy();
    expect(screen.getByText(mockRecipes[1].strMeal)).toBeTruthy();
  });

  it("should use default category 'Seafood' for query", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<HomeScreen />);

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["recipes", "Seafood"],
      queryFn: expect.any(Function),
    });
  });

  it("should navigate to recipe details when card is pressed", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    const recipeCard = screen.getByTestId(
      `recipe-card-${mockRecipes[0].idMeal}`,
    );
    fireEvent.press(recipeCard);

    expect(router.push).toHaveBeenCalledWith(
      `/recipe/${mockRecipes[0].idMeal}`,
    );
  });

  it("should handle empty recipes list", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    expect(screen.queryByTestId(/recipe-card-/)).toBeNull();
  });

  it("should handle null recipes response", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    expect(screen.queryByTestId(/recipe-card-/)).toBeNull();
  });

  it("should handle API error gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("API Error"),
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    expect(screen.queryByTestId(/recipe-card-/)).toBeNull();

    consoleSpy.mockRestore();
  });

  it("should apply correct styles to container", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    const container = screen.getByTestId("home-container");
    expect(container.props.style).toMatchObject({
      flex: 1,
      backgroundColor: "#fff",
    });
  });

  it("should apply correct styles to list container", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    const flatList = screen.getByTestId("recipes-list");
    expect(flatList.props.contentContainerStyle).toMatchObject({
      padding: 16,
    });
  });

  it("should have correct keyExtractor for FlatList items", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });

    const flatList = screen.getByTestId("recipes-list");
    const extractor = flatList.props.keyExtractor;

    expect(extractor(mockRecipes[0])).toBe(mockRecipes[0].idMeal);
    expect(extractor(mockRecipes[1])).toBe(mockRecipes[1].idMeal);
  });

  describe("Category selection", () => {
    it("should update query when category changes", async () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: mockRecipes,
        isLoading: false,
      });

      render(<HomeScreen />);

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).toBeNull();
      });

      expect(useQuery).toHaveBeenCalledWith({
        queryKey: ["recipes", "Seafood"],
        queryFn: expect.any(Function),
      });
    });
  });

  describe("Query function", () => {
    it("should call recipeApi.getRecipesByCategory with correct category", async () => {
      let queryFn: Function = () => {};

      (useQuery as jest.Mock).mockImplementation(({ queryFn: fn }) => {
        queryFn = fn;
        return {
          data: mockRecipes,
          isLoading: false,
        };
      });

      render(<HomeScreen />);

      await queryFn();

      expect(recipeApi.getRecipesByCategory).toHaveBeenCalledWith("Seafood");
    });

    it("should handle API error in query function", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      (recipeApi.getRecipesByCategory as jest.Mock).mockRejectedValueOnce(
        new Error("API Error"),
      );

      let queryFn: Function = () => {};

      (useQuery as jest.Mock).mockImplementation(({ queryFn: fn }) => {
        queryFn = fn;
        return {
          data: undefined,
          isLoading: false,
          error: new Error("API Error"),
        };
      });

      render(<HomeScreen />);

      await expect(queryFn()).rejects.toThrow("API Error");

      consoleSpy.mockRestore();
    });
  });
});
