const mainTitle = { fontWeight: "bold", mb: 1, color: "text.primary" };
const button = { mt: 1 };
const paymentBox = {
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  px: 2,
};
const paymentResultsBox = {
  ...paymentBox,
  textAlign: "center",
};
const checkoutFormBox = {
  width: "100%",
  maxWidth: 480,
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 3,
};
const profileButton = { px: 4, py: 1.5 };
const marginBottom4 = { mb: 4 };
const marginYAxis4 = { my: 4 };

export const styles = {
  mainTitle,
  button,
  paymentBox,
  checkoutFormBox,
  profileButton,
  marginBottom4,
  marginYAxis4,
  paymentResultsBox,
};
