import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CopyButton from "../../../src/components/common/CopyButton.jsx";

const mockProps = {
  copied: false,
  onClick: vi.fn(),
  title: "Test Title",
  announcementId: "test-123",
};

describe("CopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders copy state correctly", () => {
    render(<CopyButton {...mockProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Copy Text");
    expect(button).toHaveAttribute("aria-label", "Copy promotional text for Test Title to clipboard");
  });

  it("renders copied state correctly", () => {
    render(<CopyButton {...mockProps} copied={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Copied!");
    expect(button).toHaveAttribute("aria-label", "Text copied successfully from Test Title");
  });

  it("calls onClick when clicked", () => {
    render(<CopyButton {...mockProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility attributes", () => {
    render(<CopyButton {...mockProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-describedby", "card-title-test-123");
  });

  it("removes aria-describedby when copied", () => {
    render(<CopyButton {...mockProps} copied={true} />);

    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("aria-describedby");
  });

  it("changes color when copied", () => {
    const { rerender } = render(<CopyButton {...mockProps} />);

    rerender(<CopyButton {...mockProps} copied={true} />);

    expect(screen.getByRole("button")).toHaveTextContent("Copied!");
  });
});
