"use client";

import { memo, useState, useCallback } from "react";
import { Card, CardContent, Typography, Box, Chip, CardActions } from "@mui/material";
import { styles } from "../../styles/promotion.mui.styles.mjs";
import PromotionContent from "./PromotionContent.jsx";
import CopyButton from "./CopyButton.jsx";
import CopyNotification from "./CopyNotification.jsx";

const PromotionCard = memo(function PromotionCardComponent({ announcement, ariaLabel }) {
  const [copied, setCopied] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCopyText = useCallback(async () => {
    const textContent = announcement.content
      .map((item) => (Array.isArray(item) ? item.join("\n• ") : item))
      .join("\n\n");

    const fullText = `${announcement.title}\n\n${textContent}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setShowSnackbar(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [announcement.content, announcement.title]);

  const handleCloseSnackbar = useCallback(() => setShowSnackbar(false), []);

  return (
    <Card
      sx={styles.promotionCard}
      role="article"
      aria-label={ariaLabel || `Promotional content: ${announcement.title}`}
    >
      <CardContent sx={styles.cardContentFlex}>
        <Box sx={styles.cardHeader}>
          <Box aria-hidden="true">{announcement.icon}</Box>
          <Typography variant="h6" sx={styles.cardTitle} component="h3" id={`card-title-${announcement.id}`}>
            {announcement.title}
          </Typography>
          <Chip
            label={announcement.type}
            size="small"
            sx={styles.typeChip}
            color={announcement.type === "Volunteer" ? "secondary" : "primary"}
            aria-label={`Content type: ${announcement.type}`}
          />
        </Box>
        <Box sx={styles.cardContent} aria-describedby={`card-title-${announcement.id}`}>
          {announcement.content.map((item, index) => (
            <Box key={index}>
              <PromotionContent content={item} />
            </Box>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={styles.cardActionsCentered}>
        <CopyButton
          copied={copied}
          onClick={handleCopyText}
          title={announcement.title}
          announcementId={announcement.id}
        />
      </CardActions>

      <CopyNotification open={showSnackbar} onClose={handleCloseSnackbar} />
    </Card>
  );
});

export default PromotionCard;
