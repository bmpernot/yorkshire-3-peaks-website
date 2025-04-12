import { USER_ROLES } from "../../src/lib/constants.mjs";

const User = {
  id: "76420294-00e1-700b-74d6-a22a780eeaef",
  role: USER_ROLES.USER,
  email: "bruce.wayne@yorkshire3peaks.com",
  firstName: "Bruce",
  lastName: "Wayne",
  number: "+441234567890",
  iceNumber: "+441234567891",
  notify: "true",
};

const Organiser = {
  id: "76420294-00e1-700b-74d6-a22a780eeaee",
  role: USER_ROLES.ORGANISER,
  email: "clark.kent@yorkshire3peaks.com",
  firstName: "Clark",
  lastName: "Kent",
  number: "+441234567890",
  iceNumber: "+441234567891",
  notify: "false",
};

const Admin = {
  id: "76420294-00e1-700b-74d6-a22a780eeaed",
  role: USER_ROLES.ADMIN,
  email: "lara.croft@yorkshire3peaks.com",
  firstName: "Lara",
  lastName: "Croft",
  number: "+441234567890",
  iceNumber: "+441234567891",
  notify: "false",
};

export default { User, Organiser, Admin };
