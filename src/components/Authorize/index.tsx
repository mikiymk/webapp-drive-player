import { Show } from "solid-js";

import LabelIcon from "~/components/LabelIcon";
import { IconSignIn, IconSignOut } from "../Icon";

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
        <li onClick={() => props.auth.signIn()} class={props.style}>
          <LabelIcon icon={<IconSignIn />}>Sign In</LabelIcon>
        </li>
      }>
      <li onClick={() => props.auth.signOut()} class={props.style}>
        <LabelIcon icon={<IconSignOut />}>Sign Out</LabelIcon>
      </li>
    </Show>
  );
};

export default Authorize;
