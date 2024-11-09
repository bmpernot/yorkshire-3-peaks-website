export const styles = {
  title: { width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" },
  formBox: { display: "flex", flexDirection: "column", gap: 2 },
  formTextField: {
    "& .MuiFormHelperText-root": {
      whiteSpace: "pre-line", // Allows line breaks in helper text
    },
  },
  toolTipIcon: { pr: 1, pt: 1 },
  titleBox: { display: "flex", justifyContent: "space-between", width: "90%", alignItems: "center" },
  existingAccountTitle: { textAlign: "center" },
  existingAccountLink: { alignSelf: "center" },
};
