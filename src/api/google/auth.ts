interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export const requestAccessToken = async (
  redirectUri: string,
  code?: string,
): Promise<AccessTokenResponse> => {
  const url =
    "/api/token?redirect_uri=" + redirectUri + (code ? "&code=" + code : "");
  const response = await fetch(url);
  const json = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
  console.log("request response", json);
  if (!("access_token" in json)) {
    throw new Error("authorize failure");
  }

  const {
    access_token: accessToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope,
    token_type: tokenType,
  } = json;
  return {
    accessToken,
    expiresIn,
    refreshToken,
    scope,
    tokenType,
  };
};

export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
  const response = await fetch("/api/token");
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
      k.replace(/_+(.?)/g, (_, p1: string) => p1.toUpperCase()),
      v,
    ]),
  );
};
