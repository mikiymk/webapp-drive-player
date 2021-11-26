import React from "react";

import LabelIconButton from "./LabelIconButton";

import { signOut, signIn, loadAndInit } from "../../google-api/init";

type Props = {
  signIn: boolean;
  setSignIn: (signIn: boolean) => void;
};

/**
 * authorize sign in or sign out button and error message
 */
const Authorize: React.FC<Props> = ({ signIn, setSignIn }) => {
  const [errorMessage, setErrorMessage] = React.useState("");

  // init at first
  React.useEffect(() => {
    loadAndInit(
      isSignedIn => setSignIn(isSignedIn),
      error => setErrorMessage(JSON.stringify(error, null, 2))
    );
  }, []);

  return (
    <>
      <ErrorMessage message={errorMessage} />
      <AuthorizeButton isSignedIn={signIn} />
    </>
  );
};

const AuthorizeButton: React.FC<{ isSignedIn: boolean }> = ({ isSignedIn }) =>
  isSignedIn ? (
    <LabelIconButton icon="logout" text="Sign Out" onClick={signOut} />
  ) : (
    <LabelIconButton icon="login" text="Sign In" onClick={signIn} />
  );

const ErrorMessage: React.FC<{ message: string }> = ({ message }) =>
  message ? <pre>{message}</pre> : null;

export default Authorize;
