import {
  boolToStr,
  addMessageEventListener,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
  buildQueriedUri,
  validateRedirectUrl,
} from "./common";

import { PromiseCallBack } from "./promise-callback";

import type { AuthClient } from "./common";

type CodeResponse = {
  code: string;
  scope: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

type PopupCodeClientConfig = {
  clientId: string;
  scope: string;

  redirectUri?: string;

  state?: string;
  enableSerialConsent?: boolean;
  hint?: string;
  hostedDomain?: string;
  selectAccount?: boolean;
};

type RedirectCodeClientConfig = {
  clientId: string;
  scope: string;

  redirectUri: string;

  state?: string;
  enableSerialConsent?: boolean;
  hint?: string;
  hostedDomain?: string;
  selectAccount?: boolean;
};

type PopupCodeClientQuery = {
  clientId: string;
  scope: string;
  hint: string | undefined;
  state: string | undefined;
  hostedDomain: string | undefined;
  includeGrantedScopes: undefined;
  enableSerialConsent: boolean | undefined;
  selectAccount: boolean | undefined;
  redirectUri?: string;
};

type RedirectCodeClientQuery = {
  clientId: string;
  scope: string;
  hint: string | undefined;
  state: string | undefined;
  hostedDomain: string | undefined;
  includeGrantedScopes: undefined;
  enableSerialConsent: boolean | undefined;
  selectAccount: boolean | undefined;
  redirectUri?: string;
};

const codeTarget = "g_auth_code_window";

export class PopupCodeClient implements AuthClient {
  authUniqueId: string | undefined;
  isListens: boolean;
  query: PopupCodeClientQuery;

  constructor(config: PopupCodeClientConfig) {
    this.authUniqueId = undefined;
    this.isListens = false;
    this.query = normalizePopup(config);
  }

  requestCode() {
    const query = this.query;

    const promiseCallback = new PromiseCallBack<CodeResponse>();
    addMessageEventListener(this, response =>
      promiseCallback?.resolve(response as CodeResponse)
    );

    this.authUniqueId = uniqueKey();
    query.redirectUri = getRedirectUri(this.authUniqueId);
    openAuthWindow(buildAuthUrl(query), codeTarget);

    return promiseCallback.promise;
  }
}

export class RedirectCodeClient {
  query: RedirectCodeClientQuery;

  constructor(config: RedirectCodeClientConfig) {
    this.query = normalizeRedirect(config);
  }

  requestCode() {
    window.location.assign(validateRedirectUrl(buildAuthUrl(this.query)));
  }
}

const normalizePopup = (
  config: PopupCodeClientConfig
): PopupCodeClientQuery => ({
  clientId: config.clientId,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hostedDomain: config.hostedDomain,
  includeGrantedScopes: undefined,
  enableSerialConsent: config.enableSerialConsent,
  selectAccount: config.selectAccount,
});

const normalizeRedirect = (
  config: RedirectCodeClientConfig
): RedirectCodeClientQuery => ({
  clientId: config.clientId,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hostedDomain: config.hostedDomain,
  includeGrantedScopes: undefined,
  enableSerialConsent: config.enableSerialConsent,

  selectAccount: config.selectAccount,
  redirectUri:
    config.redirectUri ||
    location.protocol + "//" + location.host + location.pathname,
});

const buildAuthUrl = (query: PopupCodeClientQuery): string =>
  buildQueriedUri([
    ["gsiwebsdk", "3"],
    ["client_id", query.clientId],
    ["scope", query.scope],
    ["redirect_uri", query.redirectUri],
    ["prompt", query.selectAccount ? "select_account consent" : "consent"],
    ["login_hint", query.hint],
    ["state", query.state],
    ["access_type", "offline"],
    ["hd", query.hostedDomain],
    ["response_type", "code"],
    ["include_granted_scopes", boolToStr(query.includeGrantedScopes)],
    ["enable_serial_consent", boolToStr(query.enableSerialConsent)],
  ]);