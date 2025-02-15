import type { PromiseCallBack } from "./promise-callback";

const validateScheme = (scheme: string, uri: string) =>
  uri.slice(0, scheme.length + 1).toLowerCase() === `${scheme}:`;

const validSchemes = ["data", "http", "https", "mailto", "ftp"];

export const validateRedirectUrl = (uri: string) => {
  for (const scheme of validSchemes) {
    if (validateScheme(scheme, uri)) {
      return uri;
    }
  }

  if (/^[^:]*([/?#]|$)/.test(uri)) {
    return uri;
  }

  return invalidUrl;
};

export const pushIfDefined = (array: string[], key: string, value?: string) => {
  if (value) array.push(`${key}=${encodeURIComponent(value.trim())}`);
};

export const boolToStr = (bool: boolean | undefined) =>
  false === bool ? "false" : "true";

export const uniqueKey = () => {
  return `auth${String(Math.floor(1e6 * Math.random() + 1))}`;
};

export const getRedirectUri = (a: string) => {
  let c = location.protocol;
  const d = location.host;
  const e = c.indexOf(":");
  if (0 < e) {
    c = c.substring(0, e);
  }

  return `storagerelay://${c}/${d}?id=${a}`;
};

const validUri = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
const validDataUri = /^data:(.*);base64,[a-z0-9+/]+=*$/i;
const invalidUrl = "about:invalid#zClosurez";

const validatePopUpUrl = (url: string) => {
  if (validUri.test(url)) {
    return url;
  }
  const noSpaceUrl = String(url).replace(/(%0A|%0D)/g, "");
  return validDataUri.exec(noSpaceUrl) ? noSpaceUrl : invalidUrl;
};

export const buildQueriedUri = (
  query: [key: string, value: string | undefined][],
) =>
  `https://accounts.google.com/o/oauth2/auth?${query
    .flatMap(([key, value]) =>
      value ? [`${key}=${encodeURIComponent(value.trim())}`] : [],
    )
    .join("&")}`;

export const openAuthWindow = <T>(
  url: string,
  target: string,
  promise: PromiseCallBack<T>,
) => {
  const width = Math.min(500, screen.width - 40);
  const height = Math.min(550, screen.height - 40);
  const features = [
    "toolbar=no",
    "location=no",
    "directories=no",
    "status=no",
    "menubar=no",
    "scrollbars=no",
    "resizable=no",
    "copyhistory=no",
    `width=${String(width)}`,
    `height=${String(height)}`,
    `top=${String(screen.height / 2 - height / 2)}`,
    `left=${String(screen.width / 2 - width / 2)}`,
  ].join();

  const authWindow = window.open(validatePopUpUrl(url), target, features);
  if (!authWindow || authWindow.closed) return undefined;

  authWindow.focus();
  authWindow.onclose = () => {
    promise.reject("window closed");
  };
  return authWindow;
};

interface BaseResponse {
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
}

export interface AuthClient {
  isListens: boolean;
  authUniqueId: string | undefined;
  query: { clientId: string };

  onMessage(response: BaseResponse): void;
}

export const addMessageEventListener = (client: AuthClient) => {
  if (client.isListens) return;
  client.isListens = true;

  window.addEventListener(
    "message",
    (event: { data: string }) => {
      try {
        if (!event.data) return;
        const { params } = JSON.parse(event.data) as {
          params?: {
            id: string;
            clientId: string;
            type: string;
            authResult: BaseResponse;
          };
        };
        if (!params) return;
        if (!client.authUniqueId || params.id !== client.authUniqueId) return;
        if (params.clientId !== client.query.clientId) return;
        if ("authResult" !== params.type) return;
        client.authUniqueId = undefined;
        client.onMessage(params.authResult);
      } catch (error) {
        console.log(error);
      }
    },
    false,
  );
};
