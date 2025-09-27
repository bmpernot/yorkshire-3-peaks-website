"use client";

import { useEffect, useState, useCallback } from "react";
import { get } from "aws-amplify/api";
import { Box } from "@mui/material";
import Loading from "../common/Loading.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import Entries from "./Entries.mjs";
import Events from "./Events.mjs";

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

export default Results;
