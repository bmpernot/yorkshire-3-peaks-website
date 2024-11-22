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

      // TODO - make sure the data is correct - may only need to do a fetch user attributes call as it looks like it has everything
      const [currentUser, userAttributes] = await Promise.all([getCurrentUser(), fetchUserAttributes()]);
      const user = {
        id: userAttributes.sub ?? currentUser.userId,
        email: userAttributes.email ?? currentUser.username,
        firstName: userAttributes.given_name,
        lastName: userAttributes.family_name,
        number: userAttributes.phone_number,
        iceNumber: userAttributes["custom:ice_number"],
        notify: userAttributes["custom:notify"],
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
