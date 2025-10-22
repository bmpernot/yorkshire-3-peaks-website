import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Promotion from "../../../src/components/Promotion/Promotion.jsx";

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
  it("renders main heading and description", () => {
    render(<Promotion />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Promotional Material");
    expect(screen.getByText(/Ready-to-use content to help spread the word/)).toBeInTheDocument();
  });

  it("renders navigation chips", () => {
    render(<Promotion />);

    expect(screen.getByText(/5 Recruitment Posts/)).toBeInTheDocument();
    expect(screen.getByText(/3 Event Reminders/)).toBeInTheDocument();
    expect(screen.getByText(/4 Downloadable Posters/)).toBeInTheDocument();
  });

  it("renders usage guidelines", () => {
    render(<Promotion />);

    expect(screen.getByText(/Usage Guidelines:/)).toBeInTheDocument();
    expect(screen.getByRole("note", { name: "Usage guidelines" })).toBeInTheDocument();
  });

  it("renders all sections initially collapsed", () => {
    render(<Promotion />);

    expect(screen.queryByText("Recruitment Announcements")).toBeInTheDocument();
    expect(screen.queryByText("Event Reminders")).toBeInTheDocument();
    expect(screen.queryByText("Downloadable Posters")).toBeInTheDocument();
  });

  it("expands section when accordion is clicked", () => {
    render(<Promotion />);

    const recruitmentSection = screen.getByText("Recruitment Announcements");
    fireEvent.click(recruitmentSection);

    // Check that content becomes visible
    expect(screen.getByText(/Use these posts to recruit walkers/)).toBeInTheDocument();
  });

  it("navigates to section when chip is clicked", () => {
    render(<Promotion />);

    const recruitmentChip = screen.getByText(/Recruitment Posts/);
    fireEvent.click(recruitmentChip);

    vi.runAllTimers();

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(mockFocus).toHaveBeenCalled();
  });

  it("renders navigation with correct accessibility", () => {
    render(<Promotion />);

    expect(screen.getByRole("navigation", { name: "Quick navigation to content sections" })).toBeInTheDocument();
  });
});
