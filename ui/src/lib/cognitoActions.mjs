import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  autoSignIn,
  resetPassword,
  deleteUser,
  updateUserAttributes,
  updatePassword,
  confirmResetPassword,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";
import { addUser, modifyUser, deleteUser as deleteUserFromDB, getUser } from "./backendActions.mjs";

export async function handleSignUp(router, formData) {
  try {
    await signUp(formData);
  } catch (error) {
    throw new Error("An error occurred when trying to sign the user up", { cause: error });
  }

  try {
    sessionStorage.setItem("userEmail", formData.email);

    router.push("/auth/confirm-signup");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the confirm-signup page", {
      cause: error,
    });
  }
}

export async function handleSendEmailVerificationCode(email) {
  let response;
  try {
    await resendSignUpCode({ username: email });
    response = "Code sent successfully";
  } catch (error) {
    throw new Error(`An error occurred when trying to resend a verification code to ${email}`, {
      cause: error,
    });
  }

  return response;
}

export async function handleConfirmSignUp(router, formData) {
  try {
    await confirmSignUp(formData);
  } catch (error) {
    throw new Error("An error has occurred when trying to confirm your account", { cause: error });
  }

  try {
    await autoSignIn();
  } catch (error) {
    throw new Error("An error has occurred when trying to log the user in after confirmation", {
      cause: error,
    });
  }

  try {
    const userData = await getCurrentUser();
    await addUser(userData);
  } catch (error) {
    throw new Error("An error occurred when trying to add your information to our db", { cause: error });
  }

  try {
    router.push("/auth/account");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the account page", { cause: error });
  }
}

export async function handleSignIn(router, formData) {
  let redirectLink = "/auth/account";
  try {
    const { nextStep } = await signIn(formData);
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.get("email")),
      });
      sessionStorage.setItem("userEmail", formData.username);
      redirectLink = "/auth/confirm-signup";
    } else {
      const doesUserExist = await verifyDbHasUser();

      if (!doesUserExist) {
        await addUserToDB();
      }
    }
  } catch (error) {
    throw new Error("An error occurred when trying to log you in", { cause: error });
  }

  try {
    router.push(redirectLink);
  } catch (error) {
    throw new Error(`An error occurred when trying to redirect you to the ${redirectLink.slice(6)} page`, {
      cause: error,
    });
  }
}

export async function handleSignOut(router) {
  try {
    await signOut();
  } catch (error) {
    throw new Error("An error occurred when trying to sign you out", { cause: error });
  }

  try {
    router.push("/");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the home page", { cause: error });
  }
}

export async function handleResetPassword(router, email) {
  try {
    await resetPassword({
      username: email,
    });
  } catch (error) {
    throw new Error("An error occurred when trying to send you a verification code to reset your password", {
      cause: error,
    });
  }

  try {
    sessionStorage.setItem("userEmail", email);

    router.push("/auth/reset-password");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the reset password page", {
      cause: error,
    });
  }
}

export async function handleConfirmResetPassword(router, formData) {
  try {
    await confirmResetPassword(formData);
  } catch (error) {
    throw new Error("An error occurred when trying to reset your password", { cause: error });
  }

  try {
    router.push("/auth/sign-in");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the sign in page", { cause: error });
  }
}

export async function handleDeleteUser(router, id) {
  try {
    await deleteUserFromDB(id);
  } catch (error) {
    throw new Error("An error occurred when trying to delete your information from the DB", { cause: error });
  }

  try {
    await deleteUser();
  } catch (error) {
    throw new Error("An error occurred when trying to delete your account", { cause: error });
  }

  try {
    router.push("/");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the home page", { cause: error });
  }
}

export async function handleUpdateUserAttributes(formData) {
  let updatedValues;

  try {
    updatedValues = await updateUserAttributes({
      userAttributes: formData,
    });
  } catch (error) {
    throw new Error("An error occurred when trying to modify your account", { cause: error });
  }

  if (updatedValues) {
    try {
      const id = (await getCurrentUser()).userId;
      await modifyUser(id, updatedValues);
    } catch (error) {
      throw new Error("An error occurred when trying to add your information to our db", { cause: error });
    }
  }
}

export async function handleUpdatePassword(formData) {
  try {
    await updatePassword(formData);
  } catch (error) {
    throw new Error("An error occurred when trying to update your password", { cause: error });
  }
}

async function verifyDbHasUser() {
  try {
    const currentUser = await getCurrentUser();
    const user = await getUser(currentUser.userId);
    return user ? true : false;
  } catch (error) {
    throw new Error(`An error occurred when trying to get your information`, {
      cause: error,
    });
  }
}

async function addUserToDB() {
  try {
    const userData = await fetchUserAttributes();
    // TODO - reformat the data so it is nicer
    await addUser(userData);
  } catch (error) {
    throw new Error(`An error occurred when trying to add your information to our DB`, {
      cause: error,
    });
  }
}
