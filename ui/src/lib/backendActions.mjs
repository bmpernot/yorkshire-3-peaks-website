"use client";

import { API } from "aws-amplify";

export async function addUser(userData) {
  try {
    return await API.post("api", "/user/", userData);
  } catch (error) {
    throw new Error("Error making user:", { cause: error });
  }
}

export async function modifyUser(id, updatedValues) {
  try {
    return await API.patch("api", `/user/${id}`, updatedValues);
  } catch (error) {
    throw new Error("Error modifying user:", { cause: error });
  }
}

export async function deleteUser(id) {
  try {
    return await API.del("api", `/user/${id}`);
  } catch (error) {
    throw new Error("Error deleting user:", { cause: error });
  }
}

export async function getUser(id) {
  try {
    return await API.get("api", `/user/${id}`);
  } catch (error) {
    throw new Error("Error fetching user:", { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await API.get("api", "/user/");
  } catch (error) {
    throw new Error("Error fetching users:", { cause: error });
  }
}
