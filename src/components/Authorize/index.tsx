import React from "react";

import LabelIcon from "~/components/LabelIcon";

type Props = {
  style: string;
  auth: {
    isSignIn: boolean;
    signIn: () => void;
    signOut: () => void;
  };
};

const Authorize: React.FC<Props> = ({
  style,
  auth: { isSignIn, signIn, signOut },
}) => {
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
