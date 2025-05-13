import { NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server.js";
import { RESTRICTED_PAGES, USER_ROLES_IN_ORDER_OF_PRECEDENCE, USER_ROLES } from "./lib/constants.mjs";
import { getHighestUserGroup } from "./lib/commonFunctionsServer.mjs";

export async function middleware(request) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const pageRestrictions = Object.entries(RESTRICTED_PAGES).find(([prefix]) => pathname.startsWith(prefix));

  if (!pageRestrictions) {
    return response;
  }

  const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
  const username = request.cookies.get(`CognitoIdentityServiceProvider.${clientId}.LastAuthUser`)?.value;
  const accessToken = request.cookies.get(`CognitoIdentityServiceProvider.${clientId}.${username}.accessToken`)?.value;

  let user = { role: USER_ROLES.GUEST };
  let userMeetsRequirements = false;

  if (accessToken) {
    const payload = JSON.parse(atob(accessToken.split(".")[1]).toString("utf8"));
    try {
      const userGroups = payload["cognito:groups"];
      user = { role: getHighestUserGroup(userGroups) };
    } catch (cause) {
      console.error(new Error("Failed to decode token", { cause }));
      user = await authenticatedUser({ request, response });
    }
  } else {
    user = await authenticatedUser({ request, response });
  }

  const requiredRoleForPage = pageRestrictions[1];
  const userRoleIndex = USER_ROLES_IN_ORDER_OF_PRECEDENCE.indexOf(user.role);
  const requiredRoleIndex = USER_ROLES_IN_ORDER_OF_PRECEDENCE.indexOf(requiredRoleForPage);

  if (userRoleIndex <= requiredRoleIndex) {
    userMeetsRequirements = true;
  }

  if (!userMeetsRequirements) {
    return NextResponse.redirect(new URL("/unauthorised", request.nextUrl));
  }
}

export const config = {
  /*

  Matches all request paths except for the ones starting with:
  - api
  - _next/static
  - _next/image
  Or any png files

   */

  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
