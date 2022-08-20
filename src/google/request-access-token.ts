type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export const requestAccessToken = async (
  code: string
): Promise<AccessTokenResponse> => {
  const response = await fetch(
    "https://iron-ragdoll.vercel.app/api/token?code=" + code
  );
  const json = await response.json();
  if ("access_token" in json) {
    throw new Error("authorize failure");
  }
  return json;
};
