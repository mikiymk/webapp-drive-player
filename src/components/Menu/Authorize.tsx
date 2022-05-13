import { Show } from "solid-js";

import LabelIcon from "./LabelIcon";
import { IconSignIn, IconSignOut } from "../Icon";
import { styleNavItem, styleNavItemButton } from "./style.css";

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
        <li class={styleNavItem}>
          <button
            class={styleNavItemButton}
            onClick={() => props.auth.signIn()}>
            <LabelIcon icon={<IconSignIn />}>Sign In</LabelIcon>
          </button>
        </li>
      }>
      <li class={styleNavItem}>
        <button class={styleNavItemButton} onClick={() => props.auth.signOut()}>
          <LabelIcon icon={<IconSignOut />}>Sign Out</LabelIcon>
        </button>
      </li>
    </Show>
  );
};

export default Authorize;
