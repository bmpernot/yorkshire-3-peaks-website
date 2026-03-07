"use client";

import { Container, Typography, Stack, Box, Divider } from "@mui/material";
import BulletedList from "../common/BulletedList.jsx";

function RegistrationGuide() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={5}>
        <Typography variant="h2">Registration Guide</Typography>
        <Box>
          <Typography variant="h4" gutterBottom>
            Registering Your Team
          </Typography>

          <Box>
            <BulletedList
              items={[
                {
                  text: "To participate in the event, teams must meet the following requirements:",
                  type: "heading",
                },

                { text: "The team must have a <strong>team name.</strong>" },
                { text: "Teams must contain <strong>between 3 and 5 members</strong> and must include yourself." },
                {
                  text: "Every <strong>participant</strong> must have <strong>an account.</strong>",
                },
              ]}
            />

            <br />

            <BulletedList
              items={[
                {
                  text: "Members search:",
                  type: "heading",
                },
                {
                  text: "When creating a team, you can <strong>search for members</strong> using their <strong>name or email</strong>.",
                },
                {
                  text: "Only <strong>registered members</strong> can be <strong>searched for.</strong> This is so that we have emergency contact information for all participants in the event.",
                },
                {
                  text: "If a person appears in the search results but is <strong>greyed out</strong>, it means they are already <strong>part of another team</strong> and cannot be selected.",
                },
                {
                  text: "During registration you can <strong>optionally</strong> add <strong>additional information</strong> and indicate whether each memberof the team is <strong>willing to volunteer</strong> if there are not enough volunteers.",
                },
              ]}
            />
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h4" gutterBottom>
            After Your Team Is Registered
          </Typography>

          <BulletedList
            items={[
              {
                text: "Once your team has been created, you can manage it through your account page.",
                type: "heading",
              },
              {
                text: "From there you can:",
                type: "heading",
              },
              { text: "<strong>Pay</strong> for the team." },
              { text: "<strong>Update</strong> team and member information." },
              { text: "<strong>Add or remove*</strong> members." },
              { text: "<strong>Delete*</strong> the team." },
            ]}
          />
          <br />
          <BulletedList
            items={[
              {
                text: "Paying for the Team.",
                type: "heading",
              },
              { text: "<strong>All members</strong> can pay towards the <strong>team's event fee.</strong>" },
              {
                text: "Each <strong>member</strong> may <strong>specify the amount</strong> they would like to contribute then they will go to a page to <strong>pay</strong> for the amount they specified.",
              },
              {
                text: "Members can pay for their portion or donate more if they would like.",
              },
              {
                text: "The team will <strong>not be allowed</strong> to participate in the event <strong>until the full amount</strong> has been <strong>paid</strong> for.",
              },
            ]}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="h4" gutterBottom>
            *Important: Refunds
          </Typography>

          <Typography variant="h6" gutterBottom>
            If a member would like a refund for donations or payments they have made, they should contact the
            administrators <strong>before they are removed from the team or team is deleted</strong>. Once a member has
            been removed, refund requests may become significantly more difficult to process.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}

export default RegistrationGuide;
