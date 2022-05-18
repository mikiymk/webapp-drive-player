import { createSignal } from "solid-js";

import { initClient } from "~/google/init";

const useSignIn = () => {
  const [accessToken, setAccessToken] = createSignal<string>();
  const client = initClient();

  return {
    accessToken,
    signIn: () =>
      client
        .requestAccessToken()
        .then(response => setAccessToken(response.access_token)),
    signOut: () => setAccessToken(),
  };
};

export default useSignIn;
