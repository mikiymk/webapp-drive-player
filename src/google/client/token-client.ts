/* eslint-disable camelcase */

import {
  boolToStr,
  addMessageEventListener,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
  buildQueriedUri,
} from "./common";

import type { AuthClient } from "./common";

type PromptType = "" | "none" | "consent" | "select_account";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  hd: string;
  prompt: PromptType;
  token_type: string;
  scopes: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

type TokenClientConfig = {
  clientId: string;
  callback: (this: TokenClient, response: TokenResponse) => void;
  scope: string;
  prompt?: PromptType;
  enableSerialConsent?: boolean;
  hint?: string;
  hostedDomain?: string;
  state?: string;
};

type TokenClientQuery = {
  clientId: string;
  scope: string;
  prompt: PromptType | undefined;
  enableSerialConsent: boolean | undefined;
  includeGrantedScopes: undefined;
  hint: string | undefined;
  hostedDomain: string | undefined;
  state: string | undefined;

  redirect_uri?: string;
};

type OverridableTokenClientConfig = {
  prompt?: PromptType;
  enableSerialConsent?: boolean;
  hint?: string;
  state?: string;
};

const tokenTarget = "g_auth_token_window";

export class TokenClient implements AuthClient {
  authUniqueId: string | undefined;
  isListens: boolean;
  query: TokenClientQuery;
  callback: (this: TokenClient, response: TokenResponse) => void;

  constructor(config: TokenClientConfig) {
    this.authUniqueId = undefined;
    this.isListens = false;
    this.query = normalize(config);

    this.callback = config.callback;
  }

  onMessage(response: TokenResponse) {
    this.callback.call(this, response);
  }

  requestAccessToken(config?: OverridableTokenClientConfig) {
    let query = this.query;
    config = config || {};
    query = {
      clientId: query.clientId,
      scope: query.scope,
      prompt: void 0 === config.prompt ? query.prompt : config.prompt,
      hint: void 0 === config.hint ? query.hint : config.hint,
      state: void 0 === config.state ? query.state : config.state,
      hostedDomain: query.hostedDomain,
      includeGrantedScopes: query.includeGrantedScopes,
      enableSerialConsent:
        void 0 === config.enableSerialConsent
          ? query.enableSerialConsent
          : config.enableSerialConsent,
    };

    addMessageEventListener(this);
    this.authUniqueId = uniqueKey();

    query.redirect_uri = getRedirectUri(this.authUniqueId);
    openAuthWindow(buildAuthUrl(query), tokenTarget);
  }
}

const normalize = (config: TokenClientConfig): TokenClientQuery => ({
  clientId: config.clientId,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hostedDomain: config.hostedDomain,
  includeGrantedScopes: undefined,
  enableSerialConsent: config.enableSerialConsent,
  prompt: config.prompt,
});

const buildAuthUrl = (query: TokenClientQuery): string =>
  buildQueriedUri([
    ["gsiwebsdk", "3"],
    ["client_id", query.clientId],
    ["scope", query.scope],
    ["redirect_uri", query.redirect_uri],
    ["prompt", query.prompt ?? "select_account"],
    ["login_hint", query.hint],
    ["state", query.state],
    ["access_type", undefined],
    ["hd", query.hostedDomain],
    ["response_type", "token"],
    ["include_granted_scopes", boolToStr(query.includeGrantedScopes)],
    ["enable_serial_consent", boolToStr(query.enableSerialConsent)],
  ]);
