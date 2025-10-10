"use client";

import { Box, Paper, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Refresh } from "@mui/icons-material";
import generateColumns from "./Columns.mjs";

function Entries({ entries, fetchEntries, selectedEvent }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 2, sm: 3 },
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ maxWidth: "100%", maxHeight: "70vh", overflow: "auto" }}>
        <Paper>
          <DataGrid
            id="entries-table"
            rows={entries}
            columns={generateColumns(entries)}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
            pageSizeOptions={entries.length > 5 ? [5, 10] : []}
            getRowId={(entry) => `team-id-${entry.teamId}`}
          />
        </Paper>
      </Box>
      <Button
        id="refresh-entries"
        variant="contained"
        endIcon={<Refresh />}
        onClick={() => {
          fetchEntries({ selectedEvent, forceRefresh: true });
        }}
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          alignSelf: "flex-start"
        }}
      >
        Refresh Entries
      </Button>
    </Box>
  );
}

export default Entries;
