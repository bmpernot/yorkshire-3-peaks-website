"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { getHighestUserGroup } from "@/src/lib/commonFunctionsServer.mjs";
import { toast } from "react-toastify";
import { USER_ROLES } from "@/src/lib/constants.mjs";
import { getErrorMessage } from "@/src/lib/commonFunctionsServer.mjs";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ role: USER_ROLES.GUEST });
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const session = await fetchAuthSession();

      if (!session.tokens) {
        setUser({ role: USER_ROLES.GUEST });
        return;
      }

      const attributes = await fetchUserAttributes();

      const userObject = {
        id: attributes.sub,
        email: attributes.email,
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        number: attributes.phone_number,
        iceNumber: attributes["custom:ice_number"],
        notify: attributes["custom:notify"],
        role: getHighestUserGroup(session.tokens.accessToken.payload["cognito:groups"]) || USER_ROLES.USER,
      };

      setUser(userObject);
    } catch (error) {
      console.error(new Error("Failed to get user", { cause: error }));
      toast.error(getErrorMessage(error));
      setUser({ role: USER_ROLES.GUEST });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const userContext = useMemo(() => {
    const updateUser = async () => {
      await fetchUser();
    };

    return { user, setUser, fetchUser, loading, updateUser };
  }, [user, loading]);

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
