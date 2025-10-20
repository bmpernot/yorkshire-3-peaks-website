"use client";

import { memo } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { styles } from "../../styles/promotion.mui.styles.mjs";

const PreviewDialog = memo(({ open, onClose, title, description, imageUrl }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="lg"
    fullWidth
    aria-labelledby="preview-dialog-title"
    aria-describedby="preview-dialog-description"
    sx={styles.previewDialog}
  >
    <DialogTitle id="preview-dialog-title" sx={styles.dialogTitle}>
      {title}
      <IconButton onClick={onClose} sx={styles.closeButton} aria-label="Close preview dialog">
        <Close aria-hidden="true" />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={styles.dialogContent} id="preview-dialog-description">
      <Box sx={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={`Full size preview of ${title}. ${description}`}
          style={styles.previewImage}
          role="img"
        />
      </Box>
    </DialogContent>
  </Dialog>
));

export default PreviewDialog;
