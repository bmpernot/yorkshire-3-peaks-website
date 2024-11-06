import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { USER_ROLES } from "../../lib/constants.mjs";
import { getHighestUserGroup } from "@/src/lib/commonFunctionsServer.mjs";

export default function useAuthUser() {
  const [user, setUser] = useState();

  useEffect(() => {
    async function getUser() {
      const session = await fetchAuthSession();
      if (!session.tokens) {
        setUser({ role: USER_ROLES.GUEST });
        return;
      }
      const user = {
        ...(await getCurrentUser()),
        ...(await fetchUserAttributes()),
        role: USER_ROLES.USER,
      };
      const groups = session.tokens.accessToken.payload["cognito:groups"];
      user.role = getHighestUserGroup(groups);

      setUser(user);
    }

    getUser();
  }, []);

  return user;
}
