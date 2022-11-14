import { request } from "https";

import type { VercelRequest, VercelResponse } from "@vercel/node";

const tokenAge = 60 * 60 * 24 * 30;

interface AuthCodeResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface AuthRefreshResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface AuthErrorResponse {
  error: string;
  error_description: string;
}

interface RequestError {
  requestError: string;
}

type AuthResponse = AuthCodeResponse | AuthRefreshResponse | AuthErrorResponse;

const requestToken = (
  bodies: string[],
): Promise<AuthResponse | RequestError> => {
  return new Promise((resolve) => {
    const body = bodies.join("&");

    const req = request(
      {
        host: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        res.on("data", (data: string) =>
          resolve(JSON.parse(data) as AuthResponse),
        );
        res.on("end", () => resolve({ requestError: "end of response" }));
      },
    );

    req.on("error", (error) => resolve({ requestError: error.message }));

    req.write(body);
    req.end();
  });
};

const exchangeToken = (
  code: string,
  redirectUri: string,
): Promise<AuthResponse | RequestError> | undefined => {
  const clientId = process.env["CLIENT_ID"];
  const clientSecret = process.env["CLIENT_SECRET"];
  if (clientId === undefined) return;
  if (clientSecret === undefined) return;

  return requestToken([
    `code=${code}`,
    `client_id=${clientId}`,
    `client_secret=${clientSecret}`,
    `redirect_uri=${redirectUri}`,
    "grant_type=authorization_code",
  ]);
};

const refresh = (
  refreshToken: string,
): Promise<AuthResponse | RequestError> | undefined => {
  const clientId = process.env["CLIENT_ID"];
  const clientSecret = process.env["CLIENT_SECRET"];
  if (clientId === undefined) return;
  if (clientSecret === undefined) return;
  return requestToken([
    `refresh_token=${refreshToken}`,
    `client_id=${clientId}`,
    `client_secret=${clientSecret}`,
    "grant_type=refresh_token",
  ]);
};

const setRefreshTokenCookie = (refreshToken: string) => {
  return `refresh_token=${refreshToken}; SameSite=Strict; Secure; HttpOnly; Max-Age=${tokenAge};`;
};

const requestAuth = async (
  code: string | undefined,
  redirectUri: string | undefined,
): Promise<AuthResponse | RequestError | undefined> => {
  if (code && redirectUri) return exchangeToken(code, redirectUri);

  // missing required parameter
  return {
    requestError: "missing required parameter: code, refresh_token",
  };
};

export default async (apiReq: VercelRequest, apiRes: VercelResponse) => {
  let t;
  const code = typeof (t = apiReq.query["code"]) === "string" ? t : t?.[0];
  const redirectUri =
    typeof (t = apiReq.query["redirect_uri"]) === "string" ? t : t?.[0];
  const refreshToken = apiReq.cookies["refresh_token"];

  const cookies: string[] = [];

  let response;
  if (refreshToken) {
    cookies.push(setRefreshTokenCookie(refreshToken));

    response = await refresh(refreshToken);
  }

  if (!response || "requestError" in response) {
    response = await requestAuth(code, redirectUri);

    if (response && "refresh_token" in response) {
      cookies.push(setRefreshTokenCookie(response.refresh_token));
    }
  }

  apiRes.setHeader("Set-Cookie", cookies);
  apiRes.status(200).send(response);
};
