import { createSignal } from "solid-js";

import { initClient } from "~/google/init";
import { refreshAccessToken, requestAccessToken } from "~/google/request-token";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  return {
    signIn: async () => {
      console.log("sign in 1 request code start");
      const { code } = await client.requestCode();
      console.log("sign in 1 request code end");

      console.log("sign in 2 request token start");
      const { accessToken, refreshToken, expiresIn } = await requestAccessToken(
        code,
        location.origin
      );
      console.log("sign in 2 request token end");
      setAccessToken(accessToken);

      window.setInterval(async () => {
        const { accessToken } = await refreshAccessToken(refreshToken);
        setAccessToken(accessToken);
      }, expiresIn * 950);
    },
    signOut: () => {
      setAccessToken();
    },
  };
};
