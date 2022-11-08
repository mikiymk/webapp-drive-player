import { createSignal } from "solid-js";

import { refreshAccessToken, requestAccessToken } from "~/api/google/auth";
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
    void refreshAccessToken().then(({ accessToken, expiresIn }) => {
      setAccessToken(accessToken);
      refresh(expiresIn);
    });
  }, expiresIn * 950);
};
