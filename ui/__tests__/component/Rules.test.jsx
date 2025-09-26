import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Rules from "@/src/components/Rules/Rules.jsx";

vi.mock("@/src/components/Rules/RuleSection.jsx", () => ({
  default: ({ section }) => <div data-testid={`rule-section-${section.id}`}>{section.title}</div>,
}));

vi.mock("@/src/components/Rules/rulesData.jsx", () => ({
  rulesData: [
    { id: "team", title: "Team Composition" },
    { id: "race", title: "Race" },
  ],
}));

vi.mock("@/src/styles/rules.mui.styles.jsx", () => ({
  styles: {
    pageContainer: {},
    mainTitle: {},
    downloadButtonBox: {},
  },
}));

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

  it("has correct container structure", () => {
    const { container } = render(<Rules />);
    expect(container.querySelector(".MuiContainer-root")).toBeInTheDocument();
  });
});
