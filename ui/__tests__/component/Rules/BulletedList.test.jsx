import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulletedList from "@/src/components/Rules/BulletedList.jsx";

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

  it("renders list with equipment type", () => {
    render(<BulletedList items={mockItems} type="equipment" />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders bullet icons for list items", () => {
    render(<BulletedList items={[{ text: "Test" }]} />);
    expect(screen.getByText("•")).toBeInTheDocument();
  });
});
