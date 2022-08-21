type AccessTokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
};

export const requestAccessToken = async (
  redirectUri: string,
  code?: string
): Promise<AccessTokenResponse> => {
  const url =
    "/api/token?redirect_uri=" + redirectUri + (code ? "&code=" + code : "");
  const response = await fetch(url);
  const json = await response.json();
  console.log("request response", json);
  if (!("access_token" in json)) {
    throw new Error("authorize failure");
  }

  return snake2camel(json) as AccessTokenResponse;
};

export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
  const response = await fetch("/api/refresh");
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
