import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PosterCard from "../../../src/components/Promotion/PosterCard.jsx";

const mockPoster = {
  title: "Test Poster",
  description: "Test poster description",
  downloadUrl: "/test-poster.svg",
  type: "Walker",
};

describe("PosterCard", () => {
  it("renders poster content correctly", () => {
    render(<PosterCard {...mockPoster} />);

    expect(screen.getByText("Test Poster")).toBeInTheDocument();
    expect(screen.getByText("Test poster description")).toBeInTheDocument();
    expect(screen.getByText("Walker")).toBeInTheDocument();
    expect(screen.getByTestId("poster-image")).toHaveAttribute("src", "/test-poster.svg");
  });

  it("opens preview when image is clicked", () => {
    render(<PosterCard {...mockPoster} />);

    fireEvent.click(screen.getByTestId("poster-image"));

    expect(screen.getByTestId("preview-dialog")).toBeInTheDocument();
    expect(screen.getByText("Preview: Test Poster")).toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(<PosterCard {...mockPoster} />);

    const image = screen.getByTestId("poster-image");
    fireEvent.keyDown(image, { key: "Enter" });

    expect(screen.getByTestId("preview-dialog")).toBeInTheDocument();
  });
});
