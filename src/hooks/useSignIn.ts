import { useState, useEffect } from "react";
import { initClient } from "~/google/init";

const useSignIn = () => {
  const [accessToken, setAccessToken] = useState("");
  const [client, setClient] = useState({ requestAccessToken: () => {} });

  useEffect(() => {
    const client = initClient(response =>
      setAccessToken(response.access_token)
    );

    setClient(client);
  }, []);

  return {
    accessToken,
    isSignIn: accessToken.length !== 0,
    signIn: () => client.requestAccessToken(),
    signOut: () => setAccessToken(""),
  };
};

export default useSignIn;
