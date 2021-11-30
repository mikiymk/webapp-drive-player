import React from "react";

import LabelIcon from "component/Common/LabelIcon";

import { signOut, signIn, loadAndInit } from "google-api/init";

type Props = {
  signIn: boolean;
  setSignIn: (signIn: boolean) => void;
};

/**
 * authorize sign in or sign out button and error message
 */
const Authorize: React.FC<Props> = ({ signIn: isSignIn, setSignIn }) => {
  // init at first
  React.useEffect(() => {
    loadAndInit(isSignedIn => setSignIn(isSignedIn));
  }, []);

  const onClick = isSignIn ? signOut : signIn;

  return (
    <li onClick={onClick}>
      <AuthorizeButton isSignedIn={isSignIn} />
    </li>
  );
};

const AuthorizeButton: React.FC<{ isSignedIn: boolean }> = ({ isSignedIn }) =>
  isSignedIn ? (
    <LabelIcon icon="logout" text="Sign Out" />
  ) : (
    <LabelIcon icon="login" text="Sign In" />
  );

export default Authorize;
