import type { Strings } from './strings';

// Markup + IDs match the legacy banner so the existing /script.js handler
// (consent persistence via localStorage) drives it unchanged.
export default function CookieBanner({ s }: { s: Strings }) {
  const c = s.cookie;
  return (
    <div className="cookie-banner" id="cookieBanner" hidden>
      <p className="cookie-banner__text">
        {c.textBefore}
        <a href={c.href}>{c.link}</a>
        {c.textAfter}
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="btn btn--ghost" id="cookieReject">
          {c.reject}
        </button>
        <button type="button" className="btn btn--primary" id="cookieAccept">
          {c.accept}
        </button>
      </div>
    </div>
  );
}
