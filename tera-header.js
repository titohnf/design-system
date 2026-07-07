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
     show-group-nav="true"
   ></tera-header>
   
   ATRIBUT:
   - logo-text   : teks di sebelah logo (wajib)
   - logo-img    : path/url gambar logo (opsional)
   - logo-href   : link saat logo diklik (default: "/")
   - nav         : JSON array {label, href} untuk menu (wajib)
   - cta-text    : teks tombol CTA di ujung kanan (opsional, 
                   kalau kosong tombol tidak muncul)
   - cta-href    : link tombol CTA (wajib kalau cta-text diisi)
   - show-group-nav : "true" untuk menampilkan dropdown 
                   "Bagian dari Tera Group" (opsional, default false)
   ========================================================= */

class TeraHeader extends HTMLElement {
  connectedCallback() {
    const logoText = this.getAttribute('logo-text') || 'Tera';
    const logoImg = this.getAttribute('logo-img') || '';
    const logoHref = this.getAttribute('logo-href') || '/';
    const navItems = JSON.parse(this.getAttribute('nav') || '[]');
    const ctaText = this.getAttribute('cta-text') || '';
    const ctaHref = this.getAttribute('cta-href') || '#';
    const showGroupNav = this.getAttribute('show-group-nav') === 'true';

    const currentPath = window.location.pathname;

    const shadow = this.attachShadow({ mode: 'open' });

    const navHtml = navItems.map(item => {
      const isActive = item.href === currentPath ||
        (item.href !== '/' && currentPath.startsWith(item.href) && !item.href.startsWith('#') && !item.href.startsWith('http'));
      return `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a>`;
    }).join('');

    const groupNavHtml = showGroupNav ? `
      <div class="nav-group">
        <button type="button" class="nav-group-badge" id="group-btn" aria-expanded="false">
          Bagian dari Tera Group
          <svg class="chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.19l3.71-3.96a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clip-rule="evenodd"/>
          </svg>
        </button>
        <div class="nav-group-menu" id="group-menu">
          <a href="https://tera.or.id">Beranda Utama</a>
          <a href="https://bimbeltera.com">Bimbel Tera</a>
          <a href="https://terafoundation.or.id">Tera Foundation</a>
          <a href="https://komunitas.tera.or.id">Komunitas Tera</a>
        </div>
      </div>` : '';

    const ctaHtml = ctaText ? `<a href="${ctaHref}" class="cta">${ctaText}</a>` : '';

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-sans, 'Inter', sans-serif);
        }
        header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid var(--card-border, #e1e9fb);
        }
        .inner {
          max-width: var(--container-max, 1152px);
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
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
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .nav-link {
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          color: rgba(16,24,40,0.8);
          padding: 8px 16px;
          border-radius: var(--radius-pill, 9999px);
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover {
          background: var(--muted-bg, #eaf1ff);
          color: var(--primary-dark, #0b57d0);
        }
        .nav-link.active {
          background: var(--muted-bg, #eaf1ff);
          color: var(--primary-dark, #0b57d0);
        }
        .nav-group {
          position: relative;
          margin-left: 8px;
        }
        .nav-group-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-dark, #0b57d0);
          background: var(--muted-bg, #eaf1ff);
          border: none;
          border-radius: var(--radius-pill, 9999px);
          padding: 8px 14px;
          cursor: pointer;
        }
        .chevron {
          width: 14px;
          height: 14px;
          transition: transform 0.15s;
        }
        .nav-group.open .chevron {
          transform: rotate(180deg);
        }
        .nav-group-menu {
          display: none;
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background: var(--card, #fff);
          border: 1px solid var(--card-border, #e1e9fb);
          border-radius: var(--radius-card, 12px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          min-width: 200px;
          padding: 8px;
        }
        .nav-group.open .nav-group-menu {
          display: block;
        }
        .nav-group-menu a {
          display: block;
          padding: 8px 12px;
          font-size: 14px;
          color: var(--foreground, #101828);
          text-decoration: none;
          border-radius: 8px;
        }
        .nav-group-menu a:hover {
          background: var(--muted-bg, #eaf1ff);
        }
        .cta {
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-foreground, #fff);
          background: var(--primary, #0d6efd);
          padding: 10px 18px;
          border-radius: var(--radius-pill, 9999px);
          margin-left: 8px;
          transition: background 0.15s;
        }
        .cta:hover {
          background: var(--primary-dark, #0b57d0);
        }
        .mobile-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        @media (max-width: 768px) {
          nav { display: none; }
          .mobile-btn { display: block; }
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
            ${groupNavHtml}
            ${ctaHtml}
          </nav>
        </div>
      </header>
    `;

    if (showGroupNav) {
      const groupEl = shadow.querySelector('.nav-group');
      const btn = shadow.getElementById('group-btn');
      btn.addEventListener('click', () => {
        groupEl.classList.toggle('open');
        btn.setAttribute('aria-expanded', groupEl.classList.contains('open'));
      });
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          groupEl.classList.remove('open');
        }
      });
    }
  }
}

customElements.define('tera-header', TeraHeader);
