# TERA Group — Design System

Sumber kebenaran tunggal untuk warna, font, dan spacing di semua web
TERA Group (tera.or.id, bimbeltera.com, terafoundation.or.id,
komunitas.tera.or.id).

## Cara pakai

**Situs HTML/CSS polos (teragrup, bimbel):**
Link langsung ke file ini lewat CDN, tidak perlu copy manual:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/titohnf/design-system@main/tokens.css">
```

**Situs React/Tailwind (komunitastera, foundation):**
Nilai di `tokens.css` disinkronkan otomatis ke `globals.css` masing-masing
lewat GitHub Action setiap ada perubahan di repo ini (lihat bagian
"DESIGN-TOKENS-START" / "DESIGN-TOKENS-END" di file CSS masing-masing
repo — bagian itu akan ditimpa otomatis, jangan edit manual di sana).

## Mengubah warna/font

1. Edit `tokens.css` di repo ini
2. Commit & push ke branch `main`
3. Situs HTML (teragrup, bimbel) otomatis ikut berubah dalam hitungan menit
4. Situs React (komunitastera, foundation) akan menerima Pull Request/commit
   otomatis dari GitHub Action, lalu Netlify redeploy otomatis

## Komponen bersama

Selain token, header dan footer semua situs juga dibagikan lewat Custom
Element (`<tera-header>` di `tera-header.js`, `<tera-footer>` di
`tera-footer.js`) — jadi cukup 1 tag di tiap repo, dan style/struktur
tetap identik di semua situs karena hidup di sini, bukan diduplikasi per
repo. Yang boleh beda per situs hanya lewat atribut: logo, deskripsi,
dan isi kolom "Jelajahi"/"Kontak" (lihat komentar di masing-masing file
untuk atribut lengkap).

## Catatan

Perubahan pada isi/urutan/style kolom footer atau header sekarang cukup
diedit di `tera-footer.js` / `tera-header.js` di sini — otomatis berlaku
di semua situs begitu commit SHA yang dipin di tiap repo diupdate.
Perubahan yang benar-benar STRUKTURAL di luar itu (misal footer butuh
kolom ke-5 yang kontennya beda tipe) tetap perlu penyesuaian manual per
repo lewat Claude Code, karena tiap repo pakai bahasa kode yang berbeda
(HTML vs React/JSX).
