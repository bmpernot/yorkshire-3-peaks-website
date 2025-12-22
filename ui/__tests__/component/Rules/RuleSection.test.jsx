import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RuleSection from "@/src/components/Rules/RuleSection.jsx";

const mockSection = {
  id: "test-section",
  title: "Test Section",
  icon: <div data-testid="test-icon">Icon</div>,
  items: [{ text: "Test item" }],
  type: "rule",
};

describe("RuleSection", () => {
  it("renders section title and icon", () => {
    render(<RuleSection section={mockSection} />);
    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders as collapsed accordion initially", () => {
    render(<RuleSection section={mockSection} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("expands when clicked", () => {
    render(<RuleSection section={mockSection} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Test item")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<RuleSection section={mockSection} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-controls", "test-section-content");
    expect(button).toHaveAttribute("id", "test-section-header");
  });
});
