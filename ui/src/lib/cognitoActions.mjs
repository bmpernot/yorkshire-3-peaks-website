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

export async function handleSignUp(router, email, password, firstName, lastName, number, iceNumber, notify) {
  try {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          phone_number: number,
          email,
          given_name: firstName,
          family_name: lastName,
          "custom:notify": notify,
          "custom:ice_number": iceNumber,
        },
      },
    });
  } catch (error) {
    throw new Error("An error occurred when trying to sign the user up", { cause: error });
  }

  try {
    router.push(`/auth/confirm-signup?email=${encodeURIComponent(email)}`);
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

export async function handleConfirmSignUp(router, email, code, updateUser) {
  let confirmSignUpResponse;
  try {
    confirmSignUpResponse = await confirmSignUp({ username: email, confirmationCode: code });
  } catch (error) {
    throw new Error("An error has occurred when trying to confirm your account", { cause: error });
  }

  if (confirmSignUpResponse.nextStep === "COMPLETE_AUTO_SIGN_IN") {
    try {
      await autoSignIn();
    } catch (error) {
      throw new Error("An error has occurred when trying to log the user in after confirmation", {
        cause: error,
      });
    }

    await updateUser();

    try {
      router.push("/user/account");
    } catch (error) {
      throw new Error("An error occurred when trying to redirect you to the account page", { cause: error });
    }
  } else {
    try {
      router.push("/auth/sign-in");
    } catch (error) {
      throw new Error("An error occurred when trying to redirect you to the sign in page", { cause: error });
    }
  }
}

export async function handleSignIn(router, email, password, updateUser) {
  let redirectLink = "/user/account";

  try {
    const { nextStep } = await signIn({
      username: email,
      password,
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: email,
      });
      redirectLink = `/auth/confirm-signup?email=${encodeURIComponent(email)}`;
    }
  } catch (error) {
    throw new Error("An error occurred when trying to log you in", { cause: error });
  }

  await updateUser();

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

export async function handleResetPassword(router, email, onPage = false) {
  try {
    await resetPassword({
      username: email,
    });
  } catch (error) {
    throw new Error("An error occurred when trying to send you a verification code to reset your password", {
      cause: error,
    });
  }

  if (!onPage) {
    try {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      throw new Error("An error occurred when trying to redirect you to the reset password page", {
        cause: error,
      });
    }
  }
}

export async function handleConfirmResetPassword(router, email, code, password) {
  try {
    await confirmResetPassword({
      confirmationCode: code,
      newPassword: password,
      username: email,
    });
  } catch (error) {
    throw new Error("An error occurred when trying to reset your password", { cause: error });
  }

  try {
    router.push("/auth/sign-in");
  } catch (error) {
    throw new Error("An error occurred when trying to redirect you to the sign in page", { cause: error });
  }
}

export async function handleDeleteUser() {
  try {
    await deleteUser();
  } catch (error) {
    throw new Error("An error occurred when trying to delete your account", { cause: error });
  }
}

export async function handleUpdateUserAttributes(firstName, lastName, number, iceNumber, notify) {
  const userAttributes = {
    given_name: firstName,
    family_name: lastName,
    phone_number: number,
    "custom:ice_number": iceNumber,
    "custom:notify": notify,
  };

  try {
    await updateUserAttributes({
      userAttributes,
    });
  } catch (error) {
    throw new Error("An error occurred when trying to modify your account", { cause: error });
  }
}

export async function handleUpdatePassword(oldPassword, newPassword) {
  try {
    await updatePassword({ oldPassword, newPassword });
  } catch (error) {
    throw new Error("An error occurred when trying to update your password", { cause: error });
  }
}
