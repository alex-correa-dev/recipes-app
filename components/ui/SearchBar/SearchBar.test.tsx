import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { SearchBar } from "./SearchBar";

jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon");

describe("SearchBar Component", () => {
  const mockOnChangeText = jest.fn();
  const defaultPlaceholder = "Buscar receitas...";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with default props", () => {
    render(<SearchBar value="" onChangeText={mockOnChangeText} />);

    expect(screen.getByTestId("search-icon")).toBeTruthy();

    const input = screen.getByPlaceholderText(defaultPlaceholder);
    expect(input).toBeTruthy();
    expect(input.props.value).toBe("");
    expect(input.props.placeholder).toBe(defaultPlaceholder);
    expect(input.props.placeholderTextColor).toBe("#999");
    expect(input.props.returnKeyType).toBe("search");
    expect(input.props.clearButtonMode).toBe("while-editing");
  });

  it("should render with custom placeholder", () => {
    const customPlaceholder = "Digite para buscar...";
    render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder={customPlaceholder}
      />,
    );

    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeTruthy();
  });

  it("should display the provided value", () => {
    const testValue = "chicken";
    render(<SearchBar value={testValue} onChangeText={mockOnChangeText} />);

    const input = screen.getByDisplayValue(testValue);
    expect(input).toBeTruthy();
  });

  it("should call onChangeText when text changes", () => {
    render(<SearchBar value="" onChangeText={mockOnChangeText} />);

    const input = screen.getByPlaceholderText(defaultPlaceholder);
    const newText = "pizza";

    fireEvent.changeText(input, newText);

    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    expect(mockOnChangeText).toHaveBeenCalledWith(newText);
  });

  it("should handle multiple text changes", () => {
    render(<SearchBar value="" onChangeText={mockOnChangeText} />);

    const input = screen.getByPlaceholderText(defaultPlaceholder);

    fireEvent.changeText(input, "a");
    fireEvent.changeText(input, "ab");
    fireEvent.changeText(input, "abc");

    expect(mockOnChangeText).toHaveBeenCalledTimes(3);
    expect(mockOnChangeText).toHaveBeenNthCalledWith(1, "a");
    expect(mockOnChangeText).toHaveBeenNthCalledWith(2, "ab");
    expect(mockOnChangeText).toHaveBeenNthCalledWith(3, "abc");
  });

  it("should apply correct styles", () => {
    render(<SearchBar value="" onChangeText={mockOnChangeText} />);

    const container = screen.getByTestId("search-container");
    const icon = screen.getByTestId("search-icon");
    const input = screen.getByPlaceholderText(defaultPlaceholder);

    expect(container).toHaveStyle({
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      borderRadius: 8,
      margin: 16,
      paddingHorizontal: 12,
    });

    expect(icon).toHaveStyle({
      marginRight: 8,
    });

    expect(input).toHaveStyle({
      flex: 1,
      height: 44,
      fontSize: 16,
      color: "#333",
    });
  });

  it("should handle empty value prop", () => {
    render(<SearchBar value="" onChangeText={mockOnChangeText} />);

    const input = screen.getByPlaceholderText(defaultPlaceholder);
    expect(input.props.value).toBe("");
  });

  it("should handle undefined placeholder (use default)", () => {
    render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder={undefined}
      />,
    );

    const input = screen.getByPlaceholderText(defaultPlaceholder);
    expect(input.props.placeholder).toBe(defaultPlaceholder);
  });

  it("should maintain value when controlled externally", () => {
    const { rerender } = render(
      <SearchBar value="initial" onChangeText={mockOnChangeText} />,
    );

    let input = screen.getByDisplayValue("initial");
    expect(input).toBeTruthy();

    rerender(<SearchBar value="updated" onChangeText={mockOnChangeText} />);

    input = screen.getByDisplayValue("updated");
    expect(input).toBeTruthy();
  });

  it("should have correct accessibility attributes", () => {
    render(<SearchBar value="" onChangeText={mockOnChangeText} />);

    const input = screen.getByPlaceholderText(defaultPlaceholder);

    expect(input.props.accessible).toBeUndefined();
    expect(input.props.returnKeyType).toBe("search");
  });

  it("should render without crashing with minimal props", () => {
    expect(() => {
      render(<SearchBar value="" onChangeText={mockOnChangeText} />);
    }).not.toThrow();
  });
});
