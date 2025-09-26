import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BulletedList from "../../src/components/Rules/BulletedList.jsx";

vi.mock("../../src/styles/rules.mui.styles.mjs", () => ({
  styles: {
    ruleListItemIcon: {},
    equipmentListItemIcon: {},
    listItemText: {},
    listItemBulletIcon: {},
    tooltipIcon: {},
    perPersonTitle: {},
  },
}));

describe("BulletedList", () => {
  const mockItems = [
    { text: "Regular item" },
    { type: "heading", text: "Section Heading" },
    { text: "Item with tooltip", tooltip: "Helpful info" },
    { primary: <span>Custom primary content</span> },
  ];

  it("renders regular text items", () => {
    render(<BulletedList items={[{ text: "Test item" }]} />);
    expect(screen.getByText("Test item")).toBeInTheDocument();
  });

  it("renders headings correctly", () => {
    render(<BulletedList items={[{ type: "heading", text: "Test Heading" }]} />);
    expect(screen.getByRole("heading", { level: 6 })).toHaveTextContent("Test Heading");
  });

  it("renders tooltips when provided", () => {
    render(<BulletedList items={[{ text: "Test", tooltip: "Tooltip text" }]} />);
    expect(screen.getByLabelText("Tooltip text")).toBeInTheDocument();
  });

  it("renders primary content when provided", () => {
    render(<BulletedList items={[{ primary: <span>Primary content</span> }]} />);
    expect(screen.getByText("Primary content")).toBeInTheDocument();
  });

  it("uses equipment styles when type is equipment", () => {
    const { container } = render(<BulletedList items={mockItems} type="equipment" />);
    expect(container.querySelector(".MuiList-root")).toBeInTheDocument();
  });

  it("renders bullet icons for list items", () => {
    const { container } = render(<BulletedList items={[{ text: "Test" }]} />);
    expect(container.querySelector(".MuiListItemIcon-root")).toBeInTheDocument();
  });
});
