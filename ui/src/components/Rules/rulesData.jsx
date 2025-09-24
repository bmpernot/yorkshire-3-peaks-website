import { Box, Typography } from "@mui/material";
import { AssignmentTurnedIn, Backpack, Event, Gavel, Groups, HealthAndSafety, Timer } from "@mui/icons-material";
import { styles } from "../../styles/rules.mui.styles.mjs";

const COUNTRYSIDE_CODE_URL =
  "https://www.gov.uk/government/publications/the-countryside-code/the-countryside-code-advice-for-countryside-visitors";

const RetirementCheckpoints = () => (
  <>
    If a team member cannot continue, the team must escort them to a retirement checkpoint: either&nbsp;
    <Typography component="span" sx={styles.checkpointSpan}>
      <strong>Ribblehead</strong>&nbsp;(before the second peak)
    </Typography>
    &nbsp;or&nbsp;
    <Typography component="span" sx={styles.checkpointSpan}>
      <strong>Hill Inn</strong>&nbsp;(after the second peak).
    </Typography>
  </>
);

const WeatherClothing = () => (
  <>
    Appropriate clothing for all weather conditions (subject to inspection):
    <Box component="div" sx={styles.weatherClothingBox}>
      <strong>Hot weather:</strong> Sun hat, T-shirt, Shorts
    </Box>
    <Box component="div" sx={styles.weatherClothingBox}>
      <strong>Cold/Wet weather:</strong> Waterproof jacket, warm hooded jumper, trousers, waterproof trousers
    </Box>
  </>
);

export const rulesData = Object.freeze([
  {
    id: "team",
    icon: <Groups />,
    title: "Team Composition",
    items: [
      { text: "Teams must consist of&nbsp;<strong>3-5 people</strong>." },
      {
        text: "Animals are welcome but are the&nbsp;<strong>sole responsibility of the owner</strong>&nbsp;and must be kept on a lead at all times.",
      },
      { text: "Any team member under 18 must have a&nbsp;<strong>legal guardian</strong>&nbsp;in their team." },
    ],
  },
  {
    id: "race",
    icon: <Timer />,
    title: "Race",
    items: [
      { text: "Each team is&nbsp;<strong>timed at each checkpoint</strong>." },
      { text: "The&nbsp;<strong>overall fastest team wins</strong>." },
      {
        text: "You must pass all checkpoints&nbsp;<strong>in order</strong>, with all your team members present&nbsp;<strong>at once</strong>.",
      },
    ],
  },
  {
    id: "event",
    icon: <Event />,
    title: "Event",
    items: [
      { text: "<strong>Registration is open from 06:00 to 07:30</strong>." },
      {
        text: "You will receive a&nbsp;<strong>coloured, numbered tally</strong>&nbsp;for identification purposes.",
      },
      {
        text: "Once issued, your tally must be clearly displayed and must&nbsp;<strong>not be swapped or lost</strong>.",
      },
    ],
  },
  {
    id: "safety",
    icon: <HealthAndSafety />,
    title: "Safety & Retirements",
    items: [
      { text: "<strong>No team member can be left to walk alone</strong>&nbsp;at any time." },
      { primary: <RetirementCheckpoints /> },
      {
        text: "A team can only continue if it&nbsp;<strong>still has at least 3 members</strong>&nbsp;after a retirement.",
      },
      {
        text: "Teams will be&nbsp;<strong>forced to retire</strong>&nbsp;if they don't reach the cutoff times: Ribblehead by&nbsp;<strong>12:30</strong>&nbsp;or Hill Inn by&nbsp;<strong>15:30</strong>.",
      },
      {
        text: "With organiser approval, members from different retiring teams may form a&nbsp;<strong>makeshift team</strong>&nbsp;to continue.",
      },
      {
        text: "All retirees will receive&nbsp;<strong>provided transportation</strong>&nbsp;back to the event headquarters.",
      },
    ],
  },
  {
    id: "conduct",
    icon: <AssignmentTurnedIn />,
    title: "Conduct",
    items: [
      {
        text: `You must follow the&nbsp;<strong><a href='${COUNTRYSIDE_CODE_URL}' target='_blank' rel='noopener noreferrer'>Countryside Code</a></strong>&nbsp;at all times.`,
      },
      {
        text: "Keep noise to an&nbsp;<strong>absolute minimum</strong>&nbsp;when walking through villages to avoid disturbing residents.",
      },
    ],
  },
  {
    id: "equipment",
    icon: <Backpack />,
    title: "Equipment",
    type: "equipment",
    items: [
      { type: "heading", text: "Per Person" },
      { text: "Walking boots (running shoes are permitted if you are running the route)" },
      { text: "Whistle" },
      { text: "Emergency rations" },
      { text: "A bottle or mug (minimum 500ml) capable of holding hot drinks" },
      { text: "Rucksack" },
      { text: "Food for 12 hours" },
      { primary: <WeatherClothing /> },
      { type: "heading", text: "Per Team" },
      { text: "1 First aid kit" },
      { text: "2 Ordnance Survey maps" },
      { text: "2 Compasses" },
      { text: "1 Survival bag (large plastic or foil type)" },
    ],
  },
  {
    id: "generic",
    icon: <Gavel />,
    title: "Generic Rules",
    items: [
      { text: "All teams must&nbsp;<strong>pass an equipment inspection</strong>&nbsp;before starting." },
      { text: "All participants take part in this event&nbsp;<strong>at their own risk</strong>." },
      { text: "Organisers reserve the right to&nbsp;<strong>change the rules</strong>&nbsp;with due notice." },
      {
        text: "If you violate these rules, your team will be&nbsp;<strong>forced to retire</strong>&nbsp;from the event.",
        tooltip: "This ensures a fair and safe event for everyone involved.",
      },
    ],
  },
]);
