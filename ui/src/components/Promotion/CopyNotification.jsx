"use client";

import { memo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { styles } from "../../styles/promotion.mui.styles.mjs";

const CopyNotification = memo(({ open, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={2000}
    onClose={onClose}
    anchorOrigin={styles.snackbarAnchor}
    role="status"
    aria-live="polite"
  >
    <Alert severity="success" variant="filled" aria-label="Success notification">
      Text copied to clipboard!
    </Alert>
  </Snackbar>
));

export default CopyNotification;
