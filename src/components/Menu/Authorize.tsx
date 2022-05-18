import { Show } from "solid-js";

import { IconSignIn, IconSignOut } from "~/components/Icon";

import { NavItem } from "./NavItem";

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
