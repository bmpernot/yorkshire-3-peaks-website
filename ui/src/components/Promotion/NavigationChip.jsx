"use client";

import { memo } from "react";
import { Chip } from "@mui/material";
import { styles } from "../../styles/promotion.mui.styles.mjs";

const NavigationChip = memo(({ icon, label, count, section, onClick, onKeyDown }) => (
  <Chip
    icon={icon}
    label={`${count} ${label}`}
    sx={styles.statChip}
    onClick={() => onClick(section)}
    onKeyDown={(e) => onKeyDown(e, section)}
    clickable
    tabIndex={0}
    role="button"
    aria-label={`Jump to ${section} section with ${count} ${label.toLowerCase()}`}
    aria-describedby={`${section}-description`}
  />
));

export default NavigationChip;