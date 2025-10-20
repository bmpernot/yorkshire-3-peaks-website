import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Rules from "@/src/components/Rules/Rules.jsx";

describe("Rules", () => {
  it("renders title correctly", () => {
    render(<Rules />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Event Rules");
  });

  it("renders all rule sections", () => {
    render(<Rules />);
    expect(screen.getByTestId("rule-section-team")).toBeInTheDocument();
    expect(screen.getByTestId("rule-section-race")).toBeInTheDocument();
  });

  it("renders download button with correct attributes", () => {
    render(<Rules />);
    const button = screen.getByRole("link", { name: "Download Rules PDF" });
    expect(button).toHaveAttribute("href", "/documents/Yorkshire Three Peaks Rules.pdf");
  });

  it("renders container element", () => {
    const { container } = render(<Rules />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
