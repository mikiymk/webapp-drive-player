import { createSignal } from "solid-js";

import { initClient } from "~/google/init";
import { requestAccessToken } from "~/google/request-access-token";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  return {
    signIn: async () => {
      const { code } = await client.requestCode();
      const { access_token: token } = await requestAccessToken(code);
      setAccessToken(token);
    },
    signOut: () => setAccessToken(),
  };
};
