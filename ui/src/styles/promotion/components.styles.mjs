export const components = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
    gap: 3,
    mt: 3,
  },
  accordion: {
    "&:before": { display: "none" },
    mb: 2,
    boxShadow: 2,
    borderRadius: 2,
  },
  accordionSummary: {
    "& .MuiAccordionSummary-content": { alignItems: "center", gap: 2 },
  },
  accordionDetails: {
    bgcolor: "action.hover",
    pt: 2,
  },
  accordionTitle: { fontWeight: "bold", flex: 1 },
  sectionIcon: { color: "primary.main" },
  countChip: { ml: "auto", bgcolor: "primary.main", color: "white" },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    mb: 4,
    flexWrap: "wrap",
  },
  guidelinesBox: {
    bgcolor: "action.hover",
    p: 3,
    borderRadius: 2,
    mb: 4,
  },
  guidelines: {
    mb: 1,
    color: "text.secondary",
  },
  lastUpdated: {
    color: "text.disabled",
    fontStyle: "italic",
  },
  sectionDescription: {
    mb: 2,
    color: "text.secondary",
    fontStyle: "italic",
  },
  snackbarAnchor: { vertical: "bottom", horizontal: "center" },
};
