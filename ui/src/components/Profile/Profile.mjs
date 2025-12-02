"use client";

import { useCallback, useEffect, useState } from "react";
import { getTeams } from "@/src/lib/backendActions.mjs";
import { toast } from "react-toastify";
import Loading from "../common/Loading.mjs";
import ErrorCard from "../common/ErrorCard.mjs";
import { Typography, Box, Grid2 } from "@mui/material";
import { styles } from "@/src/styles/event.mui.styles.mjs";
import TeamCard from "./TeamCard.mjs";

function Profile() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchTeams = useCallback(async () => {
    try {
      const response = await getTeams({});
      setTeams(response);
    } catch (error) {
      setIsError(true);
      console.error(error);
      toast.error("Failed to get your teams");
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  if (isLoading) {
    return <Loading message={"Getting your teams"} />;
  }

  if (isError) {
    return <ErrorCard error="Failed to get your teams" />;
  }

  return (
    <Box
      sx={{
        maxWidth: 1100,
        px: 2,
        mt: 1,
      }}
    >
      <Typography variant="h3" component="h1" sx={styles.mainTitle} id="title">
        Profile
      </Typography>

      {teams?.length > 0 ? (
        <Grid2 container={true} spacing={3} alignItems="stretch">
          {teams.map((team) => (
            <Grid2 key={team.teamId} display="flex">
              <TeamCard team={team} setTeams={setTeams} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="h5" id="no-teams">
          You are not currently part of any teams.
        </Typography>
      )}
    </Box>
  );
}

export default Profile;
