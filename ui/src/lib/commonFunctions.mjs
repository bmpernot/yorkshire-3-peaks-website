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

export { isEmptyObject, getHighestUserGroup };
