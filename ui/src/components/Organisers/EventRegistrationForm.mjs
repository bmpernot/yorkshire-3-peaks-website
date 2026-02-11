import { useState } from "react";
import { Typography, FormControl, FormLabel, TextField, Button, Box } from "@mui/material";
import { StyledCard, StyledContainer } from "../common/CustomComponents.mjs";
import { toast } from "react-toastify";
import ErrorCard from "../common/ErrorCard.mjs";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import { registerEvent } from "@/src/lib/backendActions.mjs";

function EventRegistrationForm({ router, isLoggedIn }) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    requiredWalkers: "",
    requiredVolunteers: "",
    earlyBirdPrice: "",
    earlyBirdCutoff: "",
    price: "",
  });
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsInFormData = validateFormData(formData);
    if (errorsInFormData.length > 0) {
      setErrors(errorsInFormData);
      return;
    }

    try {
      const payload = {
        ...formData,
        earlyBirdPrice: Math.round(parseFloat(formData.earlyBirdPrice) * 100),
        price: Math.round(parseFloat(formData.price) * 100),
        requiredWalkers: parseInt(formData.requiredWalkers),
        requiredVolunteers: parseInt(formData.requiredVolunteers),
      };
      await registerEvent(payload);
      toast.success("Event registered successfully");
      router.push("/events");
    } catch {
      toast.error("Failed to register event.");
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <StyledContainer direction="column" justifyContent="space-between" paddingTop="true">
      <StyledCard variant="outlined" sx={styles.card} nomaxwidth="true">
        <Typography variant="h4" sx={styles.title}>
          Register New Event
        </Typography>
        {isLoggedIn ? (
          <Box component="form" onSubmit={handleSubmit}>
            {errors.length > 0 &&
              errors.map((error, index) => <ErrorCard error={error} index={index} key={`error-card-${index}`} />)}

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Start Date</FormLabel>
              <TextField
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </FormControl>

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>End Date</FormLabel>
              <TextField
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
              />
            </FormControl>

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Required Walkers</FormLabel>
              <TextField
                type="number"
                value={formData.requiredWalkers}
                onChange={(e) => handleChange("requiredWalkers", e.target.value)}
                onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                slotProps={{ htmlInput: { min: 0 } }}
                required
              />
            </FormControl>

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Required Volunteers</FormLabel>
              <TextField
                type="number"
                value={formData.requiredVolunteers}
                onChange={(e) => handleChange("requiredVolunteers", e.target.value)}
                onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                slotProps={{ htmlInput: { min: 0 } }}
                required
              />
            </FormControl>

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Early Bird Price (£)</FormLabel>
              <TextField
                type="number"
                value={formData.earlyBirdPrice}
                onChange={(e) => handleChange("earlyBirdPrice", e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: "1" } }}
                required
              />
            </FormControl>

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Early Bird Cutoff</FormLabel>
              <TextField
                type="datetime-local"
                value={formData.earlyBirdCutoff}
                onChange={(e) => handleChange("earlyBirdCutoff", e.target.value)}
                required
              />
            </FormControl>

            <FormControl fullWidth sx={styles.form}>
              <FormLabel sx={styles.formLabel}>Price (£)</FormLabel>
              <TextField
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: "1" } }}
                required
              />
            </FormControl>

            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={styles.button}>
              Register Event
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => router.push("/auth/sign-in")}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={styles.button}
          >
            Sign in to register an event
          </Button>
        )}
      </StyledCard>
    </StyledContainer>
  );
}

function validateFormData(formData) {
  const messages = [];
  const now = new Date();

  if (!formData.startDate) {
    messages.push("Start date is required.");
  }
  if (!formData.endDate) {
    messages.push("End date is required.");
  }
  if (!formData.earlyBirdCutoff) {
    messages.push("Early bird cutoff is required.");
  }

  if (formData.startDate) {
    const startDate = new Date(formData.startDate);
    if (startDate < now) {
      messages.push("Start date cannot be in the past.");
    }
    if (startDate.getHours() < 12) {
      messages.push("Start time must be midday or after.");
    }
  }

  if (formData.endDate) {
    const endDate = new Date(formData.endDate);
    if (endDate < now) {
      messages.push("End date cannot be in the past.");
    }
    if (endDate.getHours() > 12) {
      messages.push("End time cannot be after midday.");
    }
  }

  if (formData.earlyBirdCutoff) {
    const cutoff = new Date(formData.earlyBirdCutoff);
    if (cutoff < now) {
      messages.push("Early bird cutoff cannot be in the past.");
    }
  }

  if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
    messages.push("End date must be after start date.");
  }

  if (
    formData.startDate &&
    formData.earlyBirdCutoff &&
    new Date(formData.earlyBirdCutoff) >= new Date(formData.startDate)
  ) {
    messages.push("Early bird cutoff must be before start date.");
  }

  ["requiredWalkers", "requiredVolunteers"].forEach((field) => {
    const value = parseInt(formData[field]);
    if (!formData[field]) {
      messages.push(`${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`);
    } else if (isNaN(value) || value < 0) {
      messages.push(`${field.replace(/([A-Z])/g, " $1")} must be a positive number.`);
    }
  });

  ["earlyBirdPrice", "price"].forEach((field) => {
    const value = parseInt(formData[field]);
    if (!formData[field]) {
      messages.push(`${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`);
    } else if (isNaN(value) || value < 0 || !Number.isInteger(parseFloat(formData[field]))) {
      messages.push(`${field.replace(/([A-Z])/g, " $1")} must be a whole number.`);
    }
  });

  return messages;
}

export default EventRegistrationForm;
