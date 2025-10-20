import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PosterCard from "../../../src/components/Promotion/PosterCard.jsx";

vi.mock("@mui/material", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardActions: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardMedia: ({ onClick, onKeyDown, alt, image, ...props }) => (
    <img {...props} src={image} onClick={onClick} onKeyDown={onKeyDown} alt={alt} data-testid="poster-image" />
  ),
  Typography: ({ children, component, ...props }) => {
    const Component = component || "div";
    return React.createElement(Component, props, children);
  },
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Chip: ({ label, ...props }) => <span {...props}>{label}</span>,
}));

vi.mock("@mui/icons-material", () => ({
  Image: () => <span>Image</span>,
}));

vi.mock("../../../src/styles/promotion.mui.styles.mjs", () => ({
  styles: new Proxy({}, { get: () => ({}) }),
}));

vi.mock("../../../src/components/Promotion/PreviewDialog.jsx", () => ({
  default: ({ open, onClose, title }) =>
    open ? (
      <div data-testid="preview-dialog" onClick={onClose}>
        Preview: {title}
      </div>
    ) : null,
}));

vi.mock("../../../src/components/Promotion/PosterActions.jsx", () => ({
  default: ({ onPreview, onDownload, title }) => (
    <div data-testid="poster-actions">
      <button onClick={onPreview} data-testid="preview-btn">
        Preview {title}
      </button>
      <button onClick={onDownload} data-testid="download-btn">
        Download
      </button>
    </div>
  ),
}));

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
