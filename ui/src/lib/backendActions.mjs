"use client";

import { API } from "aws-amplify";

export async function addUser(userData) {
  try {
    return await API.post("api", "/user/", userData);
  } catch (error) {
    const cause = new Error("Error making user:", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function modifyUser(id, updatedValues) {
  try {
    return await API.patch("api", `/user/${id}`, updatedValues);
  } catch (error) {
    const cause = new Error("Error modifying user:", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function deleteUser(id) {
  try {
    return await API.del("api", `/user/${id}`);
  } catch (error) {
    const cause = new Error("Error deleting user:", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function getUser(id) {
  try {
    return await API.get("api", `/user/${id}`);
  } catch (error) {
    const cause = new Error("Error fetching user:", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function getAllUsers() {
  try {
    return await API.get("api", "/user/");
  } catch (error) {
    const cause = new Error("Error fetching users:", { cause: error });
    console.error(cause);
    throw cause;
  }
}
