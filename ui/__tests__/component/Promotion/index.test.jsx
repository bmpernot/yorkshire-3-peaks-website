import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Promotion from "../../../src/components/Promotion/index.jsx";

vi.mock("@mui/material", () => ({
  Container: ({ children, maxWidth, ...props }) => <div {...props}>{children}</div>,
  Typography: ({ children, component, variant, gutterBottom, ...props }) => {
    const Component = component || (variant?.startsWith("h") ? variant : "div");
    return React.createElement(Component, props, children);
  },
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Divider: () => <hr />,
  Breadcrumbs: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

vi.mock("@mui/icons-material", () => ({
  Groups: () => <span>Groups</span>,
  Schedule: () => <span>Schedule</span>,
  Download: () => <span>Download</span>,
  Home: () => <span>Home</span>,
}));

vi.mock("../../../src/styles/promotion.mui.styles.mjs", () => ({
  styles: new Proxy({}, { get: () => ({}) }),
}));

vi.mock("../../../src/components/Promotion/PromotionCard.jsx", () => ({
  default: ({ announcement, ariaLabel }) => (
    <div data-testid={`promotion-card-${announcement.id}`} aria-label={ariaLabel}>
      {announcement.title}
    </div>
  ),
}));

vi.mock("../../../src/components/Promotion/PosterCard.jsx", () => ({
  default: ({ title, ariaLabel }) => (
    <div data-testid={`poster-card-${title}`} aria-label={ariaLabel}>
      {title}
    </div>
  ),
}));

vi.mock("../../../src/components/Promotion/NavigationChip.jsx", () => ({
  default: ({ section, onClick, onKeyDown, count, label }) => (
    <button
      data-testid={`nav-chip-${section}`}
      onClick={() => onClick(section)}
      onKeyDown={(e) => onKeyDown(e, section)}
    >
      {count} {label}
    </button>
  ),
}));

vi.mock("../../../src/components/Promotion/PromotionSection.jsx", () => ({
  default: ({ sectionRef, expanded, onToggle, title, sectionId, children }) => (
    <div ref={sectionRef} data-testid={`section-${sectionId}`} data-expanded={expanded}>
      <button onClick={onToggle} data-testid={`toggle-${sectionId}`}>
        {title}
      </button>
      {expanded && <div data-testid={`content-${sectionId}`}>{children}</div>}
    </div>
  ),
}));

vi.mock("../../../src/data/promotionData.jsx", () => ({
  promotionData: {
    recruitment: [{ id: "r1", title: "Recruitment 1" }],
    reminders: [{ id: "rem1", title: "Reminder 1" }],
  },
}));

vi.mock("../../../src/data/posterData.jsx", () => ({
  posterData: [{ title: "Poster 1" }],
}));

const mockScrollIntoView = vi.fn();
const mockFocus = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  Element.prototype.scrollIntoView = mockScrollIntoView;
  HTMLElement.prototype.focus = mockFocus;
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Promotion Component", () => {
  describe("Initial Rendering", () => {
    it("renders main content correctly", () => {
      render(<Promotion />);

      expect(screen.getByRole("heading", { name: "Promotional Material" })).toBeInTheDocument();
      expect(
        screen.getByText("Ready-to-use content to help spread the word about the Yorkshire Three Peaks Challenge"),
      ).toBeInTheDocument();
      expect(screen.getByText(/Help us spread the word/)).toBeInTheDocument();
      expect(screen.getByText(/Usage Guidelines:/)).toBeInTheDocument();
    });

    it("renders navigation chips with correct counts", () => {
      render(<Promotion />);

      expect(screen.getByTestId("nav-chip-recruitment")).toHaveTextContent("1 Recruitment Posts");
      expect(screen.getByTestId("nav-chip-reminders")).toHaveTextContent("1 Event Reminders");
      expect(screen.getByTestId("nav-chip-posters")).toHaveTextContent("1 Downloadable Posters");
    });

    it("renders all sections initially collapsed", () => {
      render(<Promotion />);

      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "false");
      expect(screen.getByTestId("section-reminders")).toHaveAttribute("data-expanded", "false");
      expect(screen.getByTestId("section-posters")).toHaveAttribute("data-expanded", "false");
    });
  });

  describe("Section Interactions", () => {
    it("toggles section expansion when section toggle is clicked", () => {
      render(<Promotion />);

      const recruitmentToggle = screen.getByTestId("toggle-recruitment");
      fireEvent.click(recruitmentToggle);

      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "true");

      fireEvent.click(recruitmentToggle);
      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "false");
    });

    it("expands section and scrolls when navigation chip is clicked", () => {
      render(<Promotion />);

      const recruitmentChip = screen.getByTestId("nav-chip-recruitment");
      fireEvent.click(recruitmentChip);

      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "true");

      // Mock timers to avoid real setTimeout delay
      vi.runAllTimers();

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
      expect(mockFocus).toHaveBeenCalled();
    });

    it("does not expand already expanded sections when chip is clicked", () => {
      render(<Promotion />);

      fireEvent.click(screen.getByTestId("nav-chip-recruitment"));
      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "true");

      fireEvent.click(screen.getByTestId("nav-chip-recruitment"));
      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "true");

      vi.runAllTimers();
      expect(mockScrollIntoView).toHaveBeenCalledTimes(2);
    });
  });

  describe("Keyboard Navigation", () => {
    it("handles keyboard navigation on chips", () => {
      render(<Promotion />);

      const recruitmentChip = screen.getByTestId("nav-chip-recruitment");
      fireEvent.keyDown(recruitmentChip, { key: "Enter" });
      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "true");

      const remindersChip = screen.getByTestId("nav-chip-reminders");
      fireEvent.keyDown(remindersChip, { key: " " });
      expect(screen.getByTestId("section-reminders")).toHaveAttribute("data-expanded", "true");
    });

    it("ignores non-navigation keys", () => {
      render(<Promotion />);

      const recruitmentChip = screen.getByTestId("nav-chip-recruitment");
      fireEvent.keyDown(recruitmentChip, { key: "Tab" });

      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "false");
    });
  });

  describe("Content Rendering", () => {
    it("renders promotion cards with correct props", () => {
      render(<Promotion />);

      fireEvent.click(screen.getByTestId("toggle-recruitment"));

      expect(screen.getByTestId("promotion-card-r1")).toHaveAttribute(
        "aria-label",
        "Recruitment announcement 1 of 1: Recruitment 1",
      );
    });

    it("renders poster cards with correct props", () => {
      render(<Promotion />);

      fireEvent.click(screen.getByTestId("toggle-posters"));

      expect(screen.getByTestId("poster-card-Poster 1")).toHaveAttribute("aria-label", "Poster 1 - 1 of 1 posters");
    });
  });

  describe("Edge Cases", () => {
    it("handles missing ref element gracefully", () => {
      render(<Promotion />);

      const originalRef = HTMLElement.prototype.scrollIntoView;
      HTMLElement.prototype.scrollIntoView = null;

      fireEvent.click(screen.getByTestId("nav-chip-recruitment"));

      expect(screen.getByTestId("section-recruitment")).toHaveAttribute("data-expanded", "true");

      HTMLElement.prototype.scrollIntoView = originalRef;
    });
  });
});
