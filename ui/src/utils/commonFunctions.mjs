function isEmptyObject(object) {
  for (const x in object) {
    return false;
  }
  return true;
}

export { isEmptyObject };
