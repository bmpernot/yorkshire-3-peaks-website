function isValidUserObject(userObject) {
  if (!userObject.id) {
    return false;
  }
  if (!userObject.firstName) {
    return false;
  }
  if (!userObject.lastName) {
    return false;
  }
  if (!userObject.email) {
    return false;
  }
  if (!userObject.number) {
    return false;
  }
  if (!userObject.iceNumber) {
    return false;
  }

  return true;
}

export { isValidUserObject };
