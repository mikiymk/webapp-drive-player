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
  const url = generateUrl("/api/token", [
    ["redirect_uri", redirectUri],
    ["code", code],
  ]);
  const response = await fetch(url);
  const {
    access_token: accessToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope,
    token_type: tokenType,
  } = (await response.json()) as {
    access_token?: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
  if (accessToken === undefined) {
    throw new Error("authorize failure");
  }

  return {
    accessToken,
    expiresIn,
    refreshToken,
    scope,
    tokenType,
  };
};
