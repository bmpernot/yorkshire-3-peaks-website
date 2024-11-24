"use client";

import { API } from "aws-amplify";

export async function getAllUsers() {
  try {
    return await API.get("api", "/user/");
  } catch (error) {
    throw new Error("Error fetching users:", { cause: error });
  }
}
