import React from "react";
import { render, screen, user } from "@testing-library/react";
import { vi } from "vitest";
import PromotionCard from "../../../src/components/Promotion/PromotionCard.jsx";

const mockAnnouncement = {
  id: "test-1",
  title: "Test Announcement",
  type: "Walker",
  icon: <span>Icon</span>,
  content: ["First paragraph", ["List item 1", "List item 2"], "Second paragraph"],
};

const mockWriteText = vi.fn();

describe("PromotionCard", () => {
  it("renders announcement content correctly", () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    expect(screen.getByText("Test Announcement")).toBeInTheDocument();
    expect(screen.getByText("Walker")).toBeInTheDocument();
    expect(screen.getAllByTestId("promotion-content")).toHaveLength(3);
  });

  it("calls copy function when button is clicked", async () => {
    const userEvent = user.setup();
    render(<PromotionCard announcement={mockAnnouncement} />);

    await userEvent.click(screen.getByTestId("copy-button"));

    expect(mockWriteText).toHaveBeenCalledWith(
      "Test Announcement\n\nFirst paragraph\n\nList item 1\n• List item 2\n\nSecond paragraph",
    );
  });

  it("passes correct props to sub-components", () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    const copyButton = screen.getByTestId("copy-button");
    expect(copyButton).toHaveAttribute("data-title", "Test Announcement");
    expect(copyButton).toHaveAttribute("data-announcement-id", "test-1");
  });
});
