/* =========================================================
   TERA GROUP — <tera-header> WEB COMPONENT
   
   Komponen header yang bisa dipakai di HTML biasa, Next.js, 
   maupun React — karena berbasis Custom Element (standar 
   browser), bukan spesifik ke 1 framework.
   
   CARA PAKAI:
   <script src="https://cdn.jsdelivr.net/gh/titohnf/design-system@main/tera-header.js"></script>
   
   <tera-header
     logo-text="Bimbel Tera"
     logo-img="/logo.png"
     logo-href="/"
     nav='[{"label":"Metode","href":"#metode"},{"label":"Hasil","href":"#bukti"}]'
     cta-text="DAFTAR →"
     cta-href="https://bit.ly/DaftarBimbelTera"
   ></tera-header>
   
   ATRIBUT:
   - logo-text   : teks di sebelah logo (wajib)
   - logo-img    : path/url gambar logo (opsional)
   - logo-href   : link saat logo diklik (default: "/")
   - nav         : JSON array {label, href, icon} untuk menu (wajib;
                   icon opsional, emoji ditaruh sebelum label). Link
                   yang diawali http(s):// otomatis kebuka di tab baru.
   - cta-text    : teks tombol CTA di ujung kanan (opsional,
                   kalau kosong tombol tidak muncul)
   - cta-href    : link tombol CTA (wajib kalau cta-text diisi)
   - nav-hover   : "underline" (default) atau "pill" — gaya hover menu.
                   Opt-in per situs, tidak mengubah default situs lain.
   
   Catatan: link ke 3 web TERA Group lain sengaja TIDAK ada di 
   header — itu sudah cukup di footer (kolom "Bagian dari Tera").
   ========================================================= */

// React Router / Next.js navigate client-side via history.pushState, which
// fires no browser event — patch it once (shared across every <tera-header>
// instance) so the header can re-check which link is "active" after an SPA
// navigation instead of only on first mount.
let teraHistoryPatched = false;
function patchHistoryOnce() {
  if (teraHistoryPatched) return;
  teraHistoryPatched = true;
  const notify = () => window.dispatchEvent(new Event('tera:locationchange'));
  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function (...args) {
    origPush.apply(this, args);
    notify();
  };
  history.replaceState = function (...args) {
    origReplace.apply(this, args);
    notify();
  };
  window.addEventListener('popstate', notify);
}

