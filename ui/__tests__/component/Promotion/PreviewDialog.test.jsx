import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PreviewDialog from "../../../src/components/Promotion/PreviewDialog.jsx";

const mockProps = {
  open: true,
  onClose: vi.fn(),
  title: "Test Poster",
  description: "Test description",
  imageUrl: "/test-image.svg",
};

describe("PreviewDialog", () => {
  it("renders when open", () => {
    render(<PreviewDialog {...mockProps} />);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Poster")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/test-image.svg");
  });

  it("does not render when closed", () => {
    render(<PreviewDialog {...mockProps} open={false} />);

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<PreviewDialog {...mockProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<PreviewDialog {...mockProps} />);

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "preview-dialog-title");
    expect(dialog).toHaveAttribute("aria-describedby", "preview-dialog-description");

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Full size preview of Test Poster. Test description");

    const closeButton = screen.getByRole("button");
    expect(closeButton).toHaveAttribute("aria-label", "Close preview dialog");
  });
});
