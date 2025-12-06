import { styles } from "@/src/styles/event.mui.styles.mjs";
import {
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import { useState, useCallback, useEffect } from "react";
import { getUsers } from "@/src/lib/backendActions.mjs";

function TeamMemberLookup({ formData, setFormData, membersIndex, eventId, disabled = false }) {
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

export default TeamMemberLookup;
