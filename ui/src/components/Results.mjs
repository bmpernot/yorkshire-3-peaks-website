"use client";

import { useEffect, useState, useCallback } from "react";
import { API } from "aws-amplify";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function Results() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [entriesCache, setEntriesCache] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await API.get("api", "/event", {});
        setEvents(data);

        if (data.length > 0) {
          // Preselect most recent event (assuming sorted latest first)
          setSelectedEventId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  // Fetch entries for selected event (with cache)
  const fetchEntries = useCallback(
    async (eventId) => {
      if (entriesCache[eventId]) {
        return;
      } // already cached

      setLoading(true);
      try {
        const data = await API.get("api", `/event/entries?eventId=${eventId}`, {});
        setEntriesCache((prev) => ({ ...prev, [eventId]: data }));
      } catch (err) {
        console.error("Failed to fetch entries", err);
      } finally {
        setLoading(false);
      }
    },
    [entriesCache],
  );

  // Fetch data for the preselected event
  useEffect(() => {
    if (selectedEventId) {
      fetchEntries(selectedEventId);
    }
  }, [selectedEventId, fetchEntries]);

  const entries = selectedEventId ? entriesCache[selectedEventId] || [] : [];

  return (
    <Box p={4}>
      <h1>Results</h1>

      <FormControl sx={{ minWidth: 200, mb: 3 }}>
        <InputLabel id="event-select-label">Select Event</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEventId || ""}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.year} - {event.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start</TableCell>
              <TableCell>Checkpoint 1</TableCell>
              <TableCell>Checkpoint 2</TableCell>
              <TableCell>Checkpoint 3</TableCell>
              <TableCell>Checkpoint X</TableCell>
              <TableCell>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.start || "-"}</TableCell>
                <TableCell>{row.checkpoint1 || "-"}</TableCell>
                <TableCell>{row.checkpoint2 || "-"}</TableCell>
                <TableCell>{row.checkpoint3 || "-"}</TableCell>
                <TableCell>{row.checkpointX || "-"}</TableCell>
                <TableCell>{row.end || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
export default Results;
