"use client";

import { useEffect, useState, useCallback } from "react";
import { get } from "aws-amplify/api";
// import {
//   Box,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@mui/material";
import Loading from "./common/Loading.mjs";
import ErrorCard from "./common/ErrorCard.mjs";

function Results() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEventId] = useState(null);
  const [entriesCache, setEntriesCache] = useState({});
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [error, setError] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingMessage("Getting events");

      const { body } = await get({ apiName: "api", path: "/event", options: {} }).response;
      const data = await body.json();
      setEvents(data);

      if (data.length > 0 && !selectedEvent) {
        // TODO - sort data and grab the latest event
        setSelectedEventId(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError({ location: "Page", message: "Failed to get events" });
      setLoadingMessage(false);
    }
  }, []);

  const fetchEntries = useCallback(
    async (selectedEvent) => {
      const { id: eventId, startDate } = selectedEvent;
      if (entriesCache[eventId]) {
        return;
      }

      setLoadingMessage(`Getting entries for ${new Date(startDate).getFullYear()}`);
      try {
        const { body } = await get({ apiName: "api", path: `/event/entries?eventId=${eventId}`, options: {} }).response;
        const data = await body.json();
        // TODO - sort entries based on time finished
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
      fetchEntries(selectedEvent);
    }
  }, [selectedEvent, fetchEntries]);

  const entries = selectedEvent ? entriesCache[selectedEvent] || [] : [];

  console.log("events", events);
  console.log("entries", entries);

  if (loadingMessage) {
    return <Loading message={loadingMessage} />;
  }

  if (error && error.location === "Page") {
    return <ErrorCard error={error.message} />;
  }

  // return (
  //   <Box p={4}>
  //     <h1>Results</h1>

  //     <FormControl sx={{ minWidth: 200, mb: 3 }}>
  //       <InputLabel id="event-select-label">Select Event</InputLabel>
  //       <Select
  //         labelId="event-select-label"
  //         value={selectedEvent || ""}
  //         onChange={(e) => setSelectedEventId(e.target.value)}
  //       >
  //         {events.map((event) => (
  //           <MenuItem key={event.id} value={event.id}>
  //             {event.year} - {event.name}
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </FormControl>
  //      {error && error.location === "Table" ? (<ErrorCard error={error.message}/>) : (
  //     <Table>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell>Start</TableCell>
  //           <TableCell>Checkpoint 1</TableCell>
  //           <TableCell>Checkpoint 2</TableCell>
  //           <TableCell>Checkpoint 3</TableCell>
  //           <TableCell>Checkpoint X</TableCell>
  //           <TableCell>End</TableCell>
  //         </TableRow>
  //       </TableHead>
  //       <TableBody>
  //         {entries.map((row, i) => (
  //           <TableRow key={i}>
  //             <TableCell>{row.start || "-"}</TableCell>
  //             <TableCell>{row.checkpoint1 || "-"}</TableCell>
  //             <TableCell>{row.checkpoint2 || "-"}</TableCell>
  //             <TableCell>{row.checkpoint3 || "-"}</TableCell>
  //             <TableCell>{row.checkpointX || "-"}</TableCell>
  //             <TableCell>{row.end || "-"}</TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>
  //    )}
  //   </Box>
  // );
}
export default Results;
