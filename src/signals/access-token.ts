import { createSignal } from "solid-js";

import { initClient } from "~/google/init";
import { refreshAccessToken, requestAccessToken } from "~/google/request-token";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  let intervalId: number;

  return {
    signIn: async () => {
      const { code } = await client.requestCode();
      const { accessToken, refreshToken, expiresIn } = await requestAccessToken(
        code
      );
      setAccessToken(accessToken);

      if (intervalId) window.clearInterval(intervalId);
      intervalId = window.setInterval(async () => {
        const { accessToken } = await refreshAccessToken(refreshToken);
        setAccessToken(accessToken);
      }, expiresIn * 950);
    },
    signOut: () => setAccessToken(),
  };
};
