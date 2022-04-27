import { createSignal, onMount } from "solid-js";
import { initClient } from "~/google/init";
import { TokenClient } from "~/google/TokenClient";

const useSignIn = () => {
  const [accessToken, setAccessToken] = createSignal("");
  const [client, setClient] = createSignal<TokenClient>();

  onMount(() => {
    const client = initClient();

    setClient(client);
  });

  return {
    accessToken: accessToken(),
    isSignIn: accessToken().length !== 0,
    signIn: () =>
      client()
        ?.requestAccessToken()
        .then(response => setAccessToken(response.access_token)),
    signOut: () => setAccessToken(""),
  };
};

export default useSignIn;
