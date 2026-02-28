import { useFavorites } from "@hooks/useFavorites";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { Recipe } from "@types/recipe";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { FlatList } from "react-native";
import FavoritesScreen from "../../../app/(tabs)/favorites";

jest.mock("@hooks/useFavorites", () => ({
  useFavorites: jest.fn(),
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: jest.fn(),
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

describe("FavoritesScreen", () => {
  const mockRefresh = jest.fn();
  const mockFavorites: Recipe[] = [
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

    (useFocusEffect as jest.Mock).mockImplementation((callback) => {
      callback();
    });
  });

  it("should show loading spinner when loading", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      loading: true,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    expect(
      screen.queryByText("Você ainda não tem receitas favoritas"),
    ).toBeNull();
  });

  it("should show empty state when no favorites", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    expect(
      screen.getByText("Você ainda não tem receitas favoritas"),
    ).toBeTruthy();
    expect(screen.queryByTestId("loading-spinner")).toBeNull();
  });

  it("should render list of favorites correctly", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    expect(
      screen.getByTestId(`recipe-card-${mockFavorites[0].idMeal}`),
    ).toBeTruthy();
    expect(
      screen.getByTestId(`recipe-card-${mockFavorites[1].idMeal}`),
    ).toBeTruthy();

    expect(screen.getByText(mockFavorites[0].strMeal)).toBeTruthy();
    expect(screen.getByText(mockFavorites[1].strMeal)).toBeTruthy();

    expect(
      screen.queryByText("Você ainda não tem receitas favoritas"),
    ).toBeNull();
  });

  it("should call refresh when screen is focused", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    expect(useFocusEffect).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("should navigate to recipe details when card is pressed", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    const recipeCard = screen.getByTestId(
      `recipe-card-${mockFavorites[0].idMeal}`,
    );

    fireEvent.press(recipeCard);

    expect(router.push).toHaveBeenCalledWith(
      `/recipe/${mockFavorites[0].idMeal}`,
    );
  });

  it("should apply correct styles to container", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    const container = screen.getByTestId("favorites-container");
    expect(container.props.style).toMatchObject({
      flex: 1,
      backgroundColor: "#fff",
    });
  });

  it("should apply correct styles to list container", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      loading: false,
      refresh: mockRefresh,
    });

    const { UNSAFE_getByType } = render(<FavoritesScreen />);

    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.contentContainerStyle).toMatchObject({
      padding: 16,
    });
  });

  it("should apply correct styles to empty state", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    const emptyContainer = screen.getByTestId("empty-container");
    expect(emptyContainer.props.style).toMatchObject({
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    });

    const emptyText = screen.getByTestId("empty-text");
    expect(emptyText.props.style).toMatchObject({
      fontSize: 16,
      color: "#666",
      textAlign: "center",
    });
  });

  it("should handle empty favorites list after loading", async () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("empty-container")).toBeTruthy();
      expect(screen.queryByTestId("loading-spinner")).toBeNull();
    });
  });

  it("should handle refresh being called multiple times", () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      loading: false,
      refresh: mockRefresh,
    });

    render(<FavoritesScreen />);

    (useFocusEffect as jest.Mock).mock.calls.forEach(([callback]) => {
      callback();
    });

    expect(mockRefresh).toHaveBeenCalledTimes(2);
  });
});
