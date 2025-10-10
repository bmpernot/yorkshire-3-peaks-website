import { useState, useCallback, useEffect } from "react";
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
import { toast } from "react-toastify";
import { post, get } from "aws-amplify/api";
import ErrorCard from "../common/ErrorCard.mjs";

function EventSignUpForm({ eventId, router, isLoggedIn, user }) {
  const [formData, setFormData] = useState({
    teamName: "",
    members: [],
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsInFormData = validateFormData(formData, user);
    if (errorsInFormData.length > 0) {
      setErrors(errorsInFormData);
      return;
    }

    try {
      const { body } = await post({
        apiName: "api",
        path: `events/register?eventId=${eventId}`,
        options: { body: formData },
      }).response;
      const data = await body.text();

      toast.success(data);

      router.push(`/user/profile`);
    } catch (error) {
      toast.error("Failed to register team.");
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop={true}>
      <StyledCard variant="outlined" sx={{ height: "fit-content" }} noMaxWidth={true}>
        <Typography variant="h4" sx={{ color: "#8dc550", fontWeight: 600, mb: 2 }}>
          Team Registration
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }} id="team-registration-information">
          • Teams must have <strong>3 - 5 members</strong> and must include yourself.
          <br />
          • Payment is managed on your profile page. Each member can contribute, but your team must meet or exceed the
          full amount.
          <br />
          • You can edit your team details anytime from your profile.
          <br />
          • All team members will have access to update the entry.
          <br />
          • Disabled users in the user search are ones that have already signed up to a team.
          <br />
        </Typography>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            {errors.length > 0
              ? errors.map((error, index) => {
                  return <ErrorCard error={error} index={index} />;
                })
              : null}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Team Name</FormLabel>
              <TextField
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter your team name"
                variant="outlined"
                size="medium"
                required
              />
            </FormControl>

            <TeamMemberSection
              teamMemberLabel={"Team leader"}
              formData={formData}
              setFormData={setFormData}
              membersIndex={0}
              eventId={eventId}
            />
            <TeamMemberSection
              teamMemberLabel={"Team member"}
              formData={formData}
              setFormData={setFormData}
              membersIndex={1}
              eventId={eventId}
            />
            <TeamMemberSection
              teamMemberLabel={"Team member"}
              formData={formData}
              setFormData={setFormData}
              membersIndex={2}
              eventId={eventId}
            />
            {formData.members.length >= 3 ? (
              <TeamMemberSection
                teamMemberLabel={"Team member"}
                formData={formData}
                setFormData={setFormData}
                membersIndex={3}
                eventId={eventId}
              />
            ) : null}
            {formData.members.length >= 4 ? (
              <TeamMemberSection
                teamMemberLabel={"Team member"}
                formData={formData}
                setFormData={setFormData}
                membersIndex={4}
                eventId={eventId}
              />
            ) : null}

            <Button type="submit" variant="contained" color="primary" id="submit-team-button">
              Create Team
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => router.push("/auth/sign-in")}
            variant="contained"
            color="primary"
            id="event-team-registration-sign-in-button"
          >
            Sign in to register a team
          </Button>
        )}
      </StyledCard>
    </SignUpContainer>
  );
}

function TeamMemberSection({ teamMemberLabel, formData, setFormData, membersIndex, eventId }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userSearching, setUserSearching] = useState(false);

  const searchUserBase = useCallback(
    async (term) => {
      if (!term || term.trim() === "") {
        setUsers([]);
        return;
      }

      try {
        setIsLoading(true);
        const { body } = await get({ apiName: "api", path: `users?user=${term}&eventId=${eventId}`, options: {} })
          .response;
        const data = await body.json();

        setUsers(data);
      } catch (error) {
        toast.error(`Failed to look up user: ${term}`);
      } finally {
        setIsLoading(false);
      }
    },
    [eventId],
  );

  useEffect(() => {
    if (!userSearching || searchTerm.trim().length < 3) {
      return;
    }

    const handler = setTimeout(() => {
      searchUserBase(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, userSearching, searchUserBase]);

  const updateMember = (index, updates) => {
    const updatedMembers = [...formData.members];

    if (!updatedMembers[index]) {
      updatedMembers[index] = { sub: null, isVolunteer: false, additionalRequirements: "" };
    }

    updatedMembers[index] = { ...updatedMembers[index], ...updates };

    const { sub } = updatedMembers[index];

    if (!sub) {
      updatedMembers.splice(index, 1);
    }

    setFormData({ ...formData, members: updatedMembers });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: "text.primary",
          fontSize: { xs: "1rem", sm: "1.125rem" },
        }}
      >
        {teamMemberLabel}
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <Autocomplete
          id={`team-member-${membersIndex}`}
          options={users}
          noOptionsText={searchTerm === "" ? "Search by name or email" : `No results`}
          getOptionLabel={(option) => (option ? `${option.given_name} ${option.family_name} (${option.email})` : "")}
          getOptionDisabled={(option) => {
            if (option.alreadyParticipating) {
              return true;
            }
            const formDataMemberIds = formData.members.map((member) => member.sub);
            if (formDataMemberIds.includes(option.sub)) {
              return true;
            }
          }}
          value={formData.members[membersIndex] || null}
          isOptionEqualToValue={(option, value) => option.sub === value.sub}
          onChange={(_, value) => {
            setUserSearching(false);
            updateMember(membersIndex, {
              sub: value?.sub || null,
              given_name: value?.given_name || "",
              family_name: value?.family_name || "",
              email: value?.email || "",
            });
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Search by name or email" variant="outlined" size="medium" />
          )}
          inputValue={searchTerm}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === "input") {
              setUserSearching(true);
            }
            setSearchTerm(newInputValue);
          }}
          loading={isLoading}
          loadingText={`Searching for users: ${searchTerm}`}
        />
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.members[membersIndex]?.isVolunteer || false}
            onChange={(event) => updateMember(membersIndex, { isVolunteer: event.target.checked })}
            id={`team-member-happy-to-volunteer-${membersIndex}`}
            color="primary"
          />
        }
        label="Happy to volunteer if needed"
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth>
        <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Additional Requirements</FormLabel>
        <TextField
          id={`requirements-${membersIndex}`}
          name={`requirements-${membersIndex}`}
          multiline
          rows={3}
          placeholder="E.g. dietary needs, accessibility, medical info"
          value={formData.members[membersIndex]?.additionalRequirements || ""}
          onChange={(event) => updateMember(membersIndex, { additionalRequirements: event.target.value })}
          variant="outlined"
          size="medium"
        />
      </FormControl>
    </Box>
  );
}

function validateFormData(formData, user) {
  const messages = [];
  if (!formData.members.some((member) => member.sub === user.id)) {
    messages.push("You are required to be part of the team.");
  }

  if (formData.members.length < 3 || formData.members.length > 5) {
    messages.push("Teams must have 3 to 5 members.");
  }

  if (!formData.teamName.trim()) {
    messages.push("Team name is required.");
  }

  return messages;
}

export default EventSignUpForm;
