import { createSignal } from "solid-js";

import { initClient } from "~/api/google/init";
import {
  refreshAccessToken,
  requestAccessToken,
} from "~/api/google/request-token";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  refresh(0);

  return {
    signIn: async () => {
      const { code } = await client.requestCode();
      const { accessToken, expiresIn } = await requestAccessToken(
        location.origin,
        code
      );
      setAccessToken(accessToken);
      refresh(expiresIn);
    },
    signOut: () => {
      setAccessToken();
    },
  };
};

const refresh = async (expiresIn: number) => {
  setTimeout(async () => {
    const { accessToken, expiresIn } = await refreshAccessToken();
    setAccessToken(accessToken);
    refresh(expiresIn);
  }, expiresIn * 950);
};
