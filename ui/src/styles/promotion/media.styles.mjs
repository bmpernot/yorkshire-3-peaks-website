export const media = {
  posterImage: {
    objectFit: "contain",
    bgcolor: "grey.100",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
    "&:hover": { opacity: 0.8 },
    "&:focus": {
      opacity: 0.8,
      outline: "2px solid #1976d2",
      outlineOffset: "2px",
    },
  },
  previewImage: { objectFit: "contain" },
};
