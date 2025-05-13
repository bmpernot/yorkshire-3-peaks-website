"use client";

import { Amplify } from "aws-amplify";
import { authConfig } from "./auth-variables";

export const apiConfig = {
  endpoints: [
    {
      name: "api",
      endpoint: process.env.NEXT_PUBLIC_API_URL,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      custom_header: async () => {
        const session = await Amplify.Auth.currentSession();
        return { Authorization: `Bearer ${session.getAccessToken().getJwtToken()}` };
      },
    },
  ],
};

Amplify.configure({ Auth: authConfig, API: apiConfig }, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
