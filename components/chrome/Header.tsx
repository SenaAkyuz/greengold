import type { Strings } from './strings';

export default function Header({ s, active }: { s: Strings; active?: 'blog' }) {
  const h = s.header;
  return (
    <header className="header">
      <div className="container header__bar">
        <a href={h.logoHref} className="logo" lang="en" aria-label="Green Gold Foundation">
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
        </a>

        <a
          className="btn btn--ghost seg-esg"
          href={h.esgHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {h.esgLabel}
        </a>

        <button
          className="nav-toggle"
          id="navToggle"
          aria-label={h.menuOpen}
          aria-expanded="false"
          aria-controls="primaryNav"
        >
          <span className="nav-toggle__bar"></span>
          <span className="nav-toggle__bar"></span>
          <span className="nav-toggle__bar"></span>
        </button>

        <nav className="nav" id="primaryNav" aria-label={h.navAria}>
          <ul>
            <li className="nav-esg-m">
              <a href={h.esgHref} target="_blank" rel="noopener noreferrer">
                {h.esgLabel}
              </a>
            </li>
            <li>
              <a href={h.href.climateMembership}>{h.nav.climateMembership}</a>
            </li>
            <li>
              <a role="button" tabIndex={0}>
                {h.nav.projects} <span className="chev"></span>
              </a>
              <div className="mega">
                <div className="feature">
                  <span className="tag">{h.mega.tag}</span>
                  <h5>{h.mega.h5}</h5>
                  <p>{h.mega.p}</p>
                  <a className="btn btn--dark" href={h.href.wings}>
                    {h.mega.discover}
                  </a>
                </div>
                <div className="col-list">
                  <h4>{h.mega.ourProjects}</h4>
                  <a href={h.href.wings}>Green Gold Wings</a>
                  <a href={h.href.wheels}>Green Gold Wheels</a>
                  <a href={h.href.stay}>Green Gold Stay</a>
                </div>
              </div>
            </li>
            <li>
              <a href={h.href.mission}>{h.nav.mission}</a>
            </li>
            <li>
              <a href={h.href.about}>{h.nav.about}</a>
            </li>
            <li>
              <a href={h.href.takeAction}>{h.nav.takeAction}</a>
            </li>
            <li>
              <a href={h.href.donate}>{h.nav.donate}</a>
            </li>
            <li>
              <a href={h.href.carbonCredits}>{h.nav.carbonCredits}</a>
            </li>
            <li>
              <a href={h.href.blog} className={active === 'blog' ? 'active' : undefined}>
                {h.nav.blog}
              </a>
            </li>
          </ul>
        </nav>

        <div className="header__cta">
          <a href={s.topbar.mail} className="btn btn--ghost">
            {h.requestDemo}
          </a>
        </div>
      </div>
    </header>
  );
}
