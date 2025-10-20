"use client";

import { memo } from "react";
import { Button } from "@mui/material";
import { ContentCopy, Check } from "@mui/icons-material";

const CopyButton = memo(({ copied, onClick, title, announcementId }) => (
  <Button
    variant="contained"
    startIcon={copied ? <Check aria-hidden="true" /> : <ContentCopy aria-hidden="true" />}
    onClick={onClick}
    color={copied ? "success" : "primary"}
    size="small"
    fullWidth
    aria-label={copied ? `Text copied successfully from ${title}` : `Copy promotional text for ${title} to clipboard`}
    aria-describedby={copied ? undefined : `card-title-${announcementId}`}
  >
    {copied ? "Copied!" : "Copy Text"}
  </Button>
));

export default CopyButton;
