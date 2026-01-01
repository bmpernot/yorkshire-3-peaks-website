"use client";

import { Box, Paper, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Refresh } from "@mui/icons-material";
import generateColumns from "./Columns.mjs";
import { styles } from "../../styles/results.mui.styles.mjs";

function Entries({ entries, fetchEntries, selectedEvent }) {
  const columns = generateColumns(entries);
  const columnVisibilityModel = columns.reduce((model, column) => {
    const header = column.headerName;
    model[column.field] = !header.includes(" to ");
    return model;
  }, {});

  return (
    <Box sx={styles.entriesBox}>
      <Box display="flex" alignItems="center" maxWidth="90vw" maxHeight="70vh" overflow="auto">
        <Paper>
          <DataGrid
            id="entries-table"
            rows={entries}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
              columns: {
                columnVisibilityModel,
              },
            }}
            pageSizeOptions={entries.length > 5 ? [5, 10] : []}
            getRowId={(entry) => `team-id-${entry.teamId}`}
            sx={styles.dataGrid}
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
      >
        Refresh Entries
      </Button>
    </Box>
  );
}

export default Entries;
