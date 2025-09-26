import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RuleSection from "../../src/components/Rules/RuleSection.jsx";

vi.mock("../../src/components/Rules/BulletedList.jsx", () => ({
  default: ({ items, type }) => (
    <div data-testid="bulleted-list" data-type={type}>
      {items?.map((item, i) => (
        <div key={i}>{item.text}</div>
      ))}
    </div>
  ),
}));

vi.mock("../../src/styles/rules.mui.styles.mjs", () => ({
  styles: {
    accordion: {},
    accordionSummary: {},
    accordionDetails: {},
  },
}));

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
