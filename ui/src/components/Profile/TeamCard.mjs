"use client";

import { useState } from "react";
import { Card, CardActionArea, CardContent, Typography, Box, Chip, Stack, LinearProgress } from "@mui/material";
import TeamDialog from "./TeamDialog.mjs";
import { styles } from "@/src/styles/profile.mui.styles.mjs";

export default function TeamCard({ team, setTeams }) {
  const [open, setOpen] = useState(false);

  const memberCount = team.members?.length ?? 0;
  const amountRemaining = team.cost - team.paid;
  const progress = (team.paid / team.cost) * 100;

  const eventStart = new Date(team.startDate);
  const eventEnd = new Date(team.endDate);

  return (
    <>
      <Card id={`entry-card-${team.teamId}`} sx={styles.card}>
        <CardActionArea onClick={() => setOpen(true)} sx={styles.cardActionArea}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} id="card-title">
              {team.teamName}
            </Typography>

            <Stack direction="row" spacing={1} sx={styles.marginTop}>
              <Chip label={`${memberCount} members`} variant="outlined" size="small" id="card-members" />
              <Chip
                label={amountRemaining <= 0 ? "Fully Paid" : `£${amountRemaining} Left`}
                color={amountRemaining <= 0 ? "success" : "warning"}
                size="small"
                id="card-paid"
              />
            </Stack>

            <Box sx={styles.marginTop2}>
              <LinearProgress variant="determinate" value={progress} sx={styles.lineBar} />
              <Typography variant="caption" sx={styles.cardPaidAmount} id="card-paid-amount">
                £{team.paid} / £{team.cost} paid
              </Typography>
            </Box>

            <Typography variant="body2" sx={styles.marginTop2} id="card-event-date">
              {eventStart.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} →{" "}
              {eventEnd.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <TeamDialog open={open} onClose={() => setOpen(false)} team={team} setTeams={setTeams} />
    </>
  );
}
