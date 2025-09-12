"use client";

import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { authConfig } from "./auth-variables";

export const apiConfig = {
  endpoints: [
    {
      name: "api",
      endpoint: process.env.NEXT_PUBLIC_API_URL,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      headers: async () => {
        const session = await fetchAuthSession();

        if (!session.tokens) {
          return {};
        }

        const jtwToken = session?.tokens?.accessToken;
        return { Authorization: `Bearer ${jtwToken}` };
      },
    },
  ],
};

Amplify.configure({ Auth: authConfig, API: apiConfig }, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
