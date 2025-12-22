import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PromotionCard from "../../../src/components/Promotion/PromotionCard.jsx";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

const mockAnnouncement = {
  id: "test-1",
  title: "Test Announcement",
  type: "Walker",
  icon: <span>Icon</span>,
  content: ["First paragraph", ["List item 1", "List item 2"], "Second paragraph"],
};

describe("PromotionCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders announcement title and type", () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Announcement");
    expect(screen.getByText("Walker")).toBeInTheDocument();
  });

  it("renders as article with correct aria-label", () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-label", "Promotional content: Test Announcement");
  });

  it("copies text to clipboard when copy button clicked", async () => {
    render(<PromotionCard announcement={mockAnnouncement} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "Test Announcement\n\nFirst paragraph\n\nList item 1\n• List item 2\n\nSecond paragraph",
      );
    });
  });
});
