import { render, screen } from "@testing-library/react-native";
import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("should render correctly", () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId("loading-container");
    expect(container).toBeTruthy();

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeTruthy();
  });

  it("should have correct ActivityIndicator props", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId("loading-spinner");

    expect(spinner.props.size).toBe("large");
    expect(spinner.props.color).toBe("#ff4444");
  });

  it("should apply correct styles to container", () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId("loading-container");

    expect(container.props.style).toMatchObject({
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    });
  });

  it("should be centered on the screen", () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId("loading-container");

    expect(container.props.style).toHaveProperty("justifyContent", "center");
    expect(container.props.style).toHaveProperty("alignItems", "center");
  });

  it("should take full available space", () => {
    render(<LoadingSpinner />);

    const container = screen.getByTestId("loading-container");

    expect(container.props.style).toHaveProperty("flex", 1);
  });

  it("should render without crashing", () => {
    expect(() => {
      render(<LoadingSpinner />);
    }).not.toThrow();
  });

  it("should have correct accessibility attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId("loading-spinner");

    expect(spinner.props.accessible).toBeUndefined();
  });

  it("should render consistently", () => {
    const { toJSON: firstRender } = render(<LoadingSpinner />);
    const { toJSON: secondRender } = render(<LoadingSpinner />);

    expect(firstRender()).toEqual(secondRender());
  });

  it("should use correct color (#ff4444)", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner.props.color).toBe("#ff4444");
  });
});
