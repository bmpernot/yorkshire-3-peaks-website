"use client";

import { useEffect, useState, useCallback } from "react";
import { get } from "aws-amplify/api";
import { Box, FormControl, InputLabel, MenuItem, Select, IconButton, Paper, Button } from "@mui/material";
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
              <MenuItem key={event.eventId} value={event.eventId} id={event.eventId}>
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
  return (
    <>
      <Box paddingTop="1rem" display="flex" alignItems="center" maxWidth="90vw" maxHeight="70vh" overflow="auto">
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
      >
        Refresh Entries
      </Button>
    </>
  );
}

function generateColumns(entries) {
  const keys = [...new Set(entries.flatMap((entry) => Object.keys(entry)))];
  const checkpoints = keys.filter((key) => key.startsWith("checkpoint")).sort();
  const columns = [
    { field: "teamName", headerName: "Team name", width: 200 },
    {
      field: "start",
      headerName: "Start",
      width: 120,
      valueGetter: (_, row) => {
        const date = new Date(row.start);
        return timeStamp(date);
      },
    },
    ...generateCheckpointColumnObjects({ checkpoints }),
    {
      field: "end",
      headerName: "End",
      width: 100,
      valueGetter: (_, row) => {
        const date = new Date(row.end);
        return timeStamp(date);
      },
    },
    {
      field: "time",
      headerName: "Time",
      width: 100,
      valueGetter: (_, row) => {
        const date = new Date(row.time);
        return timeStamp(date);
      },
    },
  ];
  return columns;
}

function generateCheckpointColumnObjects({ checkpoints }) {
  const columns = [];
  if (checkpoints.length === 0) {
    return columns;
  } else {
    columns.push({
      field: `start-to-${checkpoints[0]}`,
      headerName: `Start to Checkpoint ${checkpoints[0].split("checkpoint")[1]}`,
      width: 205,
      valueGetter: (_, row) => {
        const date = new Date(new Date(row[checkpoints[0]]).valueOf() - new Date(row.start).valueOf());
        return timeStamp(date);
      },
    });
  }

  for (let index = 0; index < checkpoints.length; index++) {
    columns.push({
      field: `${checkpoints[index]}`,
      headerName: `Checkpoint ${checkpoints[index].split("checkpoint")[1]}`,
      width: 160,
      valueGetter: (_, row) => {
        const date = new Date(row[checkpoints[index]]);
        return timeStamp(date);
      },
    });

    if (index === checkpoints.length - 1) {
      columns.push({
        field: `${checkpoints[index]}-to-end`,
        headerName: `Checkpoint ${checkpoints[index].split("checkpoint")[1]} to End`,
        width: 200,
        valueGetter: (_, row) => {
          const date = new Date(new Date(row.end).valueOf() - new Date(row[checkpoints[index]]).valueOf());
          return timeStamp(date);
        },
      });
    } else {
      columns.push({
        field: `${checkpoints[index]}-to-${checkpoints[index + 1]}`,
        headerName: `Checkpoint ${checkpoints[index].split("checkpoint")[1]} to Checkpoint ${checkpoints[index + 1].split("checkpoint")[1]}`,
        width: 230,
        valueGetter: (_, row) => {
          const date = new Date(
            new Date(row[checkpoints[index + 1]]).valueOf() - new Date(row[checkpoints[index]]).valueOf(),
          );
          return timeStamp(date);
        },
      });
    }
  }

  return columns;
}

function timeStamp(date) {
  let hours = date.getHours();
  if (Number.isNaN(hours)) {
    return "";
  } else {
    hours = String(hours).padStart(2, "0");
  }

  let minutes = date.getMinutes();
  if (Number.isNaN(minutes)) {
    return "";
  } else {
    minutes = String(minutes).padStart(2, "0");
  }

  let seconds = date.getSeconds();
  if (Number.isNaN(seconds)) {
    return "";
  } else {
    seconds = String(seconds).padStart(2, "0");
  }

  const timeStamp = `${hours}:${minutes}:${seconds}`;
  return timeStamp;
}

export default Results;
