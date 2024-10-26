export const styles = {
  userMenu: {
    dropDown: {
      wrapper: { flexGrow: 0 },
      button: { p: 0 },
      list: { mt: "45px" },
      items: { textAlign: "center" },
      arrow: {
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      },
    },
  },
  navMenu: {
    dropDown: {
      wrapper: { flexGrow: 1, display: "flex" },
      button: { p: 0, color: "inherit" },
      list: { display: "block" },
      internalList: { display: "block", ml: 4, mt: -2 },
      items: { textAlign: "center" },
    },
    itemList: {
      wrapper: { flexGrow: 1, display: "flex" },
      button: { my: 2, color: "white", display: "block" },
    },
    logo: { display: "flex", mr: 1 },
    title: {
      mr: 2,
      display: "flex",
      flexGrow: { xs: "1", md: "0" },
      fontFamily: "monospace",
      fontWeight: 700,
      letterSpacing: ".2rem",
      color: "inherit",
      textDecoration: "none",
    },
  },
  signIn: {
    wrapper: { flexGrow: 0, display: "flex" },
    button: { my: 2, color: "white", display: "block" },
  },
};
