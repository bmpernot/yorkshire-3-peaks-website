"use client";

import { useEffect, useState, useCallback } from "react";
import { get } from "aws-amplify/api";
import { Typography, Grid2, Box } from "@mui/material";
import EventInformation from "./EventInformation.mjs";
import EventSignUpForm from "./EventSignUpForm.mjs";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import Events from "../Results/Events.mjs";
import Loading from "../common/Loading.mjs";
import ErrorCard from "../common/ErrorCard.mjs";

function CurrentEvent() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventInformationCache, setEventInformationCache] = useState({});
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [error, setError] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoadingMessage("Getting events");

      const { body } = await get({ apiName: "api", path: "events", options: {} }).response;
      const data = await body.json();

      const futureEvents = data
        .filter((event) => {
          return new Date(event.startDate).valueOf() > Date.now();
        })
        .sort((a, b) => {
          return new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf();
        });

      setEvents(futureEvents);

      if (futureEvents.length > 0 && !selectedEvent) {
        setSelectedEvent(futureEvents[0]);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setError({ message: "Failed to get events" });
      setLoadingMessage(false);
    }
  }, []);

  const fetchEventData = useCallback(
    async ({ selectedEvent, forceRefresh = false }) => {
      const { eventId, startDate } = selectedEvent;
      if (!forceRefresh && eventInformationCache[eventId]) {
        setLoadingMessage(false);
        return;
      }

      const date = new Date(startDate);

      setLoadingMessage(`Getting information for ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
      try {
        // TODO - make api call
        // const { body } = await get({ apiName: "api", path: `events/information?eventId=${eventId}`, options: {} }).response;
        // const data = await body.json();
        const data = {};
        setEventInformationCache((prev) => ({ ...prev, [eventId]: data }));
      } catch (error) {
        console.error("Failed to fetch entries", error);
        setError({ message: "Failed to get event entries" });
      } finally {
        setLoadingMessage(false);
      }
    },
    [eventInformationCache],
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventData({ selectedEvent });
    }
  }, [selectedEvent]);

  const eventInformation = selectedEvent ? eventInformationCache[selectedEvent.eventId] || [] : [];

  if (loadingMessage) {
    return <Loading message={loadingMessage} />;
  }

  if (error) {
    return <ErrorCard error={error.message} />;
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" align="left" sx={styles.mainTitle}>
        Current Events
      </Typography>
      <Events
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        fetchEvents={fetchEvents}
      />
      <Grid2 container={true}>
        <Grid2 xs={12} md={6}>
          <EventInformation eventInformation={eventInformation} />
        </Grid2>
        <Grid2 xs={12} md={6}>
          <EventSignUpForm eventId={eventInformation} />
        </Grid2>
        {/* TODO - might be its own ticket - need to make a volunteers sign up form */}
      </Grid2>
    </Box>
  );
}

export default CurrentEvent;
