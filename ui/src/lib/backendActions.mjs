"use client";

import { get, patch, del, post } from "aws-amplify/api";

export async function getUsers({ term, eventId }) {
  try {
    return (
      await get({
        apiName: "api",
        path: `users?searchTerm=${term}&eventId=${eventId}`,
        options: {},
      }).response
    ).body.json();
  } catch (error) {
    throw new Error("Error fetching users:", { cause: error });
  }
}

export async function updateUser({ userId, firstName, lastName, email }) {
  try {
    return (
      await patch({ apiName: "api", path: "/users", options: { body: { userId, firstName, lastName, email } } })
        .response
    ).body.json();
  } catch (error) {
    throw new Error("Error updating user:", { cause: error });
  }
}

export async function deleteUser() {
  try {
    return (await del({ apiName: "api", path: "/users", options: {} }).response).statusCode;
  } catch (error) {
    throw new Error("Error deleting user:", { cause: error });
  }
}

export async function getEvents() {
  try {
    return (
      await get({
        apiName: "api",
        path: `events`,
        options: {},
      }).response
    ).body.json();
  } catch (error) {
    throw new Error("Error fetching events:", { cause: error });
  }
}

export async function getEntries({ eventId }) {
  try {
    return (
      await get({
        apiName: "api",
        path: `events/entries?eventId=${eventId}`,
        options: {},
      }).response
    ).body.json();
  } catch (error) {
    throw new Error("Error fetching entries:", { cause: error });
  }
}

export async function getEventInformation({ eventId }) {
  try {
    return (
      await get({
        apiName: "api",
        path: `events/information?eventId=${eventId}`,
        options: {},
      }).response
    ).body.json();
  } catch (error) {
    throw new Error("Error fetching event information:", { cause: error });
  }
}

export async function registerTeam({ eventId, formData }) {
  try {
    return await post({
      apiName: "api",
      path: `events/register?eventId=${eventId}`,
      options: { body: formData },
    }).response;
  } catch (error) {
    throw new Error("Error registering team:", { cause: error });
  }
}

export async function registerVolunteer({ eventId, registrationData }) {
  try {
    return await post({
      apiName: "api",
      path: `events/volunteer?eventId=${eventId}`,
      options: { body: registrationData },
    }).response;
  } catch (error) {
    throw new Error("Error registering team:", { cause: error });
  }
}
