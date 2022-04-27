import React from "react";
import { Show } from "solid-js";

import LabelIcon from "~/components/LabelIcon";

type Props = {
  style: string;
  auth: {
    accessToken: string;
    signIn: () => void;
    signOut: () => void;
  };
};

const Authorize = (props: Props) => {
  return (
    <Show
      when={props.auth.accessToken !== ""}
      fallback={
        <li onClick={props.auth.signIn} className={props.style}>
          <LabelIcon icon="login" text="Sign In" />
        </li>
      }>
      <li onClick={props.auth.signOut} className={props.style}>
        <LabelIcon icon="logout" text="Sign Out" />
      </li>
    </Show>
  );
};

export default Authorize;
