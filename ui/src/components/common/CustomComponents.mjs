import { Stack, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "225px",
  },
  maxWidth: "290px",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const StyledContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export { StyledCard, StyledContainer };
