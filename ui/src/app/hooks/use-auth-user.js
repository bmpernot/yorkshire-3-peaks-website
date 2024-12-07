import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { USER_ROLES } from "../../lib/constants.mjs";
import { getHighestUserGroup } from "@/src/lib/commonFunctionsServer.mjs";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/src/lib/commonFunctionsServer.mjs";

export default function useAuthUser(forceFetch = false) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const session = await fetchAuthSession();

        if (!session.tokens) {
          setUser({ role: USER_ROLES.GUEST });
          return;
        }

        const userAttributes = await fetchUserAttributes();
        const userObject = {
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
        userObject.role = getHighestUserGroup(groups);

        setUser(userObject);
      } catch (error) {
        const formattedError = new Error("Failed to get user", { cause: error });
        console.error(formattedError);
        toast.error(getErrorMessage(formattedError));
        setUser({ role: USER_ROLES.GUEST });
      } finally {
        setLoading(false);
      }
    }

    // TODO - test if this caches the stuff or might set up user use context
    if (!user || forceFetch) {
      setLoading(true);
      getUser();
    }
  }, [user, forceFetch]);

  if (loading) {
    return { role: USER_ROLES.GUEST };
  }

  return user;
}
