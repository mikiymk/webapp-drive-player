import React from "react";

import LabelIcon from "components/LabelIcon";

import { signOut, signIn, loadAndInit } from "google-api/init";

type Props = {
  signIn: boolean;
  setSignIn: (signIn: boolean) => void;
  style: string;
};

/**
 * authorize sign in or sign out button and error message
 */
const Authorize: React.FC<Props> = ({ signIn: isSignIn, setSignIn, style }) => {
  // init at first
  React.useEffect(() => {
    loadAndInit(isSignedIn => setSignIn(isSignedIn));
  }, []);

  const onClick = isSignIn ? signOut : signIn;

  return (
    <li onClick={onClick} className={style}>
      {isSignIn ? (
        <LabelIcon icon="logout" text="Sign Out" />
      ) : (
        <LabelIcon icon="login" text="Sign In" />
      )}
    </li>
  );
};

export default Authorize;
