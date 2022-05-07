import { Show } from "solid-js";

import LabelIcon from "./LabelIcon";
import { IconSignIn, IconSignOut } from "../Icon";
import { styleNavItem } from "./style.css";

type Props = {
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
        <li onClick={() => props.auth.signIn()} class={styleNavItem}>
          <LabelIcon icon={<IconSignIn />}>Sign In</LabelIcon>
        </li>
      }>
      <li onClick={() => props.auth.signOut()} class={styleNavItem}>
        <LabelIcon icon={<IconSignOut />}>Sign Out</LabelIcon>
      </li>
    </Show>
  );
};

export default Authorize;
