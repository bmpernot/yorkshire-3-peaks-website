"use client";

import { get, patch, del, post } from "aws-amplify/api";

export async function getUsers({ term, eventId }) {
  try {
    if (!term && !eventId) {
      throw new Error("Must provide at least one of the searching parameters");
    }

    const components = [];
    if (term) {
      components.push(`searchTerm=${encodeURIComponent(term)}`);
    }
    if (eventId) {
      components.push(`eventId=${encodeURIComponent(eventId)}`);
    }
    const filter = components.join("&");

    const { response } = get({
      apiName: "api",
      path: `users?${filter}`,
      options: {},
    });
    const { body } = await response;

    return await body.json();
  } catch (error) {
    throw new Error("Error fetching users:", { cause: error });
  }
}

export async function updateUser({ userId, firstName, lastName, email }) {
  try {
    if (!userId || !firstName || !lastName || !email) {
      throw new Error("Must provide all parameters");
    }

    const { response } = patch({
      apiName: "api",
      path: "users",
      options: { body: { userId, firstName, lastName, email } },
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error updating user:", { cause: error });
  }
}

export async function deleteUser(userId) {
  try {
    const { response } = del({ apiName: "api", path: `users?userId=${encodeURIComponent(userId)}`, options: {} });
    const { statusCode } = await response;
    return statusCode;
  } catch (error) {
    throw new Error("Error deleting user:", { cause: error });
  }
}

export async function getEvents() {
  try {
    const { response } = get({
      apiName: "api",
      path: `events`,
      options: {},
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error fetching events:", { cause: error });
  }
}

export async function getEntries({ eventId }) {
  try {
    if (!eventId) {
      throw new Error("Must provide an eventId");
    }

    const { response } = get({
      apiName: "api",
      path: `events/entries?eventId=${encodeURIComponent(eventId)}`,
      options: {},
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error fetching entries:", { cause: error });
  }
}

export async function getEventInformation({ eventId }) {
  try {
    if (!eventId) {
      throw new Error("Must provide an eventId");
    }

    const { response } = get({
      apiName: "api",
      path: `events/information?eventId=${encodeURIComponent(eventId)}`,
      options: {},
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error fetching event information:", { cause: error });
  }
}

export async function registerTeam({ eventId, formData }) {
  try {
    if (!eventId || !formData) {
      throw new Error("Must provide an eventId and formData");
    }

    return await post({
      apiName: "api",
      path: `events/register?eventId=${encodeURIComponent(eventId)}`,
      options: { body: formData },
    }).response;
  } catch (error) {
    throw new Error("Error registering team:", { cause: error });
  }
}

export async function registerVolunteer({ eventId, registrationData }) {
  try {
    if (!eventId || !registrationData) {
      throw new Error("Must provide an eventId and registrationData");
    }

    return await post({
      apiName: "api",
      path: `events/volunteer?eventId=${encodeURIComponent(eventId)}`,
      options: { body: registrationData },
    }).response;
  } catch (error) {
    throw new Error("Error registering team:", { cause: error });
  }
}

export async function getTeams({ teamIds }) {
  try {
    let query = "";
    if (teamIds) {
      query = encodeURIComponent(`?teamIds=${teamIds.join(",")}`);
    }
    const { response } = get({
      apiName: "api",
      path: `teams${query}`,
      options: { body: { teamIds } },
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error fetching teams:", { cause: error });
  }
}

export async function updateTeam({ teamId, eventId, actions }) {
  try {
    const { response } = patch({
      apiName: "api",
      path: `teams?teamId=${teamId}&eventId=${eventId}`,
      options: { body: { actions } },
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error updating team:", { cause: error });
  }
}

export async function paymentIntent({ teamId, eventId, amount }) {
  try {
    const { response } = post({
      apiName: "api",
      path: `teams/paymentIntent?teamId=${teamId}&eventId=${eventId}`,
      options: { body: { amount } },
    });
    const { body } = await response;
    return await body.json();
  } catch (error) {
    throw new Error("Error fetching teams:", { cause: error });
  }
}
