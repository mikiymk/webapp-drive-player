export type ClientType = "code" | "token";

export type BaseResponse = {
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

export type BaseClientConfig = {
  auth_url?: string;
};

export abstract class AbstractClient {
  i: string;
  g: string | undefined;
  h: ClientType;
  m: boolean;

  constructor(a: ClientType, b: BaseClientConfig) {
    this.i = b.auth_url || "https://accounts.google.com/o/oauth2/auth";
    this.g = undefined;
    this.h = a;
    this.m = false;
  }

  abstract l(a: BaseResponse): void;
}
