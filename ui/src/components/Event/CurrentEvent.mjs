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
import VolunteeringSignUpForm from "./VolunteerSignUpForm.mjs";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/utils/userContext";
import NoEvents from "./NoEvents.mjs";

function CurrentEvent() {
  const router = useRouter();

  const { user, loggedIn } = useUser();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventInformationCache, setEventInformationCache] = useState({});
  const [loadingMessage, setLoadingMessage] = useState("Getting events");
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
          return new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf();
        });

      setEvents(futureEvents);

      if (futureEvents.length > 0 && !selectedEvent) {
        setSelectedEvent(futureEvents[0]);
      } else {
        setLoadingMessage(false);
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
        const { body } = await get({ apiName: "api", path: `events/information?eventId=${eventId}`, options: {} })
          .response;
        const data = await body.json();
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

  if (loadingMessage) {
    return <Loading message={loadingMessage} />;
  }

  if (error) {
    return <ErrorCard error={error.message} />;
  }

  const eventInformation = selectedEvent ? eventInformationCache[selectedEvent.eventId] || [] : [];
  const isLoggedIn = loggedIn();

  return (
    <Box sx={{ maxWidth: "1200px" }}>
      <Typography variant="h3" component="h1" sx={styles.mainTitle}>
        Current Events
      </Typography>

      <Events
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        fetchEvents={fetchEvents}
      />

      {events.length === 0 ? (
        <NoEvents />
      ) : (
        <Grid2 container={true} spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid2 size={12}>
            <EventInformation eventInformation={eventInformation} />
          </Grid2>
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <EventSignUpForm eventId={eventInformation.eventId} router={router} isLoggedIn={isLoggedIn} user={user} />
          </Grid2>
          <Grid2 size={{ xs: 12, lg: 6 }}>
            <VolunteeringSignUpForm
              eventId={eventInformation.eventId}
              router={router}
              userId={user.id}
              isLoggedIn={isLoggedIn}
            />
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
}

export default CurrentEvent;
