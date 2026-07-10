/* =========================================================
   TERA GROUP — <tera-footer> WEB COMPONENT

   Sama seperti <tera-header>: Custom Element standar browser,
   jadi bisa dipakai di HTML biasa, Next.js, maupun React.

   CARA PAKAI:
   <script src="https://cdn.jsdelivr.net/gh/titohnf/design-system@main/tera-footer.js"></script>

   <tera-footer
     site="tera"
     logo-text="Tera"
     logo-img="/logo.png"
     description="TERA Group menaungi Bimbel Tera, Tera Foundation, dan Tera Community..."
     nav='[{"label":"Beranda","href":"/"},{"label":"Tentang Kami","href":"/tentang"}]'
     contact='[{"text":"teralearningcenter.id@gmail.com","href":"mailto:teralearningcenter.id@gmail.com"},{"text":"@insantera","href":"https://instagram.com/insantera"}]'
   ></tera-footer>

   ATRIBUT:
   - site        : wajib. Salah satu dari "tera" | "bimbel" | "foundation" |
                   "komunitas" — dipakai untuk menentukan isi kolom "Bagian
                   dari Tera" (otomatis, 3 situs lain selain situs ini sendiri).
   - logo-text   : nama brand di footer (wajib)
   - logo-img    : path/url logo (opsional)
   - description : deskripsi singkat di bawah logo (wajib)
   - nav         : JSON array {label, href} untuk kolom "Jelajahi" (wajib)
   - contact     : JSON array {text, href?} untuk kolom "Kontak". Kalau
                   "href" kosong, item ditampilkan sebagai teks biasa
                   (dipakai untuk alamat/jam buka, bukan link).

   Yang IDENTIK di semua situs (diatur di sini, bukan per-repo): tata letak
   4 kolom, judul kolom ("Jelajahi", "Bagian dari Tera", "Kontak"), daftar
   & urutan "Bagian dari Tera", teks copyright, font, dan semua style.
   Yang BOLEH beda per situs: logo, deskripsi, isi "Jelajahi", isi "Kontak".
   ========================================================= */

const TERA_SITES = {
  tera:       { label: "Tera",            href: "https://tera.or.id" },
  bimbel:     { label: "Bimbel Tera",     href: "https://bimbeltera.com" },
  foundation: { label: "Tera Foundation", href: "https://terafoundation.or.id" },
  komunitas:  { label: "Komunitas Tera",  href: "https://komunitas.tera.or.id" },
};

class TeraFooter extends HTMLElement {
  connectedCallback() {
    const site = this.getAttribute("site") || "";
    const logoText = this.getAttribute("logo-text") || "Tera";
    const logoImg = this.getAttribute("logo-img") || "";
    const description = this.getAttribute("description") || "";
    const navItems = JSON.parse(this.getAttribute("nav") || "[]");
    const contactItems = JSON.parse(this.getAttribute("contact") || "[]");

    const crossLinks = Object.keys(TERA_SITES)
      .filter((key) => key !== site)
      .map((key) => TERA_SITES[key]);

    const navHtml = navItems
      .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
      .join("");

    const crossLinksHtml = crossLinks
      .map(
        (item) =>
          `<li><a href="${item.href}" target="_blank" rel="noopener">${item.label}</a></li>`
      )
      .join("");

    const contactHtml = contactItems
      .map((item) =>
        item.href
          ? `<li><a href="${item.href}"${
              item.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""
            }>${item.text}</a></li>`
          : `<li><span>${item.text}</span></li>`
      )
      .join("");

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-sans, 'Inter', sans-serif);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        footer {
          border-top: 1px solid var(--card-border, #e1e9fb);
          background: #fafafa;
          color: var(--foreground, #101828);
        }
        .inner {
          max-width: var(--container-max, 1152px);
          margin: 0 auto;
          padding: 48px 24px 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .col h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground, #101828);
          margin: 0 0 14px;
        }
        .col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .col li {
          margin-bottom: 10px;
        }
        .col a, .col span {
          text-decoration: none;
          font-size: 13.5px;
          color: var(--muted, #5b6472);
          transition: color 0.15s ease;
        }
        .col a:hover {
          color: var(--primary-dark, #0b57d0);
        }
        .brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .brand-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .logo-circle {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-pill, 9999px);
          background: #ffffff;
          border: 1px solid var(--card-border, #e1e9fb);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .logo-circle img {
          height: 18px;
          width: auto;
          display: block;
        }
        .brand-name {
          font-weight: 700;
          font-size: 16px;
          color: var(--foreground, #101828);
        }
        .brand p {
          font-size: 13.5px;
          line-height: 1.7;
          color: rgba(16, 24, 40, 0.7);
          margin: 0;
          max-width: 280px;
        }
        .bottom {
          border-top: 1px solid var(--card-border, #e1e9fb);
          text-align: center;
          padding: 16px 24px;
          font-size: 12.5px;
          color: var(--muted, #5b6472);
        }
        @media (max-width: 860px) {
          .inner { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 500px) {
          .inner { grid-template-columns: 1fr; }
        }
      </style>
      <footer>
        <div class="inner">
          <div class="col brand">
            <div class="brand-top">
              ${logoImg ? `<div class="logo-circle"><img src="${logoImg}" alt="${logoText}"></div>` : ""}
              <span class="brand-name">${logoText}</span>
            </div>
            <p>${description}</p>
          </div>
          <div class="col">
            <h4>Jelajahi</h4>
            <ul>${navHtml}</ul>
          </div>
          <div class="col">
            <h4>Bagian dari Tera</h4>
            <ul>${crossLinksHtml}</ul>
          </div>
          <div class="col">
            <h4>Kontak</h4>
            <ul>${contactHtml}</ul>
          </div>
        </div>
        <div class="bottom">
          &copy; ${new Date().getFullYear()} Tera. Bagian dari ekosistem yang berkomitmen pada pendidikan yang lebih baik.
        </div>
      </footer>
    `;
  }
}

customElements.define("tera-footer", TeraFooter);
