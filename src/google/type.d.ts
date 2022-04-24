declare namespace google.accounts.oauth2 {
  export function initTokenClient(options: Options): TokenClient;
}

interface Options {
  client_id: string;
  scope: string;
  callback: (responce: Responce) => void;
}
interface TokenClient {
  requestAccessToken: (options?: Options) => void;
}
interface Responce {
  access_token: string;
  expires_in: number;
}
