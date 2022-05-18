import { Show } from "solid-js";

import { IconSignIn, IconSignOut } from "~/components/Icon";

import { NavItem } from "./NavItem";

export type AuthorizeProps = {
  isSignIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const Authorize = (props: AuthorizeProps) => {
  return (
    <Show
      when={props.isSignIn}
      fallback={
        <NavItem icon={<IconSignIn />} onClick={() => props.signIn()}>
          Sign In
        </NavItem>
      }>
      <NavItem icon={<IconSignOut />} onClick={() => props.signOut()}>
        Sign Out
      </NavItem>
    </Show>
  );
};
