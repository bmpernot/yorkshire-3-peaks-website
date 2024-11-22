"use client";

import { Amplify } from "aws-amplify";

export const authConfig = {
  Cognito: {
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  },
};

export const apiConfig = {
  endpoints: [
    {
      name: "api",
      endpoint: process.env.NEXT_PUBLIC_API_URL,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      custom_header: async () => {
        const session = await Amplify.Auth.currentSession();
        return { Authorization: `Bearer ${session.getIdToken().getJwtToken()}` };
      },
    },
  ],
};

Amplify.configure({ Auth: authConfig, API: apiConfig }, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
