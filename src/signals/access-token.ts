import { createSignal } from "solid-js";

import { initClient } from "~/google/init";

const [accessToken, setAccessToken] = createSignal<string>();
export { accessToken };

export const useSignIn = () => {
  const client = initClient();

  return {
    signIn: async () => {
      const response = await client.requestAccessToken();
      setAccessToken(response.access_token);
    },
    signOut: () => setAccessToken(),
  };
};
