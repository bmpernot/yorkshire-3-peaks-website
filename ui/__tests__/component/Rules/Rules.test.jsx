import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Rules from "@/src/components/Rules/Rules.jsx";

describe("Rules", () => {
  it("renders main title", () => {
    render(<Rules />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Event Rules");
  });

  it("renders all rule sections", () => {
    render(<Rules />);
    expect(screen.getByText("Team Composition")).toBeInTheDocument();
    expect(screen.getByText("Race")).toBeInTheDocument();
    expect(screen.getByText("Event")).toBeInTheDocument();
    expect(screen.getByText("Safety & Retirements")).toBeInTheDocument();
    expect(screen.getByText("Conduct")).toBeInTheDocument();
    expect(screen.getByText("Equipment")).toBeInTheDocument();
    expect(screen.getByText("Generic Rules")).toBeInTheDocument();
  });

  it("renders download button with correct link", () => {
    render(<Rules />);
    const button = screen.getByRole("link", { name: "Download Rules PDF" });
    expect(button).toHaveAttribute("href", "/documents/Yorkshire Three Peaks Rules.pdf");
  });

  it("renders correct number of sections", () => {
    render(<Rules />);

    expect(screen.getAllByRole("button")).toHaveLength(7);
  });
});
