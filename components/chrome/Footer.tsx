import type { Strings } from './strings';

export default function Footer({ s }: { s: Strings }) {
  const f = s.footer;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="logo">
              <img
                className="logo__img"
                src="/logo_final_r1.avif"
                alt="Green Gold Foundation"
                width={46}
                height={46}
              />
              <span className="logo__word">
                GREEN GOLD<span>FOUNDATION</span>
              </span>
            </div>
            <p>{f.brand}</p>
            <div className="footer__social">
              <a href="https://x.com/greengoldglobal" target="_blank" rel="noopener" aria-label="Twitter">
                𝕏
              </a>
              <a
                href="https://www.linkedin.com/company/green-gold-foundation-global"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://www.instagram.com/foundationgreengold/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                ◎
              </a>
              <a href="https://www.youtube.com/@GreenGoldFoundation" target="_blank" rel="noopener" aria-label="YouTube">
                ▶
              </a>
            </div>
          </div>
          <div>
            <h5>{f.solutions}</h5>
            <ul>
              <li>
                <a href={f.href.carbonMeasurement}>{f.carbonMeasurement}</a>
              </li>
              <li>
                <a href={f.href.carbonCredits}>{f.carbonCreditMarket}</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>{f.resources}</h5>
            <ul>
              <li>
                <a href={f.href.faq}>{f.faq}</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>{f.company}</h5>
            <ul>
              <li>
                <a href={f.href.about}>{f.about}</a>
              </li>
              <li>
                <a href={f.href.mission}>{f.missionImpact}</a>
              </li>
              <li>
                <a href={f.href.events}>{f.events}</a>
              </li>
              <li>
                <a href={s.topbar.mail}>{f.contact}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <div>{f.rights}</div>
          <div className="legal">
            <a href={f.href.legalNotice}>{f.legalNotice}</a>
            <a href={f.href.privacy}>{f.privacy}</a>
            <a href={f.href.cookiePolicy}>{f.cookiePolicy}</a>
            <a href={f.href.terms}>{f.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
