import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Promotion from "../../../src/components/Promotion/index.jsx";

const mockScrollIntoView = vi.fn();
const mockFocus = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  Element.prototype.scrollIntoView = mockScrollIntoView;
  HTMLElement.prototype.focus = mockFocus;
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
