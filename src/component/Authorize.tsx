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

  const error = <pre>{errorMessage}</pre>;
  const button = isSignedIn ? (
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <button onClick={signIn}>Authorize</button>
  );

  return (
    <div>
      {errorMessage ? error : ""}
      {button}
    </div>
  );
};

export default Authorize;
