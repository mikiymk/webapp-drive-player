import React from "react";
import { Show } from "solid-js";

import LabelIcon from "~/components/LabelIcon";

type Props = {
  style: string;
  auth: {
    isSignIn: boolean;
    signIn: () => void;
    signOut: () => void;
  };
};

const Authorize = (props: Props) => {
  const onClick = props.auth.isSignIn ? props.auth.signOut : props.auth.signIn;

  return (
    <li onClick={onClick} className={props.style}>
      <Show
        when={props.auth.isSignIn}
        fallback={<LabelIcon icon="login" text="Sign In" />}>
        <LabelIcon icon="logout" text="Sign Out" />
      </Show>
    </li>
  );
};

export default Authorize;
