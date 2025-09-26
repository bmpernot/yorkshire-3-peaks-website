const layout = {
  pageContainer: { py: 4 },
  mainTitle: { fontWeight: "bold", mb: 4, color: "text.primary" },
  downloadButtonBox: { textAlign: "center", mt: 5 },
};

const accordion = {
  accordion: { "&:before": { display: "none" }, mb: 1.5, boxShadow: 3, borderRadius: 2 },
  accordionSummary: { "& .MuiAccordionSummary-content": { alignItems: "center", gap: 2 } },
  accordionDetails: { bgcolor: "action.hover" },
};

const listItems = {
  ruleListItemIcon: { minWidth: "auto", mr: 1.5, mt: "8px" },
  equipmentListItemIcon: { minWidth: "auto", mr: 1, display: "flex", alignItems: "flex-start", mt: "8px" },
  listItemText: { my: 0 },
  listItemBulletIcon: { fontSize: "0.6rem" },
  tooltipIcon: { fontSize: "1rem", color: "text.secondary", verticalAlign: "middle" },
  perPersonTitle: { mt: 1, mb: 1 },
  checkpointSpan: { display: "inline-block" },
  weatherClothingBox: { pl: 2, pt: 0.5 },
};

export const styles = { ...layout, ...accordion, ...listItems };
