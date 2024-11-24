import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { USER_ROLES } from "../../lib/constants.mjs";
import { getHighestUserGroup } from "@/src/lib/commonFunctionsServer.mjs";

export default function useAuthUser() {
  const [user, setUser] = useState();

  useEffect(() => {
    async function getUser() {
      try {
        const session = await fetchAuthSession();

        if (!session.tokens) {
          setUser({ role: USER_ROLES.GUEST });
          return;
        }

        const userAttributes = await fetchUserAttributes();
        const user = {
          id: userAttributes.sub,
          email: userAttributes.email,
          firstName: userAttributes.given_name,
          lastName: userAttributes.family_name,
          number: userAttributes.phone_number,
          iceNumber: userAttributes["custom:ice_number"],
          notify: userAttributes["custom:notify"],
          role: USER_ROLES.USER,
        };
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        user.role = getHighestUserGroup(groups);
      } catch (error) {
        throw new Error("Failed to get user", { cause: error });
      }

      setUser(user);
    }

    getUser();
  }, []);

  return user;
}
