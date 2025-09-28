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

// TODO - fix layout of page

function CurrentEvent() {
  const { user, loggedIn } = useUser();
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
        // TODO - make api
        // const { body } = await get({ apiName: "api", path: `events/information?eventId=${eventId}`, options: {} }).response;
        // const data = await body.json();
        const data = {
          requiredWalkers: 200,
          currentWalkers: 50,
          requiredVolunteers: 10,
          currentVolunteers: 2,
          moneyRaised: 1250,
          startDate: new Date("06/12/2026").toISOString(),
          endDate: new Date("06/14/2026").toISOString(),
          eventId: "3326b791-e01e-489d-a6dd-1ca5a807189b",
        };
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
  const router = useRouter();
  const isLoggedIn = loggedIn();

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
        <Grid2 item="true" xs={12} md={6}>
          <EventInformation eventInformation={eventInformation} />
        </Grid2>
        <Grid2 item="true" xs={12} md={6}>
          <EventSignUpForm eventId={eventInformation.eventId} router={router} isLoggedIn={isLoggedIn} />
        </Grid2>
        <Grid2 item="true" xs={12} md={6}>
          <VolunteeringSignUpForm
            eventInformation={eventInformation}
            router={router}
            userId={user.id}
            isLoggedIn={isLoggedIn}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default CurrentEvent;
