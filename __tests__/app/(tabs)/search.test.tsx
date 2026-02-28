import { useQuery } from "@tanstack/react-query";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { Recipe } from "@types/recipe";
import { router } from "expo-router";
import { debounce } from "lodash";
import React from "react";
import { Text } from "react-native";
import SearchScreen from "../../../app/(tabs)/search";
global.Text = Text;

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@services/recipeApi", () => ({
  recipeApi: {
    searchRecipes: jest.fn(),
  },
}));

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("lodash", () => ({
  debounce: jest.fn((fn) => fn),
}));

jest.mock("@/components/ui/LoadingSpinner/LoadingSpinner", () => ({
  LoadingSpinner: () => {
    const { View } = require("react-native");
    return <View testID="loading-spinner" />;
  },
}));

jest.mock("@/components/ui/SearchBar/SearchBar", () => ({
  SearchBar: ({ onChangeText, placeholder }: any) => {
    const { TextInput, View } = require("react-native");
    return (
      <View testID="search-bar">
        <TextInput
          testID="search-input"
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
      </View>
    );
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

describe("SearchScreen", () => {
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
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  it("should render correctly", () => {
    render(<SearchScreen />);

    expect(screen.getByTestId("search-bar")).toBeTruthy();
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("should show loading spinner when searching", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<SearchScreen />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
  });

  it("should update search query when typing", async () => {
    render(<SearchScreen />);

    const searchInput = screen.getByTestId("search-input");

    fireEvent.changeText(searchInput, "chicken");

    await waitFor(() => {
      expect(debounce).toHaveBeenCalled();
    });
  });

  it("should display search results", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<SearchScreen />);

    await waitFor(() => {
      expect(
        screen.getByTestId(`recipe-card-${mockRecipes[0].idMeal}`),
      ).toBeTruthy();
      expect(
        screen.getByTestId(`recipe-card-${mockRecipes[1].idMeal}`),
      ).toBeTruthy();
    });

    expect(screen.getByText(mockRecipes[0].strMeal)).toBeTruthy();
    expect(screen.getByText(mockRecipes[1].strMeal)).toBeTruthy();
  });

  it("should navigate to recipe details when card is pressed", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isLoading: false,
    });

    render(<SearchScreen />);

    await waitFor(() => {
      expect(
        screen.getByTestId(`recipe-card-${mockRecipes[0].idMeal}`),
      ).toBeTruthy();
    });

    const recipeCard = screen.getByTestId(
      `recipe-card-${mockRecipes[0].idMeal}`,
    );
    fireEvent.press(recipeCard);

    expect(router.push).toHaveBeenCalledWith(
      `/recipe/${mockRecipes[0].idMeal}`,
    );
  });

  it("should show empty state when no results found", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<SearchScreen />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.changeText(searchInput, "xyz");

    await waitFor(() => {
      expect(screen.getByText("Nenhuma receita encontrada")).toBeTruthy();
    });
  });

  it("should not show empty state when search query is too short", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<SearchScreen />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.changeText(searchInput, "a");

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.queryByText("Nenhuma receita encontrada")).toBeNull();
  });

  it("should enable query only when search query length > 2", () => {
    let enabledValue = false;

    (useQuery as jest.Mock).mockImplementation(({ enabled }) => {
      enabledValue = enabled;
      return { data: [], isLoading: false };
    });

    render(<SearchScreen />);

    expect(enabledValue).toBe(false);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.changeText(searchInput, "abc");

    expect(useQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabled: true,
      }),
    );
  });

  it("should have correct initial queryKey", () => {
    render(<SearchScreen />);

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["search", ""],
      }),
    );
  });

  it("should handle null results gracefully", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    render(<SearchScreen />);

    expect(screen.queryByTestId(/recipe-card-/)).toBeNull();
  });

  it("should handle API error gracefully", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("API Error"),
    });

    render(<SearchScreen />);

    expect(screen.queryByTestId(/recipe-card-/)).toBeNull();

    consoleSpy.mockRestore();
  });

  it("should apply correct styles to container", () => {
    render(<SearchScreen />);

    const container = screen.getByTestId("search-container");
    expect(container.props.style).toMatchObject({
      flex: 1,
      backgroundColor: "#fff",
    });
  });

  describe("Debounce functionality", () => {
    it("should debounce search input", async () => {
      const mockDebounce = jest.fn((fn) => fn);
      (debounce as jest.Mock).mockImplementation(mockDebounce);

      render(<SearchScreen />);

      expect(mockDebounce).toHaveBeenCalled();
      expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it("should call debounced function with correct text", async () => {
      render(<SearchScreen />);

      const searchInput = screen.getByTestId("search-input");
      fireEvent.changeText(searchInput, "chicken");

      await waitFor(() => {
        expect(useQuery).toHaveBeenLastCalledWith(
          expect.objectContaining({
            queryKey: ["search", "chicken"],
          }),
        );
      });
    });
  });

  describe("FlatList properties", () => {
    it("should render FlatList with recipes", async () => {
      (useQuery as jest.Mock).mockReturnValue({
        data: mockRecipes,
        isLoading: false,
      });

      render(<SearchScreen />);

      await waitFor(() => {
        expect(
          screen.getByTestId(`recipe-card-${mockRecipes[0].idMeal}`),
        ).toBeTruthy();
        expect(
          screen.getByTestId(`recipe-card-${mockRecipes[1].idMeal}`),
        ).toBeTruthy();
      });
    });
  });
});
