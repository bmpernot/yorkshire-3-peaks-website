import insertUserFunction from "../../services/users/insertUser.mjs";

const insertUser = async (event) => {
  const userId = event.userName;
  const attributes = event.request.userAttributes;

  const firstName = attributes.given_name || "";
  const lastName = attributes.family_name || "";
  const email = attributes.email || "";

  try {
    await insertUserFunction({ userId, firstName, lastName, email });
  } catch (error) {
    console.error(new Error("Failed to insert user into DB", { cause: error }));
  }

  return event;
};

export default insertUser;