class TeraHeader extends HTMLElement {
  connectedCallback() {
    const logoText = this.getAttribute('logo-text') || 'Tera';
    const logoImg = this.getAttribute('logo-img') || '';
    const logoHref = this.getAttribute('logo-href') || '/';
    const navItems = JSON.parse(this.getAttribute('nav') || '[]');
    const ctaText = this.getAttribute('cta-text') || '';
    const ctaHref = this.getAttribute('cta-href') || '#';
    const navHover = this.getAttribute('nav-hover') || 'underline';

    const normalizePath = (p) => {
      if (!p) return '/';
      p = p.replace(/\/index\.html$/, '/');
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
      return p === '' ? '/' : p;
    };

    const isActiveHref = (href, currentNorm) => {
      const itemNorm = normalizePath(href);
      return !href.startsWith('#') && !href.startsWith('http') &&
        (itemNorm === currentNorm ||
         (itemNorm !== '/' && currentNorm.startsWith(itemNorm)));
    };

    const currentNorm = normalizePath(window.location.pathname);

    this.classList.toggle('nav-hover-pill', navHover === 'pill');

    const shadow = this.attachShadow({ mode: 'open' });

    const navHtml = navItems.map(item => {
      const isActive = isActiveHref(item.href, currentNorm);
      const isExternal = /^https?:\/\//.test(item.href);
      const targetAttr = isExternal ? ' target="_blank" rel="noopener"' : '';
      const iconHtml = item.icon ? `<span class="nav-icon">${item.icon}</span>` : '';
      return `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}"${targetAttr}>${iconHtml}${item.label}</a>`;
    }).join('');

    const ctaHtml = ctaText ? `<a href="${ctaHref}" class="cta">${ctaText}</a>` : '';
    const mobileCtaHtml = ctaText ? `<a href="${ctaHref}" class="cta mobile-cta">${ctaText}</a>` : '';

    shadow.innerHTML = `
      <style>
        :host {
          /* position:sticky lives on the host itself, not on the inner
             <header> — some Chromium versions fail to stick a shadow-DOM
             child when the host has display:block, so the host is made
             the sticky element directly instead. */
          display: block;
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: var(--font-sans, 'Inter', sans-serif);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        header {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(14px) saturate(1.6);
          -webkit-backdrop-filter: blur(14px) saturate(1.6);
          border-bottom: 1px solid transparent;
          box-shadow: none;
          transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        header.is-scrolled {
          background: rgba(255,255,255,0.86);
          border-bottom-color: var(--card-border, #e1e9fb);
          box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
        }
        .inner {
          max-width: var(--container-max, 1152px);
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 16px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 18px;
          color: var(--foreground, #101828);
        }
        .logo img {
          height: 32px;
          width: auto;
        }
        nav {
          display: flex;
          align-items: stretch;
          gap: 4px;
          flex-wrap: wrap;
        }
        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: rgba(16,24,40,0.72);
          padding: 8px 16px;
          transition: color 0.15s ease;
        }
        .nav-icon {
          font-size: 15px;
          line-height: 1;
          display: inline-flex;
        }
        .nav-icon svg {
          width: 16px;
          height: 16px;
          display: block;
        }
        .nav-link::after {
          /* bottom: -16px cancels out .inner's padding-bottom, so the
             indicator sits flush with the navbar's own bottom edge instead
             of floating a few pixels above it under the link text. */
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: -16px;
          height: 2px;
          border-radius: 2px;
          background: var(--primary, #0d6efd);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        .nav-link:hover {
          color: var(--primary-dark, #0b57d0);
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-link.active {
          color: var(--primary-dark, #0b57d0);
          font-weight: 700;
        }
        .nav-link.active::after {
          transform: scaleX(1);
        }
        /* opt-in via nav-hover="pill" — rounded background highlight
           instead of the default underline indicator. */
        :host(.nav-hover-pill) .nav-link {
          border-radius: var(--radius-pill, 9999px);
          transition: color 0.15s ease, background 0.15s ease;
        }
        :host(.nav-hover-pill) .nav-link::after {
          display: none;
        }
        :host(.nav-hover-pill) .nav-link:hover {
          background: var(--muted-bg, #eef4ff);
        }
        :host(.nav-hover-pill) .nav-link.active {
          background: var(--muted-bg, #eef4ff);
        }
        .cta {
          align-self: center;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-foreground, #fff);
          background: var(--primary, #0d6efd);
          padding: 10px 18px;
          border-radius: var(--radius-button, 4px);
          margin-left: 8px;
          transition: background 0.15s;
        }
        .cta:hover {
          background: var(--primary-dark, #0b57d0);
        }
        .mobile-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: var(--foreground, #101828);
        }
        .mobile-btn svg {
          width: 24px;
          height: 24px;
        }
        .mobile-btn .icon-close {
          display: none;
        }
        :host(.is-open) .mobile-btn .icon-menu {
          display: none;
        }
        :host(.is-open) .mobile-btn .icon-close {
          display: block;
        }
        .mobile-nav {
          display: none;
          flex-direction: column;
          gap: 2px;
          padding: 8px 24px 20px;
          border-top: 1px solid var(--card-border, #e1e9fb);
        }
        .mobile-nav .nav-link {
          padding: 12px 16px;
          border-radius: var(--radius-button, 4px);
        }
        .mobile-nav .nav-link::after {
          display: none;
        }
        .mobile-nav .nav-link.active {
          background: var(--muted-bg, #eef4ff);
        }
        .mobile-nav .mobile-cta {
          margin: 8px 16px 0;
          text-align: center;
        }
        @media (max-width: 768px) {
          nav { display: none; }
          .mobile-btn { display: flex; }
          :host(.is-open) .mobile-nav { display: flex; }
        }
      </style>
      <header>
        <div class="inner">
          <a href="${logoHref}" class="logo">
            ${logoImg ? `<img src="${logoImg}" alt="${logoText}">` : ''}
            <span>${logoText}</span>
          </a>
          <nav>
            ${navHtml}
            ${ctaHtml}
          </nav>
          <button class="mobile-btn" type="button" aria-label="Buka menu" aria-expanded="false">
            <svg class="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="mobile-nav">
          ${navHtml}
          ${mobileCtaHtml}
        </div>
      </header>
    `;

    // Sharpen the sticky header (stronger blur + shadow) once the page has
    // actually scrolled, so it stays a light glass sheen at the very top.
    const headerEl = shadow.querySelector('header');
    const updateScrolled = () => {
      headerEl.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    // Mobile menu: :host(.is-open) drives both the icon swap and the
    // .mobile-nav's display via CSS above, so JS only has to flip the class.
    const mobileBtn = shadow.querySelector('.mobile-btn');
    const closeMobileNav = () => {
      this.classList.remove('is-open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    };
    mobileBtn.addEventListener('click', () => {
      const isOpen = this.classList.toggle('is-open');
      mobileBtn.setAttribute('aria-expanded', String(isOpen));
    });
    shadow.querySelector('.mobile-nav').addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMobileNav();
    });
    const onResize = () => {
      if (window.innerWidth > 768) closeMobileNav();
    };
    window.addEventListener('resize', onResize);

    // Re-evaluate which link is "active" after client-side (SPA) navigation.
    patchHistoryOnce();
    const updateActiveLinks = () => {
      const norm = normalizePath(window.location.pathname);
      shadow.querySelectorAll('.nav-link').forEach((el, i) => {
        const item = navItems[i % navItems.length];
        el.classList.toggle('active', isActiveHref(item.href, norm));
      });
    };
    window.addEventListener('tera:locationchange', updateActiveLinks);
    this._teraCleanup = () => {
      window.removeEventListener('tera:locationchange', updateActiveLinks);
      window.removeEventListener('scroll', updateScrolled);
      window.removeEventListener('resize', onResize);
    };
  }

  disconnectedCallback() {
    if (this._teraCleanup) this._teraCleanup();
  }
}

customElements.define('tera-header', TeraHeader);
