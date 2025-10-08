"use client";

import { memo, useState, useCallback } from "react";
import { Card, CardContent, CardMedia, Typography, Box, Chip, CardActions } from "@mui/material";
import { Image } from "@mui/icons-material";
import { styles } from "../../styles/promotion.mui.styles.mjs";
import PreviewDialog from "./PreviewDialog.jsx";
import PosterActions from "./PosterActions.jsx";

const PosterCard = memo(({ title, description, downloadUrl, type, ariaLabel }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = downloadUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [downloadUrl]);

  const handlePreview = useCallback(() => setPreviewOpen(true), []);
  const handleClosePreview = useCallback(() => setPreviewOpen(false), []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePreview();
      }
    },
    [handlePreview],
  );

  return (
    <Card sx={styles.promotionCard} role="article" aria-label={ariaLabel || `Downloadable poster: ${title}`}>
      <CardMedia
        component="img"
        height="300"
        image={downloadUrl}
        alt={`Preview of ${title} - click to view full size`}
        sx={styles.posterImage}
        onClick={handlePreview}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Preview ${title} in full size`}
      />
      <CardContent sx={styles.cardContentFlex}>
        <Box sx={styles.cardHeader}>
          <Image aria-hidden="true" />
          <Typography variant="h6" sx={styles.cardTitle} component="h3" id={`poster-title-${type.toLowerCase()}`}>
            {title}
          </Typography>
          <Chip
            label={type}
            size="small"
            sx={styles.typeChip}
            color={type === "Volunteer" ? "secondary" : type === "Walker" ? "primary" : "default"}
            aria-label={`Poster type: ${type}`}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{ ...styles.cardContent, flex: 1 }}
          aria-describedby={`poster-title-${type.toLowerCase()}`}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={styles.cardActions}>
        <PosterActions title={title} type={type} onPreview={handlePreview} onDownload={handleDownload} />
      </CardActions>

      <PreviewDialog
        open={previewOpen}
        onClose={handleClosePreview}
        title={title}
        description={description}
        imageUrl={downloadUrl}
      />
    </Card>
  );
});

export default PosterCard;
