const table = { minWidth: "150px" };
const mainTitle = { fontWeight: "bold", my: 2, color: "text.primary" };
const eventsBox = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  flexWrap: { xs: "wrap", sm: "nowrap" },
  p: { xs: 2, sm: 3 },
  bgcolor: "background.paper",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};
const entriesBox = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  flexDirection: "column",
  p: { xs: 2, sm: 3 },
  bgcolor: "background.paper",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  mt: 2,
};
const dataGrid = {
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
  },
  "& .MuiDataGrid-row:nth-of-type(odd)": {
    backgroundColor: "action.hover",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "action.selected",
  },
};
const eventsRefreshButton = {
  bgcolor: "primary.main",
  color: "primary.contrastText",
  "&:hover": {
    bgcolor: "primary.dark",
  },
  p: 1.5,
};

export const styles = { table, mainTitle, entriesBox, dataGrid, eventsBox, eventsRefreshButton };
