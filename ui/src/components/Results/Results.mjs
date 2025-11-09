"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "../common/Loading.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import Entries from "./Entries.mjs";
import Events from "./Events.mjs";
import { styles } from "@/src/styles/results.mui.styles.mjs";
import { getEntries, getEvents } from "@/src/lib/backendActions.mjs";

function Results() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [entriesCache, setEntriesCache] = useState({});
  const [loadingMessage, setLoadingMessage] = useState("Getting events");
  const [error, setError] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingMessage("Getting events");

      const data = await getEvents();

      const previousEvents = data
        .filter((event) => {
          return new Date(event.startDate).valueOf() < Date.now();
        })
        .sort((a, b) => {
          return new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf();
        });

      setEvents(previousEvents);

      if (previousEvents.length > 0 && !selectedEvent) {
        setSelectedEvent(previousEvents[0]);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError({ message: "Failed to get events" });
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

      setLoadingMessage(`Getting entries for ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
      try {
        const data = await getEntries({ eventId });
        const filteredData = data.filter((entry) => !entry.volunteer);
        filteredData.forEach((entry) => {
          if (entry.start && entry.end) {
            entry.time = new Date(entry.end).valueOf() - new Date(entry.start).valueOf();
          }
        });
        filteredData.sort((a, b) => {
          const aTime = a.time || 9999999999;
          const bTime = b.time || 9999999999;
          return aTime - bTime;
        });
        setEntriesCache((prev) => ({ ...prev, [eventId]: filteredData }));
      } catch (err) {
        console.error("Failed to fetch entries", err);
        setError({ message: "Failed to get event entries" });
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

  if (error) {
    return <ErrorCard error={error.message} />;
  }

  return (
    <Box display="grid" alignContent="left">
      <Typography variant="h3" component="h1" align="left" sx={styles.mainTitle}>
        Results
      </Typography>
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

export default Results;
