"use client";

import { Box, FormControl, InputLabel, MenuItem, Select, IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { styles } from "../../styles/results.mui.styles.mjs";

function Events({ events, selectedEvent, setSelectedEvent, fetchEvents }) {
  return (
    <Box paddingTop="1rem" display="flex" alignItems="center">
      <FormControl>
        <InputLabel id="demo-multiple-name-label">Event</InputLabel>
        <Select
          labelId="events-list-label"
          id="events-list"
          value={selectedEvent?.eventId}
          sx={styles.table}
          onChange={(event) => {
            setSelectedEvent(event.target.value);
          }}
        >
          {events.map((event) => {
            const date = new Date(event.startDate);
            return (
              <MenuItem key={event.eventId} value={event.eventId} id={event.eventId}>
                {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
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
      >
        <Refresh />
      </IconButton>
    </Box>
  );
}

export default Events;
