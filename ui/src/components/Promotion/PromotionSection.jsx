"use client";

import { memo } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Box } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { styles } from "../../styles/promotion.mui.styles.mjs";

const PromotionSection = memo(function PromotionSectionComponent({
  sectionRef,
  expanded,
  onToggle,
  icon,
  title,
  count,
  description,
  sectionId,
  children,
}) {
  return (
    <Accordion ref={sectionRef} expanded={expanded} onChange={onToggle} sx={styles.accordion}>
      <AccordionSummary
        expandIcon={<ExpandMore aria-hidden="true" />}
        sx={styles.accordionSummary}
        aria-controls={`${sectionId}-content`}
        id={`${sectionId}-header`}
      >
        {icon}
        <Typography variant="h5" sx={styles.accordionTitle} component="h2">
          {title}
        </Typography>
        <Chip label={count} size="small" sx={styles.countChip} aria-label={`${count} items available`} />
      </AccordionSummary>
      <AccordionDetails
        sx={styles.accordionDetails}
        id={`${sectionId}-content`}
        aria-labelledby={`${sectionId}-header`}
      >
        <Typography variant="body2" sx={styles.sectionDescription} id={`${sectionId}-description`}>
          {description}
        </Typography>
        <Box sx={styles.gridContainer} role="list" aria-label={title}>
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

export default PromotionSection;
