import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PromotionCard from "../../../src/components/Promotion/PromotionCard.jsx";

vi.mock("@mui/material", () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardActions: ({ children, ...props }) => <div {...props}>{children}</div>,
  Typography: ({ children, component, ...props }) => {
    const Component = component || "div";
    return React.createElement(Component, props, children);
  },
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Chip: ({ label, ...props }) => <span {...props}>{label}</span>,
}));

vi.mock("../../../src/styles/promotion.mui.styles.mjs", () => ({
  styles: new Proxy({}, { get: () => ({}) }),
}));

vi.mock("../../../src/components/Promotion/PromotionContent.jsx", () => ({
  default: ({ content }) => (
    <div data-testid="promotion-content">{Array.isArray(content) ? content.join(", ") : content}</div>
  ),
}));

vi.mock("../../../src/components/Promotion/CopyButton.jsx", () => ({
  default: ({ copied, onClick, title, announcementId }) => (
    <button
      data-testid="copy-button"
      onClick={onClick}
      data-copied={copied}
      data-title={title}
      data-announcement-id={announcementId}
    >
      {copied ? "Copied!" : "Copy Text"}
    </button>
  ),
}));

vi.mock("../../../src/components/Promotion/CopyNotification.jsx", () => ({
  default: ({ open, onClose }) =>
    open ? (
      <div data-testid="copy-notification" onClick={onClose}>
        Notification
      </div>
    ) : null,
}));

const mockAnnouncement = {
  id: "test-1",
  title: "Test Announcement",
  type: "Walker",
  icon: <span>Icon</span>,
  content: ["First paragraph", ["List item 1", "List item 2"], "Second paragraph"],
};

const mockWriteText = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(navigator, {
    clipboard: { writeText: mockWriteText },
  });
});

describe("PromotionCard", () => {
  it("renders announcement content correctly", () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    expect(screen.getByText("Test Announcement")).toBeInTheDocument();
    expect(screen.getByText("Walker")).toBeInTheDocument();
    expect(screen.getAllByTestId("promotion-content")).toHaveLength(3);
  });

  it("calls copy function when button is clicked", () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    fireEvent.click(screen.getByTestId("copy-button"));

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
