import { Show } from "solid-js";

import { NavItem } from "./NavItem";
import { IconSignIn, IconSignOut } from "../Icon";

export type AuthorizeProps = {
  auth: {
    accessToken: string;
    signIn: () => void;
    signOut: () => void;
  };
};

export const Authorize = (props: AuthorizeProps) => {
  return (
    <Show
      when={props.auth.accessToken !== ""}
      fallback={
        <NavItem icon={<IconSignIn />} onClick={() => props.auth.signIn()}>
          Sign In
        </NavItem>
      }>
      <NavItem icon={<IconSignOut />} onClick={() => props.auth.signOut()}>
        Sign Out
      </NavItem>
    </Show>
  );
};
