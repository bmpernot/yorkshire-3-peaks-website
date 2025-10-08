export const buttons = {
  actionButtonGroup: {
    display: "flex",
    width: "100%",
    gap: 1,
    flexDirection: { xs: "column", sm: "row" },
  },
  previewButton: { flex: 1 },
  downloadButton: {
    flex: 1,
    bgcolor: "#8dc550",
    "&:hover": { bgcolor: "#7ab045" },
  },
  statChip: { 
    bgcolor: "primary.main", 
    color: "primary.contrastText",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "primary.dark",
      transform: "scale(1.05)"
    }
  },
};