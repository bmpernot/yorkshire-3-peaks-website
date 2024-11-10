import { NextResponse } from "next/server";
import { authenticatedUser } from "./utils/amplify-server";
import { RESTRICTED_PAGES, USER_ROLES_IN_ORDER_OF_PRECEDENCE } from "./lib/constants.mjs";

export async function middleware(request) {
  const response = NextResponse.next();
  const user = await authenticatedUser({ request, response });

  let onRestrictedPage = false;
  let userMeetsRequirements = false;

  for (const [key, value] of Object.entries(RESTRICTED_PAGES)) {
    if (request.nextUrl.pathname.startsWith(key)) {
      onRestrictedPage = true;
      if (USER_ROLES_IN_ORDER_OF_PRECEDENCE.indexOf(user.role) <= USER_ROLES_IN_ORDER_OF_PRECEDENCE.indexOf(value)) {
        userMeetsRequirements = true;
      }
    }
  }

  if (onRestrictedPage && !userMeetsRequirements) {
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
