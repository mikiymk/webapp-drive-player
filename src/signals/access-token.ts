import { createSignal } from "solid-js";

import { requestAccessToken } from "~/api/google/auth";
import { initClient } from "~/api/google/init";

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
        code,
      );
      setAccessToken(accessToken);
      refresh(expiresIn);
    },
    signOut: () => {
      setAccessToken();
    },
  };
};

const refresh = (expiresIn: number) => {
  setTimeout(() => {
    requestAccessToken()
      .then(({ accessToken, expiresIn }) => {
        setAccessToken(accessToken);
        refresh(expiresIn);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, expiresIn * 950);
};
