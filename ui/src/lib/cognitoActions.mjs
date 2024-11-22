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
    await signUp({
      username: formData.email,
      password: formData.password,
      options: {
        userAttributes: {
          phone_number: formData.number,
          email: formData.email,
          given_name: formData.firstName,
          family_name: formData.lastName,
          "custom:notify": formData.notify,
          "custom:ice_number": formData.iceNumber,
        },
      },
    });
  } catch (error) {
    const cause = new Error("An error occurred when trying to sign the user up", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    sessionStorage.setItem("userEmail", formData.email);

    router.push("/auth/confirm-signup");
  } catch (error) {
    const cause = new Error("An error occurred when trying to redirect you to the confirm-signup page", {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }
}

export async function handleSendEmailVerificationCode(email) {
  let response;
  try {
    await resendSignUpCode({ username: email });
    response = "Code sent successfully";
  } catch (error) {
    const cause = new Error(`An error occurred when trying to resend a verification code to ${email}`, {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }

  return response;
}

export async function handleConfirmSignUp(router, formData) {
  try {
    await confirmSignUp({
      username: formData.email,
      confirmationCode: formData.code,
    });
  } catch (error) {
    const cause = new Error("An error has occurred when trying to confirm your account", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    await autoSignIn();
  } catch (error) {
    const cause = new Error("An error has occurred when trying to log the user in after confirmation", {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }

  try {
    const userData = await getCurrentUser();
    await addUser(userData);
  } catch (error) {
    const cause = new Error("An error occurred when trying to add your information to our db", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    router.push("/auth/account");
  } catch (error) {
    const cause = new Error("An error occurred when trying to redirect you to the account page", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function handleSignIn(router, formData) {
  let redirectLink = "/auth/account";
  try {
    const { nextStep } = await signIn({
      username: formData.email,
      password: formData.password,
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.get("email")),
      });
      sessionStorage.setItem("userEmail", formData.email);
      redirectLink = "/auth/confirm-signup";
    } else {
      const doesUserExist = await verifyDbHasUser();

      if (!doesUserExist) {
        await addUserToDB();
      }
    }
  } catch (error) {
    const cause = new Error("An error occurred when trying to log you in", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    router.push(redirectLink);
  } catch (error) {
    const cause = new Error(`An error occurred when trying to redirect you to the ${redirectLink.slice(6)} page`, {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }
}

export async function handleSignOut(router) {
  try {
    await signOut();
  } catch (error) {
    const cause = new Error("An error occurred when trying to sign you out", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    router.push("/");
  } catch (error) {
    const cause = new Error("An error occurred when trying to redirect you to the home page", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function handleResetPassword(router, email) {
  try {
    await resetPassword({
      username: email,
    });
  } catch (error) {
    const cause = new Error("An error occurred when trying to send you a verification code to reset your password", {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }

  try {
    sessionStorage.setItem("userEmail", email);

    router.push("/auth/reset-password");
  } catch (error) {
    const cause = new Error("An error occurred when trying to redirect you to the reset password page", {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }
}

export async function handleConfirmResetPassword(router, formData) {
  try {
    await confirmResetPassword(formData);
  } catch (error) {
    const cause = new Error("An error occurred when trying to reset your password", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    router.push("/auth/sign-in");
  } catch (error) {
    const cause = new Error("An error occurred when trying to redirect you to the sign in page", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function handleDeleteUser(router, id) {
  try {
    await deleteUserFromDB(id);
  } catch (error) {
    const cause = new Error("An error occurred when trying to delete your information from the DB", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    await deleteUser();
  } catch (error) {
    const cause = new Error("An error occurred when trying to delete your account", { cause: error });
    console.error(cause);
    throw cause;
  }

  try {
    router.push("/");
  } catch (error) {
    const cause = new Error("An error occurred when trying to redirect you to the home page", { cause: error });
    console.error(cause);
    throw cause;
  }
}

export async function handleUpdateUserAttributes(formData) {
  let updatedValues;

  try {
    updatedValues = await updateUserAttributes({
      userAttributes: formData,
    });
  } catch (error) {
    const cause = new Error("An error occurred when trying to modify your account", { cause: error });
    console.error(cause);
    throw cause;
  }

  if (updatedValues) {
    try {
      const id = (await getCurrentUser()).userId;
      await modifyUser(id, updatedValues);
    } catch (error) {
      const cause = new Error("An error occurred when trying to add your information to our db", { cause: error });
      console.error(cause);
      throw cause;
    }
  }
}

export async function handleUpdatePassword(formData) {
  try {
    await updatePassword(formData);
  } catch (error) {
    const cause = new Error("An error occurred when trying to update your password", { cause: error });
    console.error(cause);
    throw cause;
  }
}

async function verifyDbHasUser() {
  try {
    const currentUser = await getCurrentUser();
    const user = await getUser(currentUser.userId);
    return user ? true : false;
  } catch (error) {
    const cause = new Error(`An error occurred when trying to get your information`, {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }
}

async function addUserToDB() {
  try {
    const userData = await fetchUserAttributes();
    // TODO - reformat the data so it is nicer
    await addUser(userData);
  } catch (error) {
    const cause = new Error(`An error occurred when trying to add your information to our DB`, {
      cause: error,
    });
    console.error(cause);
    throw cause;
  }
}
