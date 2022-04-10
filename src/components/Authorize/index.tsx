import React from "react";

import LabelIcon from "components/LabelIcon";

import useSignIn from "hooks/useSignIn";

type Props = {
  style: string;
};

const Authorize: React.FC<Props> = ({ style }) => {
  const { isSignIn, signOut, signIn } = useSignIn();

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
