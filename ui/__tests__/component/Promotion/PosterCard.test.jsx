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

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Poster");
    expect(screen.getByText("Test poster description")).toBeInTheDocument();
    expect(screen.getByText("Walker")).toBeInTheDocument();
  });

  it("renders as article with correct accessibility", () => {
    render(<PosterCard {...mockPoster} />);

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-label", "Downloadable poster: Test Poster");
  });

  it("renders image with correct attributes", () => {
    render(<PosterCard {...mockPoster} />);

    const image = screen.getByRole("button", { name: "Preview Test Poster in full size" });
    expect(image).toHaveAttribute("tabindex", "0");
  });

  it("opens preview when image is clicked", () => {
    render(<PosterCard {...mockPoster} />);

    const imageButton = screen.getByRole("button", { name: "Preview Test Poster in full size" });
    fireEvent.click(imageButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
