import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Rules from "@/src/components/Rules/Rules.jsx";

vi.mock("@mui/material", () => ({
  Container: ({ children, maxWidth, ...props }) => <div {...props}>{children}</div>,
  Typography: ({ children, component, variant, gutterBottom, ...props }) => {
    const Component = component || (variant?.startsWith("h") ? variant : "div");
    return React.createElement(Component, props, children);
  },
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, href, ...props }) =>
    href ? (
      <a href={href} {...props}>
        {children}
      </a>
    ) : (
      <button {...props}>{children}</button>
    ),
}));

vi.mock("@mui/icons-material", () => ({
  Download: () => <span>Download</span>,
}));

vi.mock("@/src/styles/rules.mui.styles.jsx", () => ({
  styles: new Proxy({}, { get: () => ({}) }),
}));

vi.mock("@/src/components/Rules/RuleSection.jsx", () => ({
  default: ({ section }) => <div data-testid={`rule-section-${section.id}`}>{section.title}</div>,
}));

vi.mock("@/src/components/Rules/rulesData.jsx", () => ({
  rulesData: [
    { id: "team", title: "Team Composition" },
    { id: "race", title: "Race" },
  ],
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

  it("renders container element", () => {
    const { container } = render(<Rules />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
