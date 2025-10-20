import { vi } from "vitest";

export const mockData = {
  promotionData: {
    recruitment: [
      { id: "r1", title: "Recruitment 1" },
      { id: "r2", title: "Recruitment 2" },
    ],
    reminders: [{ id: "rem1", title: "Reminder 1" }],
  },
  posterData: [{ title: "Poster 1" }, { title: "Poster 2" }],
};

export const createMockComponent = (name) => {
  const components = {
    PromotionCard: ({ announcement, ariaLabel }) => (
      <div data-testid={`promotion-card-${announcement.id}`} aria-label={ariaLabel}>
        {announcement.title}
      </div>
    ),
    PosterCard: ({ title, ariaLabel }) => (
      <div data-testid={`poster-card-${title}`} aria-label={ariaLabel}>
        {title}
      </div>
    ),
    NavigationChip: ({ section, onClick, onKeyDown, count, label }) => (
      <button
        data-testid={`nav-chip-${section}`}
        onClick={() => onClick(section)}
        onKeyDown={(e) => onKeyDown(e, section)}
      >
        {count} {label}
      </button>
    ),
    PromotionSection: ({ sectionRef, expanded, onToggle, title, sectionId, children }) => (
      <div ref={sectionRef} data-testid={`section-${sectionId}`} data-expanded={expanded}>
        <button onClick={onToggle} data-testid={`toggle-${sectionId}`}>
          {title}
        </button>
        {expanded && <div data-testid={`content-${sectionId}`}>{children}</div>}
      </div>
    ),
  };
  return components[name];
};

export const setupDOMMocks = () => {
  const mockScrollIntoView = vi.fn();
  const mockFocus = vi.fn();

  Element.prototype.scrollIntoView = mockScrollIntoView;
  HTMLElement.prototype.focus = mockFocus;

  return { mockScrollIntoView, mockFocus };
};
