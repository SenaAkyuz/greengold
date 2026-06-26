import type { Strings } from './strings';

// lang-switch carries data-en-href / data-tr-href overrides that script.js
// reads (for posts whose slug differs per locale, or where one locale is
// missing and we fall back to the /blog index). hrefs are also set directly so
// it works without JS.
export default function Topbar({
  s,
  enHref,
  trHref,
}: {
  s: Strings;
  enHref: string;
  trHref: string;
}) {
  return (
    <div className="topbar">
      <div className="container">
        <div className="left">
          <a href={s.topbar.mail}>{s.topbar.contact}</a>
        </div>
        <div className="right">
          <a href={s.topbar.phoneHref}>{s.topbar.phoneLabel}</a>
          <div
            className="lang-switch"
            aria-label={s.topbar.langAria}
            data-en-href={enHref}
            data-tr-href={trHref}
          >
            <a data-lang="en" href={enHref}>
              EN
            </a>
            <span aria-hidden="true">/</span>
            <a data-lang="tr" href={trHref}>
              TR
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
