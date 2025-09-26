import { memo } from "react";
import parse from "html-react-parser";
import { List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { FiberManualRecord, InfoOutlined } from "@mui/icons-material";
import { styles } from "../../styles/rules.mui.styles.mjs";

const Heading = memo(function HeadingComponent({ text, sx }) {
  return (
    <Typography variant="h6" sx={sx}>
      {text}
    </Typography>
  );
});

const TooltipIcon = memo(function TooltipIconComponent({ tooltip }) {
  return (
    <Tooltip title={tooltip} arrow>
      <InfoOutlined sx={styles.tooltipIcon} />
    </Tooltip>
  );
});

const BulletItem = memo(function BulletItemComponent({ content, tooltip, iconStyle }) {
  return (
    <ListItem disableGutters alignItems="flex-start">
      <ListItemIcon sx={iconStyle}>
        <FiberManualRecord sx={styles.listItemBulletIcon} />
      </ListItemIcon>
      <ListItemText
        sx={styles.listItemText}
        primary={
          <>
            {content}
            {tooltip && (
              <>
                <span>&nbsp;</span>
                <TooltipIcon tooltip={tooltip} />
              </>
            )}
          </>
        }
      />
    </ListItem>
  );
});

function BulletedList({ items, type = "rule" }) {
  const iconStyle = type === "equipment" ? styles.equipmentListItemIcon : styles.ruleListItemIcon;
  const headingStyle = type === "equipment" ? styles.perPersonTitle : undefined;

  return (
    <List dense disablePadding>
      {items.map((item, index) =>
        item.type === "heading" ? (
          <Heading key={index} text={item.text} sx={headingStyle} />
        ) : (
          <BulletItem
            key={index}
            content={item.primary || parse(item.text || "")}
            tooltip={item.tooltip}
            iconStyle={iconStyle}
          />
        ),
      )}
    </List>
  );
}

export default memo(BulletedList);
