import { createSignal } from "solid-js";

import { initClient } from "~/google/init";
import { refreshAccessToken, requestAccessToken } from "~/google/request-token";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  let code: string;
  let intervalId: number;

  return {
    signIn: async () => {
      if (!code) {
        console.log("sign in 1 request code start");
        const codes = await client.requestCode();
        console.log("sign in 1 request code end");
        code = codes.code;
      }
      console.log("sign in 2 request token start");
      const { accessToken, refreshToken, expiresIn } = await requestAccessToken(
        code
      );
      console.log("sign in 2 request token end");
      console.log("sign in 3 set token start");
      setAccessToken(accessToken);
      console.log("sign in 3 set token end");

      if (intervalId) window.clearInterval(intervalId);
      intervalId = window.setInterval(async () => {
        const { accessToken } = await refreshAccessToken(refreshToken);
        setAccessToken(accessToken);
      }, expiresIn * 950);
    },
    signOut: () => {
      code = "";
      setAccessToken();
    },
  };
};
