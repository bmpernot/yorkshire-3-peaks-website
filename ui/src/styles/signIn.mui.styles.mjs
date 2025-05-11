export const styles = {
  forgotPassword: {
    dialogContent: { display: "flex", flexDirection: "column", gap: 2 },
    dialogActions: { pb: 3, px: 3 },
  },
  signIn: {
    title: { width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" },
    form: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      gap: 2,
    },
    emailInput: { ariaLabel: "email" },
    codeInput: { ariaLabel: "email" },
    passwordBox: { display: "flex", justifyContent: "space-between" },
    forgotPasswordButton: { alignSelf: "baseline" },
    signupTitle: { textAlign: "center" },
    signUpLink: { alignSelf: "center" },
  },
  invalidLogin: {
    borderColor: "error.main",
    backgroundColor: "error.main",
    color: "white",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    justifyContent: "center",
    width: "90%",
  },
  formTextField: {
    "& .MuiFormHelperText-root": {
      whiteSpace: "pre-line", // Allows line breaks in helper text
    },
  },
};
