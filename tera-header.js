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
   - nav         : JSON array {label, href} untuk menu (wajib)
   - cta-text    : teks tombol CTA di ujung kanan (opsional, 
                   kalau kosong tombol tidak muncul)
   - cta-href    : link tombol CTA (wajib kalau cta-text diisi)
   
   Catatan: link ke 3 web TERA Group lain sengaja TIDAK ada di 
   header — itu sudah cukup di footer (kolom "Bagian dari Tera").
   ========================================================= */

class TeraHeader extends HTMLElement {
  connectedCallback() {
    const logoText = this.getAttribute('logo-text') || 'Tera';
    const logoImg = this.getAttribute('logo-img') || '';
    const logoHref = this.getAttribute('logo-href') || '/';
    const navItems = JSON.parse(this.getAttribute('nav') || '[]');
    const ctaText = this.getAttribute('cta-text') || '';
    const ctaHref = this.getAttribute('cta-href') || '#';

    const currentPath = window.location.pathname;

    const normalizePath = (p) => {
      if (!p) return '/';
      p = p.replace(/\/index\.html$/, '/');
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
      return p === '' ? '/' : p;
    };
    const currentNorm = normalizePath(currentPath);

    const shadow = this.attachShadow({ mode: 'open' });

    const navHtml = navItems.map(item => {
      const itemNorm = normalizePath(item.href);
      const isActive = !item.href.startsWith('#') && !item.href.startsWith('http') &&
        (itemNorm === currentNorm ||
         (itemNorm !== '/' && currentNorm.startsWith(itemNorm)));
      return `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a>`;
    }).join('');

    const ctaHtml = ctaText ? `<a href="${ctaHref}" class="cta">${ctaText}</a>` : '';

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-sans, 'Inter', sans-serif);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
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
          padding: 16px 24px;
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
            ${ctaHtml}
          </nav>
        </div>
      </header>
    `;

  }
}

customElements.define('tera-header', TeraHeader);
