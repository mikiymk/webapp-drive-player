import { Show } from "solid-js";

import { IconSignIn, IconSignOut } from "~/components/Icon";
import { accessToken, useSignIn } from "~/signals/access-token";

import { NavItem } from "./NavItem";

export const Authorize = () => {
  const { signIn, signOut } = useSignIn();

  return (
    <Show
      when={accessToken() !== undefined}
      fallback={
        <NavItem icon={<IconSignIn />} onClick={() => signIn()}>
          Sign In
        </NavItem>
      }>
      <NavItem icon={<IconSignOut />} onClick={() => signOut()}>
        Sign Out
      </NavItem>
    </Show>
  );
};
