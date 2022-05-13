import { Show } from "solid-js";

import NavItem from "./NavItem";
import { IconSignIn, IconSignOut } from "../Icon";

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

export default Authorize;
