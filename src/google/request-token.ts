type AccessTokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
};

export const requestAccessToken = async (
  code: string,
  redirectUri: string
): Promise<AccessTokenResponse> => {
  const url = "/api/token" + "?code=" + code + "&redirect_uri=" + redirectUri;
  const response = await fetch(url);
  const json = await response.json();
  console.log("request response", json);
  if (!("access_token" in json)) {
    throw new Error("authorize failure");
  }

  return snake2camel(json) as AccessTokenResponse;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<AccessTokenResponse> => {
  const response = await fetch("/api/refresh?refresh_token=" + refreshToken);
  const json = await response.json();
  console.log("refresh response", json);
  if (!("access_token" in json)) {
    throw new Error("authorize failure");
  }

  return snake2camel(json) as AccessTokenResponse;
};

const snake2camel = (json: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(json).map(([k, v]) => [
      k.replace(/_+(.?)/g, (_, p1) => p1.toUpperCase()),
      v,
    ])
  );
};
