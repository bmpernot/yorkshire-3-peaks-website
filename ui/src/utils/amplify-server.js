import { authConfig } from "@/src/app/auth-variables";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession } from "@aws-amplify/auth/server";
import { USER_ROLES } from "@/src/lib/constants.mjs";
import { getHighestUserGroup } from "@/src/lib/commonFunctionsServer.mjs";

export const { runWithAmplifyServerContext, createAuthRouteHandlers } = createServerRunner({
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

        const user = { role: USER_ROLES.USER };
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        user.role = getHighestUserGroup(groups);

        return user;
      } catch (error) {
        console.error(new Error("An error occurred when trying to authenticate user", { cause: error }));
      }
    },
  });
}
