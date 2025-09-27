import { useState } from "react";
import {
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Autocomplete,
  Button,
  Box,
  Checkbox,
} from "@mui/material";
import { StyledCard, StyledContainer as SignUpContainer } from "../common/CustomComponents.mjs";

const users = [
  { label: "Ben Pernot", email: "benjamin.pernot195@gmail.com" },
  { label: "Jane Doe", email: "jane@example.com" },
  { label: "John Smith", email: "john@example.com" },
];

// TODO - create USER search
// TODO - finish making the form properly
// TODO - fix the layout
// TODO - make it easier to use (information icons, ghost entries so it doesn't go off the screen)

function EventSignUpForm({ eventId }) {
  const [formData, setFormData] = useState({
    teamName: "",
    members: [],
    isVolunteer: false,
    requirements: "",
  });

  console.log("eventId", eventId);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting form", formData);
    // TODO - create TEAM via api (team entry and member entries) and move them to the thank you for registering page
    // TODO - create a thank you for registering page and say payment is still a work in progress as the bank account is still being set up
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <Typography variant="h4">Team Sign-Up</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel htmlFor="teamName">Team Name</FormLabel>
            <TextField
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              placeholder="Enter your team name"
            />
          </FormControl>

          <TeamMemberSection teamMemberLabel={"Team leader"} formData={formData} setFormData={setFormData} />
          <TeamMemberSection teamMemberLabel={"Team member"} formData={formData} setFormData={setFormData} />
          <TeamMemberSection teamMemberLabel={"Team member"} formData={formData} setFormData={setFormData} />
          <TeamMemberSection teamMemberLabel={"Team member"} formData={formData} setFormData={setFormData} />
          <TeamMemberSection teamMemberLabel={"Team member"} formData={formData} setFormData={setFormData} />

          <Button type="submit" variant="contained" color="primary">
            Create Team
          </Button>
        </Box>
      </StyledCard>
    </SignUpContainer>
  );
}

function TeamMemberSection({ teamMemberLabel, formData, setFormData }) {
  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>{teamMemberLabel}</FormLabel>
        <Autocomplete
          multiple
          id="team-members"
          options={users}
          getOptionLabel={(option) => (option.label ? `${option.label} (${option.email})` : "")}
          value={formData.members}
          onChange={(_, value) => setFormData({ ...formData, members: value })}
          renderInput={(params) => <TextField {...params} placeholder="Search by name or email" />}
        />
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isVolunteer}
            onChange={(e) => setFormData({ ...formData, isVolunteer: e.target.checked })}
          />
        }
        label="Happy to volunteer if needed"
      />

      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <FormLabel htmlFor="requirements">Additional Requirements</FormLabel>
        <TextField
          id="requirements"
          name="requirements"
          multiline
          rows={3}
          placeholder="E.g. dietary needs, accessibility, medical info"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
        />
      </FormControl>
    </>
  );
}

export default EventSignUpForm;
