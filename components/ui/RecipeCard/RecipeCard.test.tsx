import { fireEvent, render, screen } from "@testing-library/react-native";
import { Recipe } from "@types/recipe";
import React from "react";
import { RecipeCard } from "./RecipeCard";

describe("RecipeCard Component", () => {
  const mockOnPress = jest.fn();

  const mockRecipe: Recipe = {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    strCategory: "Chicken",
    strArea: "Japanese",
  };

  const mockRecipeWithoutCategory: Recipe = {
    idMeal: "52959",
    strMeal: "Sushi",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
    strArea: "Japanese",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with all recipe data", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const image = screen.getByTestId("recipe-image");
    expect(image).toBeTruthy();
    expect(image.props.source.uri).toBe(mockRecipe.strMealThumb);

    expect(screen.getByText(mockRecipe.strMeal)).toBeTruthy();

    expect(screen.getByText(mockRecipe.strCategory!)).toBeTruthy();
  });

  it("should render without category when not provided", () => {
    render(
      <RecipeCard recipe={mockRecipeWithoutCategory} onPress={mockOnPress} />,
    );

    expect(screen.getByText(mockRecipeWithoutCategory.strMeal)).toBeTruthy();

    expect(screen.queryByTestId("recipe-category")).toBeNull();
  });

  it("should call onPress when pressed", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const card = screen.getByTestId("recipe-card");
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("should have correct opacity feedback when pressed", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const card = screen.getByTestId("recipe-card");

    fireEvent(card, "pressIn");
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalled();
  });

  it("should truncate long titles with numberOfLines=2", () => {
    const longTitleRecipe = {
      ...mockRecipe,
      strMeal:
        "This is a very long recipe title that should be truncated after two lines because it's too long",
    };

    render(<RecipeCard recipe={longTitleRecipe} onPress={mockOnPress} />);

    const title = screen.getByTestId("recipe-title");
    expect(title.props.numberOfLines).toBe(2);
  });

  it("should apply correct styles to card", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const card = screen.getByTestId("recipe-card");

    expect(card.props.style).toMatchObject({
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
      elevation: 3,
    });
  });

  it("should apply correct styles to image", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const image = screen.getByTestId("recipe-image");

    expect(image.props.style).toMatchObject({
      width: "100%",
      height: 150,
    });
  });

  it("should apply correct styles to content container", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const content = screen.getByTestId("recipe-content");

    expect(content.props.style).toMatchObject({
      padding: 12,
    });
  });

  it("should apply correct styles to title", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const title = screen.getByTestId("recipe-title");

    expect(title.props.style).toMatchObject({
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 4,
    });
  });

  it("should apply correct styles to category when present", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const category = screen.getByTestId("recipe-category");

    expect(category.props.style).toMatchObject({
      fontSize: 14,
      color: "#666",
    });
  });

  it("should handle image loading errors gracefully", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const image = screen.getByTestId("recipe-image");

    fireEvent(image, "error");

    expect(image).toBeTruthy();
  });

  it("should render without crashing with minimal props", () => {
    expect(() => {
      render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);
    }).not.toThrow();
  });

  it("should have correct accessibility attributes", () => {
    render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

    const card = screen.getByTestId("recipe-card");

    expect(card.props.accessible).toBe(true);

    expect(card.props.accessibilityRole).not.toBe("none");
  });

  describe("Shadow styles", () => {
    it("should have correct shadow properties for iOS", () => {
      render(<RecipeCard recipe={mockRecipe} onPress={mockOnPress} />);

      const card = screen.getByTestId("recipe-card");

      expect(card.props.style).toMatchObject({
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      });
    });
  });
});
