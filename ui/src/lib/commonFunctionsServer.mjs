import { USER_ROLES } from "./constants.mjs";

function isEmptyObject(object) {
  for (const x in object) {
    return false;
  }
  return true;
}

function getHighestUserGroup(groups) {
  if (!groups) {
    return USER_ROLES.USER;
  } else if (groups && groups.includes(USER_ROLES.ADMIN)) {
    return USER_ROLES.ADMIN;
  } else if (groups && groups.includes(USER_ROLES.ORGANISER)) {
    return USER_ROLES.ORGANISER;
  } else {
    return USER_ROLES.USER;
  }
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An error occurred";
}

function isErrors(errors) {
  return Object.values(errors).some((error) => error.length > 0);
}

export { isEmptyObject, getHighestUserGroup, getErrorMessage, isErrors };
