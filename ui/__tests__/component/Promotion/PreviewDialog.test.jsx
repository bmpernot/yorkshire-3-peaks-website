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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog with title when open", () => {
    render(<PreviewDialog {...mockProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Poster")).toBeInTheDocument();
  });

  it("renders image with correct src and alt text", () => {
    render(<PreviewDialog {...mockProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test-image.svg");
    expect(image).toHaveAttribute("alt", "Full size preview of Test Poster. Test description");
  });

  it("does not render when closed", () => {
    render(<PreviewDialog {...mockProps} open={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when close button clicked", () => {
    render(<PreviewDialog {...mockProps} />);

    const closeButton = screen.getByRole("button", { name: "Close preview dialog" });
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});
