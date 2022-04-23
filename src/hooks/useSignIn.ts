import { useState, useEffect } from "react";

import { signOut, signIn, loadAndInit } from "~/google-api/init";

const useSignIn = () => {
  const [isSignIn, setSignIn] = useState(false);

  useEffect(() => {
    loadAndInit(isSignedIn => setSignIn(isSignedIn));
  }, []);

  return {
    isSignIn,
    signIn,
    signOut,
  };
};

export default useSignIn;
