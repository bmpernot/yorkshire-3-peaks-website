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
import ErrorCard from "../common/ErrorCard.mjs";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import { getUsers, registerTeam } from "@/src/lib/backendActions.mjs";

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
      await registerTeam({ eventId, formData });

      toast.success("Successfully registered team");

      router.push(`/user/profile`);
    } catch {
      toast.error("Failed to register team.");
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between" paddingTop="true">
      <StyledCard variant="outlined" sx={styles.card} nomaxwidth="true">
        <Typography variant="h4" sx={styles.title}>
          Team Registration
        </Typography>
        <Box sx={styles.box}>
          <Typography variant="body1" sx={styles.description} id="team-registration-information">
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
        </Box>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            {errors.length > 0
              ? errors.map((error, index) => {
                  return <ErrorCard error={error} index={index} />;
                })
              : null}
            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Team Name</FormLabel>
              <TextField
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter your team name"
                variant="outlined"
                size="medium"
              />
            </FormControl>

            <TeamMemberSection formData={formData} setFormData={setFormData} membersIndex={0} eventId={eventId} />
            <TeamMemberSection formData={formData} setFormData={setFormData} membersIndex={1} eventId={eventId} />
            <TeamMemberSection formData={formData} setFormData={setFormData} membersIndex={2} eventId={eventId} />
            {formData.members.length >= 3 ? (
              <TeamMemberSection formData={formData} setFormData={setFormData} membersIndex={3} eventId={eventId} />
            ) : null}
            {formData.members.length >= 4 ? (
              <TeamMemberSection formData={formData} setFormData={setFormData} membersIndex={4} eventId={eventId} />
            ) : null}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              id="submit-team-button"
              size="large"
              fullWidth
              sx={styles.button}
            >
              Create Team
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => router.push("/auth/sign-in")}
            variant="contained"
            color="primary"
            id="event-team-registration-sign-in-button"
            size="large"
            fullWidth
            sx={styles.button}
          >
            Sign in to register a team
          </Button>
        )}
      </StyledCard>
    </SignUpContainer>
  );
}

export function TeamMemberSection({ formData, setFormData, membersIndex, eventId, disabled = false }) {
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
        const data = await getUsers({ term, eventId });
        setUsers(data);
      } catch {
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
      updatedMembers[index] = { userId: null, willingToVolunteer: false, additionalRequirements: "" };
    }

    updatedMembers[index] = { ...updatedMembers[index], ...updates };

    const { userId } = updatedMembers[index];

    if (!userId) {
      updatedMembers.splice(index, 1);
    }

    setFormData({ ...formData, members: updatedMembers });
  };

  return (
    <Box sx={styles.teamMemberBox}>
      <Typography variant="h6" sx={styles.teamMemberTitle}>
        Team member
      </Typography>

      <FormControl fullWidth sx={styles.formGap}>
        <Autocomplete
          disabled={disabled}
          id={`team-member-${membersIndex}`}
          options={users}
          noOptionsText={searchTerm === "" ? "Search by name or email" : `No results`}
          getOptionLabel={(option) => (option ? `${option.firstName} ${option.lastName} (${option.email})` : "")}
          getOptionDisabled={(option) => {
            if (option.alreadyParticipating) {
              return true;
            }
            const formDataUserIds = formData.members.map((member) => member.userId);
            if (formDataUserIds.includes(option.userId)) {
              return true;
            }
          }}
          value={formData.members[membersIndex] || null}
          isOptionEqualToValue={(option, value) => option.userId === value.userId}
          onChange={(_, value) => {
            setUserSearching(false);
            updateMember(membersIndex, {
              userId: value?.userId || null,
              firstName: value?.firstName || "",
              lastName: value?.lastName || "",
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
            disabled={disabled}
            checked={formData.members[membersIndex]?.willingToVolunteer || false}
            onChange={(event) => updateMember(membersIndex, { willingToVolunteer: event.target.checked })}
            id={`team-member-happy-to-volunteer-${membersIndex}`}
            color="primary"
          />
        }
        label="Happy to volunteer if needed"
        sx={styles.formGap}
      />

      <FormControl fullWidth>
        <FormLabel sx={styles.formLabel}>Additional Requirements</FormLabel>
        <TextField
          disabled={disabled}
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
  if (!formData.members.some((member) => member.userId === user.id)) {
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
