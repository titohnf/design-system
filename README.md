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

## Catatan

Perubahan STRUKTUR (misal header dapat menu baru, footer nambah kolom)
tidak bisa otomatis — itu tetap perlu dikerjakan manual per repo lewat
Claude Code, karena setiap repo pakai bahasa kode yang berbeda (HTML vs
React/JSX).
