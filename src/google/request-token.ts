type AccessTokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
};

export const requestAccessToken = async (
  code: string
): Promise<AccessTokenResponse> => {
  const response = await fetch(
    "https://iron-ragdoll.vercel.app/api/token?code=" + code
  );
  const json = await response.json();
  if (!("access_token" in json)) {
    throw new Error("authorize failure");
  }

  return snake2camel(json) as AccessTokenResponse;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<AccessTokenResponse> => {
  const response = await fetch(
    "https://iron-ragdoll.vercel.app/api/refresh?refresh_token=" + refreshToken
  );
  const json = await response.json();
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
