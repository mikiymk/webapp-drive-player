import { signOut, signIn, loadAndInit } from "../api";
import React from "react";

/**
 * authorize or sign out button
 * @param props compontnt props
 * @returns react render
 */
const Authorize: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    loadAndInit(
      isSignedIn => {
        setIsSignedIn(isSignedIn);
        if (isSignedIn) {
          onSignIn();
        }
      },
      error => setErrorMessage(JSON.stringify(error, null, 2))
    );
    return;
  }, []);

  return (
    <div>
      <ErrorMessage message={errorMessage} />
      <AuthorizeButton isSignedIn={isSignedIn} />
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
