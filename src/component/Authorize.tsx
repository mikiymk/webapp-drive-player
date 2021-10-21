import { signOut, signIn, loadAndInit } from "../api";
import React from "react";

/**
 * authorize or sign out button
 * @param props compontnt props
 * @returns react render
 */
const Authorize: React.FC<{
  signIn: boolean;
  setSignIn: (signIn: boolean) => void;
}> = ({ signIn, setSignIn }) => {
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    loadAndInit(
      isSignedIn => setSignIn(isSignedIn),
      error => setErrorMessage(JSON.stringify(error, null, 2))
    );
  }, []);

  return (
    <div>
      <ErrorMessage message={errorMessage} />
      <AuthorizeButton isSignedIn={signIn} />
    </div>
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
