"use client";

import { Typography } from "@mui/material";
import { Landscape as LandscapeIcon } from "@mui/icons-material";
import { styles } from "../../styles/customIcons.mui.styles.mjs";

export function LogoTitle({ dataCy }) {
  return (
    <div style={styles.logoTitle}>
      <LandscapeIcon sx={styles.logo} data-cy={`${dataCy}-logo`} />
      <Typography data-cy={`${dataCy}-title`} variant="h5" noWrap component="span" sx={styles.title}>
        Y3P
      </Typography>
    </div>
  );
}
