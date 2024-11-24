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
} from "aws-amplify/auth";
// import { getAllUsers } from "./backendActions.mjs";

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

export async function handleDeleteUser(router) {
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
  try {
    await updateUserAttributes({
      userAttributes: formData,
    });
  } catch (error) {
    throw new Error("An error occurred when trying to modify your account", { cause: error });
  }
}

export async function handleUpdatePassword(formData) {
  try {
    await updatePassword(formData);
  } catch (error) {
    throw new Error("An error occurred when trying to update your password", { cause: error });
  }
}
