import { generateUrl } from "./generateUrl";

interface AccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

/**
 * 認証コードやリフレッシュトークンとアクセストークンを交換する
 * @param redirectUri 認証コードの交換に使用するリダイレクトURI文字列
 * @param code 認証コード
 * @returns 成功した場合はアクセストークンを含むオブジェクト
 * @throws {Error} 認証が失敗した場合
 */
export const requestAccessToken = async (
  redirectUri?: string,
  code?: string,
): Promise<AccessTokenResponse> => {
  const url = generateUrl("/api/token", [["redirect_uri", redirectUri]]);
  const request = new Request(url, { method: "POST", body: code ?? null });
  const response = await fetch(request);

  const json = (await response.json()) as
    | {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
        token_type: string;
      }
    | { requestError: string };
  if (!("access_token" in json)) {
    throw new Error(json.requestError);
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
