import { request } from "https";

import type { VercelRequest, VercelResponse } from "@vercel/node";

const accessCodeAge = 60 * 60 * 24 * 30;
const refreshTokenAge = 60 * 60 * 24;

type RequestError = { requestError: string };
type AuthResponse =
  | {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      token_type: string;
    }
  | {
      access_token: string;
      expires_in: number;
      scope: string;
      token_type: string;
    }
  | {
      error: string;
      error_description: string;
    };

const requestToken = (
  bodies: string[]
): Promise<AuthResponse | RequestError> => {
  return new Promise(resolve => {
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
      res => {
        res.on("data", data => resolve(JSON.parse(data) as AuthResponse));
        res.on("end", () => resolve({ requestError: "end of response" }));
      }
    );

    req.on("error", error => resolve({ requestError: error.message }));

    req.write(body);
    req.end();
  });
};

const exchangeToken = (
  code: string,
  redirectUri: string
): Promise<AuthResponse | RequestError> => {
  return requestToken([
    "code=" + code,
    "client_id=" + process.env["CLIENT_ID"],
    "client_secret=" + process.env["CLIENT_SECRET"],
    "redirect_uri=" + redirectUri,
    "grant_type=authorization_code",
  ]);
};

const refresh = (refreshToken: string) => {
  return requestToken([
    "refresh_token=" + refreshToken,
    "client_id=" + process.env["CLIENT_ID"],
    "client_secret=" + process.env["CLIENT_SECRET"],
    "grant_type=refresh_token",
  ]);
};

const setCodeCookie = (code: string) => {
  return `code=${code}; SameSite=Strict; Secure; HttpOnly; Max-Age=${accessCodeAge};`;
};

const setRefreshTokenCookie = (refreshToken: string) => {
  return `refresh_token=${refreshToken}; SameSite=Strict; Secure; HttpOnly; Max-Age=${refreshTokenAge};`;
};

const requestAuth = async (
  code: string | undefined,
  codeCookie: string | undefined,
  redirectUri: string | undefined
): Promise<AuthResponse | RequestError> => {
  if (code && redirectUri) return exchangeToken(code, redirectUri);
  if (codeCookie && redirectUri) return exchangeToken(codeCookie, redirectUri);

  // missing required parameter
  return {
    requestError: "missing required parameter: code, refresh_token",
  };
};

export default async (apiReq: VercelRequest, apiRes: VercelResponse) => {
  let t;
  const code = typeof (t = apiReq.query["code"]) === "string" ? t : t?.[0];
  const codeCookie = apiReq.cookies["code"];
  const redirectUri =
    typeof (t = apiReq.query["redirect_uri"]) === "string" ? t : t?.[0];
  const refreshToken = apiReq.cookies["refresh_token"];

  const cookies: string[] = [];

  // if (code) {
  //   cookies.push(setCodeCookie(code));
  // } else if (codeCookie) {
  //   cookies.push(setCodeCookie(codeCookie));
  // }

  let response;
  if (refreshToken) {
    cookies.push(setRefreshTokenCookie(refreshToken));

    response = await refresh(refreshToken);
  }

  if (!response || "requestError" in response) {
    response = await requestAuth(code, codeCookie, redirectUri);

    if ("refresh_token" in response) {
      cookies.push(setRefreshTokenCookie(response.refresh_token));
    }
  }

  apiRes.setHeader("Set-Cookie", cookies);
  apiRes.status(200).send(response);
};
