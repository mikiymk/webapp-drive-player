import { createSignal } from "solid-js";

import { initClient } from "~/google/init";
import { refreshAccessToken, requestAccessToken } from "~/google/request-token";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  const code = getSearch("code");
  if (code) {
    console.log("sign in 2 request token start");
    requestAccessToken(code, location.origin).then(
      ({ accessToken, refreshToken, expiresIn }) => {
        console.log("sign in 2 request token end");
        setAccessToken(accessToken);

        window.setInterval(async () => {
          const { accessToken } = await refreshAccessToken(refreshToken);
          setAccessToken(accessToken);
        }, expiresIn * 950);
      }
    );
  }

  return {
    signIn: async () => {
      console.log("sign in 1 request code start");
      client.requestCode();
      console.log("sign in 1 request code end");
    },
    signOut: () => {
      setAccessToken();
    },
  };
};

const getSearch = (key: string) => {
  return location.search
    .slice(1)
    .split("&")
    .map(s => s.split("="))
    .find(([s]) => s === key)?.[1];
};
