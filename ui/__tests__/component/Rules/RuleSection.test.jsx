import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RuleSection from "@/src/components/Rules/RuleSection.jsx";

vi.mock("@mui/material", () => ({
  Accordion: ({ children, ...props }) => <div {...props}>{children}</div>,
  AccordionSummary: ({ children, ...props }) => <button {...props}>{children}</button>,
  AccordionDetails: ({ children, ...props }) => <div {...props}>{children}</div>,
  Typography: ({ children, component, variant, ...props }) => {
    const Component = component || (variant?.startsWith("h") ? variant : "div");
    return React.createElement(Component, props, children);
  },
}));

vi.mock("@mui/icons-material", () => ({
  ExpandMore: () => <span>ExpandMore</span>,
}));

vi.mock("@/src/components/Rules/BulletedList.jsx", () => ({
  default: ({ items, type }) => (
    <div data-testid="bulleted-list" data-type={type}>
      {items?.map((item, i) => (
        <div key={i}>{item.text}</div>
      ))}
    </div>
  ),
}));

vi.mock("@/src/styles/rules.mui.styles.jsx", () => ({
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
