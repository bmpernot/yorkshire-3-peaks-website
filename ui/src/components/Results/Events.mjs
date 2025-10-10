"use client";

import { Box, FormControl, InputLabel, MenuItem, Select, IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { styles } from "../../styles/results.mui.styles.mjs";

function Events({ events, selectedEvent, setSelectedEvent, fetchEvents }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: { xs: "wrap", sm: "nowrap" },
        p: { xs: 2, sm: 3 },
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
        <InputLabel id="events-list-label" sx={{ fontWeight: 500 }}>
          Select Event
        </InputLabel>
        <Select
          labelId="events-list-label"
          id="events-list"
          value={selectedEvent}
          label="Select Event"
          onChange={(event) => {
            setSelectedEvent(event.target.value);
          }}
          size="medium"
        >
          {events.map((event) => {
            const date = new Date(event.startDate);
            return (
              <MenuItem key={event.eventId} value={event} id={event.eventId}>
                {date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <IconButton
        id="refresh-events"
        onClick={() => {
          fetchEvents();
        }}
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          p: 1.5,
        }}
        size="large"
      >
        <Refresh />
      </IconButton>
    </Box>
  );
}

export default Events;
