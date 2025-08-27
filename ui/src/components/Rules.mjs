import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import GroupsIcon from "@mui/icons-material/Groups";
import TimerIcon from "@mui/icons-material/Timer";
import EventIcon from "@mui/icons-material/Event";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BackpackIcon from "@mui/icons-material/Backpack";
import GavelIcon from "@mui/icons-material/Gavel";

const rulesData = [
  {
    id: "team",
    icon: <GroupsIcon />,
    title: "Team Composition",
    rules: [
      { text: "Teams must be a size of <strong>3-5 people</strong>." },
      {
        text: "Animals are welcome but must be kept <strong>on leads at all times</strong> and are the owner's responsibility.",
      },
      { text: "Anyone under 18 must have a <strong>legal guardian</strong> in their team." },
    ],
  },
  {
    id: "race",
    icon: <TimerIcon />,
    title: "Race",
    rules: [
      { text: "Each team is <strong>timed at each checkpoint</strong>." },
      { text: "The <strong>overall fastest team wins</strong>." },
      {
        text: "You must pass <strong>all checkpoints in order</strong> with all your members <strong>together</strong>.",
      },
    ],
  },
  {
    id: "event",
    icon: <EventIcon />,
    title: "Event",
    rules: [
      { text: "<strong>Registration:</strong> 06:00 to 07:30." },
      { text: "You will receive a <strong>coloured, numbered tally</strong> for identification." },
      { text: "<strong>Do not swap or lose</strong> your tally once issued." },
    ],
  },
  {
    id: "safety",
    icon: <HealthAndSafetyIcon />,
    title: "Safety & Retirements",
    rules: [
      { text: "<strong>No one</strong> may walk alone at any time." },
      {
        text: "If a member cannot continue, the team must help them to a retirement checkpoint (<strong>Ribblehead</strong> or <strong>Hill Inn</strong>).",
      },
      { text: "The team may continue only if <strong>at least 3 members remain</strong>." },
      {
        text: "Teams will be <strong>forced to retire</strong> if they don’t reach Ribblehead by <strong>12:30</strong> or Hill Inn by <strong>15:30</strong>.",
      },
    ],
  },
  {
    id: "conduct",
    icon: <AssignmentTurnedInIcon />,
    title: "Conduct",
    rules: [
      { text: "Follow the <strong>Countryside Code</strong> at all times." },
      { text: "Keep noise to an <strong>absolute minimum</strong> when passing through villages." },
    ],
  },
  {
    id: "equipment",
    icon: <BackpackIcon />,
    title: "Equipment",
    perPerson: [
      "Walking boots (running shoes allowed if running)",
      "Whistle",
      "Emergency rations",
      "500ml+ Bottle/Mug (must handle hot drinks)",
      "Rucksack",
      "Food for 12 hours",
      "Appropriate clothing (subject to inspection)",
    ],
    perTeam: ["1 First aid kit", "2 Ordnance Survey maps", "2 Compasses", "1 Survival bag (plastic or foil)"],
  },
  {
    id: "generic",
    icon: <GavelIcon />,
    title: "Generic Rules",
    rules: [
      { text: "All teams must <strong>pass equipment inspection</strong> before starting." },
      { text: "All participants take part <strong>at their own risk</strong>." },
      {
        text: "If you violate the rules, you will be <strong>forced to retire</strong>.",
        tooltip: "This ensures a fair and safe event for everyone involved.",
      },
    ],
  },
];

function Rules() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "text.primary",
        }}
      >
        Event Rules
      </Typography>

      {rulesData.map((section) => (
        <Accordion key={section.id} sx={{ "&:before": { display: "none" }, mb: 1.5, boxShadow: 3, borderRadius: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${section.id}-content`}
            id={`${section.id}-header`}
            sx={{
              "& .MuiAccordionSummary-content": { alignItems: "center", gap: 2 },
            }}
          >
            {section.icon}
            <Typography variant="h5">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: "action.hover" }}>
            {section.rules ? (
              <List disablePadding>
                {" "}
                {}
                {section.rules.map((rule, index) => (
                  <ListItem key={index} alignItems="flex-start" disableGutters>
                    {" "}
                    {}
                    <ListItemIcon
                      sx={{
                        minWidth: "auto",
                        mr: 1.5,
                        mt: "8px",
                      }}
                    >
                      <FiberManualRecordIcon sx={{ fontSize: "0.6rem" }} />
                    </ListItemIcon>
                    <ListItemText
                      sx={{ my: 0 }}
                      primary={
                        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                          <span dangerouslySetInnerHTML={{ __html: rule.text }} />
                          {rule.tooltip && (
                            <Tooltip title={rule.tooltip} arrow>
                              <InfoOutlinedIcon sx={{ ml: 1, fontSize: "1rem", color: "text.secondary" }} />
                            </Tooltip>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : null}

            {section.perPerson ? (
              <>
                <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                  Per Person
                </Typography>
                <List dense disablePadding>
                  {" "}
                  {}
                  {section.perPerson.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      {" "}
                      {}
                      <ListItemIcon sx={{ minWidth: "auto", mr: 1, display: "flex", alignItems: "center", mt: "2px" }}>
                        <FiberManualRecordIcon sx={{ fontSize: "0.6rem" }} />
                      </ListItemIcon>
                      <ListItemText primary={item} sx={{ my: 0 }} /> {}
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}

            {section.perTeam ? (
              <>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Per Team
                </Typography>
                <List dense disablePadding>
                  {" "}
                  {}
                  {section.perTeam.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      {" "}
                      {}
                      <ListItemIcon sx={{ minWidth: "auto", mr: 1, display: "flex", alignItems: "center", mt: "2px" }}>
                        <FiberManualRecordIcon sx={{ fontSize: "0.6rem" }} />
                      </ListItemIcon>
                      <ListItemText primary={item} sx={{ my: 0 }} /> {}
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box textAlign="center" mt={5}>
        <Button href="/documents/Yorkshire Three Peaks Rules.pdf" variant="contained" size="large">
          Download Rules PDF
        </Button>
      </Box>
    </Container>
  );
}

export default Rules;
