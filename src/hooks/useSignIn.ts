import { useState, useEffect } from "react";
import { initClient } from "~/google/init";
import { TokenClient } from "~/google/TokenClient";

const useSignIn = () => {
  const [accessToken, setAccessToken] = useState("");
  const [client, setClient] = useState<TokenClient>();

  useEffect(() => {
    const client = initClient();

    setClient(client);
  }, []);

  return {
    accessToken,
    isSignIn: accessToken.length !== 0,
    signIn: () =>
      client
        ?.requestAccessToken()
        .then(response => setAccessToken(response.access_token)),
    signOut: () => setAccessToken(""),
  };
};

export default useSignIn;
