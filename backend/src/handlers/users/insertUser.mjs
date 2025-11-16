import insertUserFunction from "../../services/users/insertUser.mjs";

const insertUser = async (event) => {
  const attributes = event.request.userAttributes;
  const userId = attributes.sub;

  const firstName = attributes.given_name || "";
  const lastName = attributes.family_name || "";
  const email = attributes.email || "";

  if (!userId || !firstName || !lastName || !email) {
    console.error("Missing required user attributes", { userId, firstName, lastName, email });
    return event;
  }

  try {
    await insertUserFunction({ userId, firstName, lastName, email });
  } catch (error) {
    console.error(new Error("Failed to insert user into DB", { cause: error }));
  }

  return event;
};

export default insertUser;
