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

function EventSignUpForm({ eventId, router, isLoggedIn }) {
  const [formData, setFormData] = useState({
    teamName: "",
    members: [],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // TODO - input validation:
    // - make sure that there are at least 3 members on the team
    // - check that the person signing them up is a member
    // - check that the members of the group are not already apart of another team
    // TODO - test that the form adding and removing members works as expected

    try {
      // TODO - make api
      await post({
        apiName: "api",
        path: `events/register?eventId=${eventId}`,
        options: { body: { teamData: formData } },
      }).response;

      router.push(`/user/profile`);

      toast.success("Thank you for registering a team.");
    } catch (error) {
      toast.error("Failed to register team.");
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <StyledCard variant="outlined">
        <Typography variant="h4">Team Sign Up</Typography>
        <Typography variant="body1" sx={{ mb: 2 }} id="team-registration-information">
          • Teams must have <strong>3 - 5 members</strong>.<br />
          • Payment is managed on your profile page. Each member can contribute, but your team must meet or exceed the
          full amount.
          <br />
          • You can edit your team details anytime from your profile.
          <br />
          • All team members will have access to update the entry.
          <br />
        </Typography>
        {isLoggedIn ? (
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

            <TeamMemberSection
              teamMemberLabel={"Team leader"}
              formData={formData}
              setFormData={setFormData}
              membersIndex={0}
            />
            <TeamMemberSection
              teamMemberLabel={"Team member"}
              formData={formData}
              setFormData={setFormData}
              membersIndex={1}
            />
            <TeamMemberSection
              teamMemberLabel={"Team member"}
              formData={formData}
              setFormData={setFormData}
              membersIndex={2}
            />
            {formData.members.length >= 3 ? (
              <TeamMemberSection
                teamMemberLabel={"Team member"}
                formData={formData}
                setFormData={setFormData}
                membersIndex={3}
              />
            ) : null}
            {formData.members.length >= 4 ? (
              <TeamMemberSection
                teamMemberLabel={"Team member"}
                formData={formData}
                setFormData={setFormData}
                membersIndex={4}
              />
            ) : null}

            <Button type="submit" variant="contained" color="primary">
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

function TeamMemberSection({ teamMemberLabel, formData, setFormData, membersIndex }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchUserBase = useCallback(async (term) => {
    if (!term || term.trim() === "") {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);
      // TODO - update api
      const { body } = await get({ apiName: "api", path: `users?user=${searchTerm}`, options: {} }).response;
      const data = await body.json();

      setUsers(data);
    } catch (error) {
      toast.error(`Failed to look up user: ${searchTerm}`);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (searchTerm.trim().length >= 3) {
      const handler = setTimeout(() => {
        searchUserBase(searchTerm);
      }, 500);

      // TODO - make 1000 milliseconds and put in a waiting icon th show how long to wait before it searches

      return () => clearTimeout(handler);
    }
  }, [searchTerm, searchUserBase]);

  const updateMember = (index, updates) => {
    const updatedMembers = [...formData.members];

    if (!updatedMembers[index]) {
      updatedMembers[index] = { id: null, isVolunteer: false, additionalRequirements: "" };
    }

    updatedMembers[index] = { ...updatedMembers[index], ...updates };

    const { id, isVolunteer, additionalRequirements } = updatedMembers[index];
    const isEmpty = !id && !isVolunteer && (!additionalRequirements || additionalRequirements.trim() === "");

    if (isEmpty) {
      updatedMembers.splice(index, 1);
    }

    setFormData({ ...formData, members: updatedMembers });
  };

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>{teamMemberLabel}</FormLabel>
        <Autocomplete
          id={`team-members-${membersIndex}`}
          options={users}
          noOptionsText={searchTerm === "" ? "Search by name or email" : `No results`}
          getOptionLabel={(option) => (option ? `${option.firstName} ${option.lastName} (${option.email})` : "")}
          value={formData.members[membersIndex] || null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, value) =>
            updateMember(membersIndex, {
              id: value?.id || null,
              firstName: value?.firstName || "",
              lastName: value?.lastName || "",
              email: value?.email || "",
            })
          }
          renderInput={(params) => <TextField {...params} placeholder="Search by name or email" />}
          sx={{ flex: 1 }}
          inputValue={searchTerm}
          onInputChange={(_, newInputValue) => {
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
          />
        }
        label="Happy to volunteer if needed"
      />

      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <FormLabel htmlFor="requirements">Additional Requirements</FormLabel>
        <TextField
          id={`requirements-${membersIndex}`}
          name={`requirements-${membersIndex}`}
          multiline
          rows={3}
          placeholder="E.g. dietary needs, accessibility, medical info"
          value={formData.members[membersIndex]?.additionalRequirements || ""}
          onChange={(event) => updateMember(membersIndex, { additionalRequirements: event.target.value })}
        />
      </FormControl>
    </>
  );
}

export default EventSignUpForm;
