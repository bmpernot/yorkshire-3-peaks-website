import { memo, useMemo } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { styles } from "../../styles/rules.mui.styles.mjs";
import BulletedList from "./BulletedList.jsx";

const RuleSection = memo(function RuleSectionComponent({ section }) {
  const ariaControls = useMemo(() => `${section.id}-content`, [section.id]);
  const headerId = useMemo(() => `${section.id}-header`, [section.id]);

  return (
    <Accordion sx={styles.accordion}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={ariaControls}
        id={headerId}
        sx={styles.accordionSummary}
      >
        {section.icon}
        <Typography variant="h5">{section.title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <BulletedList items={section.items} type={section.type} />
      </AccordionDetails>
    </Accordion>
  );
});

export default RuleSection;
