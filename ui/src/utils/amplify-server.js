import { authConfig } from "@/src/app/amplify-cognito-config";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { USER_ROLES } from "../lib/constants.mjs";
import { getHighestUserGroup } from "../lib/commonFunctionsServer.mjs";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});

export async function authenticatedUser(context) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) {
          return { role: USER_ROLES.GUEST };
        }
        const user = {
          ...(await getCurrentUser(contextSpec)),
          role: USER_ROLES.USER,
        };
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        user.role = getHighestUserGroup(groups);

        return user;
      } catch (error) {
        console.error(new Error("An error occurred when ", { cause: error }));
      }
    },
  });
}
