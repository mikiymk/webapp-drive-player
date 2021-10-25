import React from "react";
import { signOut, signIn, loadAndInit } from "../google-api/init";

/**
 * authorize sign in or sign out button and error message
 */
const Authorize: React.FC<{
  signIn: boolean;
  setSignIn: (signIn: boolean) => void;
}> = ({ signIn, setSignIn }) => {
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
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <button onClick={signIn}>Authorize</button>
  );

const ErrorMessage: React.FC<{ message: string }> = ({ message }) =>
  message ? <pre>{message}</pre> : null;

export default Authorize;
