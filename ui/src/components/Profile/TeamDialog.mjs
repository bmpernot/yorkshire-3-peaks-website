"use client";

import { Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import Payment from "./Payment.mjs";
import TeamInformation from "./TeamInformation.mjs";

function TeamDialog({ open, onClose, team, setTeams }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle variant="h4" sx={styles.mainTitle}>
        {team.teamName}
      </DialogTitle>

      <DialogContent>
        <Payment teamId={team.teamId} eventId={team.eventId} cost={team.cost} paid={team.paid} />
        <Divider sx={styles.divider} />
        <TeamInformation team={team} setTeams={setTeams} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default TeamDialog;
