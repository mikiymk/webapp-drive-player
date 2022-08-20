import { request } from "https";

import type { VercelRequest, VercelResponse } from "@vercel/node";

const requestAuth = (code: string) =>
  new Promise((resolve, reject) => {
    const body = [
      "code=" + code,
      "client_id=" + process.env["CLIENT_ID"],
      "client_secret=" + process.env["CLIENT_SECRET"],
      "redirect_uri=https%3A%2F%2Firon-ragdoll.vercel.app%2F",
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
  const response = await requestAuth(code as string);

  if (code)
    apiRes.setHeader(
      "Set-Cookie",
      `code=${code}; SameSite=Strict; Secure; HttpOnly;`
    );
  apiRes.status(200).send(response);
};
