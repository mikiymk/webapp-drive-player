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

    req.on("error", () => reject(""));

    req.write(body);
    req.end();
  });

export default async (apiReq: VercelRequest, apiRes: VercelResponse) => {
  const code = apiReq.cookies["code"] ?? apiReq.query["code"];
  const redirectUri =
    apiReq.cookies["redirect_uri"] ??
    apiReq.query["redirect_uri"] ??
    "https://iron-ragdoll.vercel.app/";

  if (code)
    apiRes.setHeader(
      "Set-Cookie",
      `code=${code}; SameSite=Strict; Secure; HttpOnly;`
    );
  apiRes.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  apiRes.setHeader("Access-Control-Allow-Methods", "GET");

  let response;
  try {
    response = await requestAuth(code as string, redirectUri as string);
  } catch {
    response = "";
  }

  apiRes.status(200).send(response);
};
