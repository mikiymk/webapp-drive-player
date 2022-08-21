import { request } from "https";

import type { VercelRequest, VercelResponse } from "@vercel/node";

const requestAuth = (code: string, redirectUri: string) =>
  new Promise((resolve, reject) => {
    const body = [
      "code=" + code,
      "client_id=" + process.env["CLIENT_ID"],
      "client_secret=" + process.env["CLIENT_SECRET"],
      "redirect_uri=" + redirectUri,
      "grant_type=authorization_code",
    ].join("&");

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
        res.on("data", data => resolve(data));
        res.on("end", () => reject(""));
      }
    );

    req.on("error", error =>
      resolve(JSON.stringify({ requestError: error.message }))
    );

    req.write(body);
    req.end();
  });

export default async (apiReq: VercelRequest, apiRes: VercelResponse) => {
  const code = apiReq.query["code"] ?? apiReq.cookies["code"];
  const redirectUri = apiReq.query["redirect_uri"];

  if (code) {
    apiRes.setHeader(
      "Set-Cookie",
      `code=${code}; SameSite=Strict; Secure; HttpOnly;`
    );
  }

  if (!redirectUri) {
    apiRes
      .status(200)
      .send(JSON.stringify({ requestError: "redirect_uri required" }));
  }

  let response;
  try {
    response = await requestAuth(code as string, redirectUri as string);
  } catch (error) {
    response = String(error);
  }

  apiRes.status(200).send(response);
};
