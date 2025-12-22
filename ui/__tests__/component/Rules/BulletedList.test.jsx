import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulletedList from "@/src/components/Rules/BulletedList.jsx";

describe("BulletedList", () => {
  it("renders text items in a list", () => {
    render(<BulletedList items={[{ text: "Test item" }]} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Test item")).toBeInTheDocument();
  });

  it("renders headings as h6 elements", () => {
    render(<BulletedList items={[{ type: "heading", text: "Test Heading" }]} />);
    expect(screen.getByRole("heading", { level: 6 })).toHaveTextContent("Test Heading");
  });

  it("renders tooltip icon when tooltip provided", () => {
    render(<BulletedList items={[{ text: "Test", tooltip: "Helpful info" }]} />);
    expect(screen.getByLabelText("Helpful info")).toBeInTheDocument();
  });

  it("renders custom primary content", () => {
    render(<BulletedList items={[{ primary: <span>Custom content</span> }]} />);
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });

  it("renders mixed content types", () => {
    const items = [
      { type: "heading", text: "Section" },
      { text: "Regular item" },
      { text: "Item with tooltip", tooltip: "Info" },
    ];
    render(<BulletedList items={items} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Section");
    expect(screen.getByText("Regular item")).toBeInTheDocument();
    expect(screen.getByLabelText("Info")).toBeInTheDocument();
  });
});
