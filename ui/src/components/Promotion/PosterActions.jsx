"use client";

import { memo } from "react";
import { Box, Button } from "@mui/material";
import { Download, Visibility } from "@mui/icons-material";
import { styles } from "../../styles/promotion.mui.styles.mjs";

const PosterActions = memo(({ title, type, onPreview, onDownload }) => (
  <Box sx={styles.actionButtonGroup} role="group" aria-label={`Actions for ${title}`}>
    <Button
      variant="outlined"
      startIcon={<Visibility aria-hidden="true" />}
      onClick={onPreview}
      size="small"
      sx={styles.previewButton}
      aria-label={`Preview ${title} in modal dialog`}
      aria-describedby={`poster-title-${type.toLowerCase()}`}
    >
      Preview
    </Button>
    <Button
      variant="contained"
      startIcon={<Download aria-hidden="true" />}
      onClick={onDownload}
      size="small"
      sx={styles.downloadButton}
      aria-label={`Download ${title} as SVG file`}
      aria-describedby={`poster-title-${type.toLowerCase()}`}
    >
      Download SVG
    </Button>
  </Box>
));

export default PosterActions;
