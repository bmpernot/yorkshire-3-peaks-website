import React from "react";
import { render, screen } from "@testing-library/react";
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

  it("renders BulletedList with correct props", () => {
    render(<RuleSection section={mockSection} />);
    const list = screen.getByTestId("bulleted-list");
    expect(list).toHaveAttribute("data-type", "rule");
  });

  it("has correct accordion structure", () => {
    render(<RuleSection section={mockSection} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("sets correct aria attributes", () => {
    render(<RuleSection section={mockSection} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-controls", "test-section-content");
    expect(button).toHaveAttribute("id", "test-section-header");
  });
});
