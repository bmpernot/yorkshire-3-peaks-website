"use client";

import { useEffect, useState, useCallback } from "react";
import { get } from "aws-amplify/api";
import { Box, FormControl, InputLabel, MenuItem, Select, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Refresh } from "@mui/icons-material";
import Loading from "./common/Loading.mjs";
import ErrorCard from "./common/ErrorCard.mjs";

function Results() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [entriesCache, setEntriesCache] = useState({});
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [error, setError] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingMessage("Getting events");

      const { body } = await get({ apiName: "api", path: "events", options: {} }).response;
      const data = await body.json();
      data.sort((a, b) => {
        return new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf();
      });
      setEvents(data);

      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError({ location: "Page", message: "Failed to get events" });
      setLoadingMessage(false);
    }
  }, []);

  const fetchEntries = useCallback(
    async ({ selectedEvent, forceRefresh = false }) => {
      const { eventId, startDate } = selectedEvent;
      if (!forceRefresh && entriesCache[eventId]) {
        setLoadingMessage(false);
        return;
      }

      const date = new Date(startDate);

      setLoadingMessage(`Getting entries for ${date.getDate()}/${date.getMonth()}${date.getFullYear()}`);
      try {
        const { body } = await get({ apiName: "api", path: `events/entries?eventId=${eventId}`, options: {} }).response;
        const data = await body.json();
        data.forEach((entry) => {
          if (entry.start && entry.end) {
            entry.time = new Date(entry.end).valueOf() - new Date(entry.start).valueOf();
          }
        });
        data.sort((a, b) => {
          const aTime = a.time || 9999999999;
          const bTime = b.time || 9999999999;
          return aTime - bTime;
        });
        setEntriesCache((prev) => ({ ...prev, [eventId]: data }));
      } catch (err) {
        console.error("Failed to fetch entries", err);
        setError({ location: "Table", message: "Failed to get event data" });
      } finally {
        setLoadingMessage(false);
      }
    },
    [entriesCache],
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEntries({ selectedEvent });
    }
  }, [selectedEvent]);

  const entries = selectedEvent ? entriesCache[selectedEvent.eventId] || [] : [];

  if (loadingMessage) {
    return <Loading message={loadingMessage} />;
  }

  if (error && error.location === "Page") {
    return <ErrorCard error={error.message} />;
  }

  return (
    <Box display="grid" alignContent="left">
      <h1 className="page-title">Results</h1>
      <Events
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        fetchEvents={fetchEvents}
      />
      <Entries entries={entries} fetchEntries={fetchEntries} selectedEvent={selectedEvent} />
    </Box>
  );
}

function Events({ events, selectedEvent, setSelectedEvent, fetchEvents }) {
  return (
    <Box paddingTop="1rem" display="flex" alignItems="center">
      <FormControl>
        <InputLabel id="demo-multiple-name-label">Event</InputLabel>
        <Select
          labelId="events-list-label"
          id="events-list"
          value={selectedEvent?.eventId}
          sx={{ minWidth: "150px" }}
          onChange={(event) => {
            setSelectedEvent(event.target.value);
          }}
        >
          {events.map((event) => {
            const date = new Date(event.startDate);
            return (
              <MenuItem key={event.eventId} value={event.eventId}>
                {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
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

function Entries({ entries, fetchEntries, selectedEvent }) {
  console.log("entries", entries);
  console.log("stuff", generateColumns(entries));

  return (
    <Box paddingTop="1rem" display="flex" alignItems="center">
      <Paper>
        <DataGrid
          rows={entries}
          columns={[]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={entries.length > 5 ? [5, 10] : []}
          getRowId={(entry) => entry.teamId}
        />
      </Paper>
      <IconButton
        id="refresh-events"
        onClick={() => {
          fetchEntries({ selectedEvent, forceRefresh: true });
        }}
      >
        <Refresh />
      </IconButton>
    </Box>
  );
}

// TODO - need to finish this
// TODO - auto generate the columns out of the unique keys from the entries then sprit out the data we know we dont want and create new data of the diffs between each checkpoint but make it hidden column

function generateColumns(entries) {
  const keys = [...new Set(entries.flatMap((entry) => Object.keys(entry)))];
  const numberOfCheckpoint = keys.filter((key) => key.startsWith("checkpoint")).length;
  const columns = [
    { field: "teamName", headerName: "Team name" },
    { field: "start", headerName: "Start" },
    ...generateCheckpointColumnObjects({ numberOfCheckpoint }),
    { field: "end", headerName: "End" },
    { field: "time", headerName: "Time" },
  ];
  return columns;
}

function generateCheckpointColumnObjects({ numberOfCheckpoint }) {
  const columns = [];

  columns.push({});
  for (let index = 0; index < numberOfCheckpoint; index++) {
    columns.push({});
    columns.push({});
  }
}

export default Results;
