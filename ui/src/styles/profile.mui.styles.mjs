const marginBottom2 = { mb: 2 };
const marginBottom = { mb: 1 };
const hyperlink = { mx: 0.5, fontWeight: 700 };
const mainTitle = { mb: 2, fontWeight: 600 };
const successText = { mt: 2, color: "success.main" };
const payButton = { whiteSpace: "nowrap", px: 3 };
const lineBar = {
  height: 10,
  borderRadius: 5,
};
const paidAmount = { display: "flex", justifyContent: "space-between", mt: 1 };
const divider = { my: 2 };
const amountToPay = { mb: 1, fontWeight: 500 };
const amountToPayBox = { display: "flex", flexDirection: "row", gap: 2 };
const card = {
  borderRadius: 3,
  boxShadow: 3,
  transition: "0.2s",
  height: "100%",
  "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
};
const cardActionArea = { height: "100%" };
const marginTop = { mt: 1 };
const marginTop2 = { mt: 2 };
const cardPaidAmount = { display: "block", mt: 0.5 };

export const styles = {
  mainTitle,
  hyperlink,
  marginBottom,
  marginBottom2,
  successText,
  payButton,
  lineBar,
  paidAmount,
  divider,
  amountToPay,
  amountToPayBox,
  card,
  cardActionArea,
  marginTop,
  marginTop2,
  cardPaidAmount,
};
