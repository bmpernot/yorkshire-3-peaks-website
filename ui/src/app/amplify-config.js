"use client";

import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import { authConfig } from "./auth-variables";

export const apiConfig = {
  REST: {
    api: {
      endpoint: process.env.NEXT_PUBLIC_API_URL,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    },
  },
};

Amplify.configure(
  { Auth: authConfig, API: apiConfig },
  {
    ssr: true,
    API: {
      REST: {
        headers: async () => {
          const session = await fetchAuthSession();

          if (!session.tokens) {
            return {};
          }

          const jwtToken = session?.tokens.accessToken.toString();
          return { Authorization: `Bearer ${jwtToken}` };
        },
      },
    },
  },
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
