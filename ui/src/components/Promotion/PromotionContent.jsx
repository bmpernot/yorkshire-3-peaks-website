"use client";

import { memo } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import { styles } from "../../styles/promotion.mui.styles.mjs";

const PromotionContent = memo(function PromotionContentComponent({ content }) {
  if (Array.isArray(content)) {
    return (
      <List dense disablePadding>
        {content.map((item, index) => (
          <ListItem key={index} sx={styles.listItem}>
            <ListItemText primary={`• ${item}`} />
          </ListItem>
        ))}
      </List>
    );
  }
  return (
    <Typography variant="body2" sx={styles.contentText}>
      {content}
    </Typography>
  );
});

export default PromotionContent;
