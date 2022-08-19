class ld {
  Vc: (a: string) => boolean;
  constructor(a: (a: string) => boolean) {
    this.Vc = a;
  }
}

const md = function (a: string) {
  return new ld(function (b) {
    return b.substr(0, a.length + 1).toLowerCase() === a + ":";
  });
};

const df = [
  md("data"),
  md("http"),
  md("https"),
  md("mailto"),
  md("ftp"),
  new ld(function (a) {
    return /^[^:]*([/?#]|$)/.test(a);
  }),
];

export const Xk = function (a: string) {
  for (let c = 0; c < df.length; ++c) {
    const d = df[c];
    if (d instanceof ld && d.Vc(a)) {
      return a;
    }
  }

  return bb;
};

export const co = function (a: string[], b: string, c?: string | undefined) {
  c && a.push(b + "=" + encodeURIComponent(c.trim()));
};

export const boolToStr = (a: boolean | undefined) =>
  false === a ? "false" : "true";

export const uniqueKey = () => "auth" + Math.floor(1e6 * Math.random() + 1);

export const mp = function (a: string) {
  let c = location.protocol;
  const d = location.host;
  const e = c.indexOf(":");
  if (0 < e) {
    c = c.substring(0, e);
  }

  return ["storagerelay://", c, "/", d, "?", "id=" + a].join("");
};

const Sk = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
const sl = /^data:(.*);base64,[a-z0-9+/]+=*$/i;
const bb = "about:invalid#zClosurez";

export const tl = function (a: string, b: string) {
  const c = Math.min(500, screen.width - 40);
  const d = Math.min(550, screen.height - 40);
  const k = [
    "toolbar=no",
    "location=no",
    "directories=no",
    "status=no",
    "menubar=no",
    "scrollbars=no",
    "resizable=no",
    "copyhistory=no",
    "width=" + c,
    "height=" + d,
    "top=" + (screen.height / 2 - d / 2),
    "left=" + (screen.width / 2 - c / 2),
  ].join();

  let i;
  if (Sk.test(a)) {
    i = a;
  } else {
    const j = String(a).replace(/(%0A|%0D)/g, "");
    i = j.match(sl) ? j : null;
  }

  const e = window.open(i || bb, b, k);
  if (!e || e.closed || "undefined" === typeof e.closed) {
    return null;
  }
  e.focus();
  return e;
};

type BaseResponse = {
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

export interface AuthClient {
  m: boolean;
  g: string | undefined;
  j: { client_id: string };

  l(a: BaseResponse): void;
}

export const lp = function (a: AuthClient) {
  if (a.m) return;
  a.m = true;
  window.addEventListener(
    "message",
    function (b) {
      try {
        if (!b.data) return;
        const c = JSON.parse(b.data).params;
        if (!c) return;
        if (!a.g || c.id !== a.g) return;
        if (c.clientId !== a.j.client_id) return;
        if ("authResult" !== c.type) return;
        a.g = undefined;
        a.l(c.authResult);
      } catch (d) {
        console.log(d);
      }
    },
    false
  );
};
