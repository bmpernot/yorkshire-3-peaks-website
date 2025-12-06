"use client";

import { styles } from "@/src/styles/profile.mui.styles.mjs";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Link } from "@mui/material";

function DeleteTeamDialog({ open, onClose, onConfirm, isLoading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle variant="h4" id="delete-team-title" fontWeight={600}>
        Delete Team
      </DialogTitle>

      <DialogContent>
        <Typography id="delete-team-warning" sx={styles.marginBottom2}>
          You are about to delete the team, please consider the following:
        </Typography>
        <Typography id="delete-team-warnings">
          - This action is permanent and cannot be undone.
          <br />- This action is performed for everyone in the team. <br /> - If anyone from the team would like a{" "}
          <Link
            component="a"
            href="mailto:yorkshirepeaks@gmail.com?subject=Refund"
            underline="hover"
            sx={styles.hyperlink}
          >
            refund
          </Link>{" "}
          for any donations made as part of this team please do so before deleting the team.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} loading={isLoading} id="confirm-delete-team">
          Delete Team
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteTeamDialog;
