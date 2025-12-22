const mainTitle = { fontWeight: "bold", mt: 2, mb: 2, color: "text.primary" };
const subTitle = {
  mb: { xs: 2, sm: 3 },
  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
  fontWeight: 600,
  color: "primary.main",
};
const gridPadding = { paddingY: "2rem" };
const informationBlock = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  p: { xs: 2, sm: 3 },
  borderRadius: 2,
  bgcolor: "primary.main",
  color: "white",
};
const informationBlockTitle = {
  mb: 1,
  fontWeight: 500,
  fontSize: { xs: "1.125rem", sm: "1.25rem" },
};
const informationBlockValue = {
  fontWeight: 700,
  fontSize: { xs: "1.5rem", sm: "2rem" },
};

const pieChart = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  p: { xs: 2, sm: 3 },
  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
};
const pieChartTitle = {
  mb: 2,
  fontWeight: 500,
  fontSize: { xs: "1.125rem", sm: "1.25rem" },
};
const pieChartValue = {
  mt: 1,
  fontWeight: 600,
  fontSize: { xs: "1rem", sm: "1.125rem" },
};
const pieChartPercentage = {
  transform: "translate(-50%, -50%)",
  fontWeight: 700,
  fontSize: { xs: "1.25rem", sm: "1.5rem" },
};

const pieChartInnerBox = { width: { xs: 160, sm: 180, md: 200 }, height: { xs: 160, sm: 180, md: 200 } };
const pieChartOuterBox = { width: { xs: 160, sm: 180, md: 200 } };

const title = {
  mb: 2,
  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
  fontWeight: 600,
  color: "primary.main",
};

const box = {
  p: { xs: 2, sm: 3 },
  bgcolor: "primary.main",
  borderRadius: 2,
  mb: 3,
};

const description = {
  color: "white",
  fontSize: { xs: "0.875rem", sm: "1rem" },
  lineHeight: 1.6,
};

const button = {
  py: { xs: 1.5, sm: 2 },
  fontSize: { xs: "1rem", sm: "1.125rem" },
  fontWeight: 600,
};

const form = { mb: 3 };
const formGap = { mb: 2 };
const formLabel = { mb: 1, fontWeight: 500 };
const card = { height: "fit-content" };

const teamMemberBox = {
  p: { xs: 2, sm: 3 },
  mb: 3,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  bgcolor: "background.paper",
};

const teamMemberTitle = {
  mb: 2,
  fontWeight: 600,
  color: "text.primary",
  fontSize: { xs: "1rem", sm: "1.125rem" },
};
const noEventsBox = {
  mt: { xs: 3, sm: 4 },
  p: { xs: 3, sm: 4 },
  textAlign: "center",
  bgcolor: "white",
  borderRadius: 3,
};
const noEventsTitle = {
  mb: 2,
  fontWeight: 600,
  fontSize: { xs: "1.25rem", sm: "1.5rem" },
};
const noEventsBody = {
  fontSize: { xs: "0.875rem", sm: "1rem" },
  lineHeight: 1.6,
};
const divider = { my: 3 };
const area = {
  maxWidth: 1100,
  px: 2,
  mt: 1,
};

export const styles = {
  mainTitle,
  subTitle,
  gridPadding,
  informationBlock,
  informationBlockTitle,
  informationBlockValue,
  pieChart,
  pieChartTitle,
  pieChartValue,
  pieChartPercentage,
  pieChartInnerBox,
  pieChartOuterBox,
  title,
  box,
  description,
  button,
  form,
  formLabel,
  card,
  formGap,
  teamMemberBox,
  teamMemberTitle,
  noEventsBox,
  noEventsTitle,
  noEventsBody,
  divider,
  area,
};
