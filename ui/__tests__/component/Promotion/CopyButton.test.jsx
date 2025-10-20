import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CopyButton from "../../../src/components/Promotion/CopyButton.jsx";

vi.mock("@mui/material", () => ({
  Button: ({ children, onClick, startIcon, ...props }) => (
    <button onClick={onClick} {...props}>
      {startIcon}
      {children}
    </button>
  ),
}));

vi.mock("@mui/icons-material", () => ({
  ContentCopy: () => <span data-testid="copy-icon">Copy</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
}));

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

    expect(screen.getByText("Copy Text")).toBeInTheDocument();
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("renders copied state correctly", () => {
    render(<CopyButton {...mockProps} copied={true} />);

    expect(screen.getByText("Copied!")).toBeInTheDocument();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(<CopyButton {...mockProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility attributes", () => {
    render(<CopyButton {...mockProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Copy promotional text for Test Title to clipboard");
    expect(button).toHaveAttribute("aria-describedby", "card-title-test-123");
  });

  it("has correct accessibility attributes when copied", () => {
    render(<CopyButton {...mockProps} copied={true} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Text copied successfully from Test Title");
    expect(button).not.toHaveAttribute("aria-describedby");
  });
});
