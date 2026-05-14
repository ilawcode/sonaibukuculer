# Retro & Action Tracker — Landing Page (Frontend Only)

Tek dosyalık, retro/synthwave temalı landing page tasarımı.

## Dosyalar

- `landing.html` — Tek dosyada HTML + CSS + minimal JS.

## Çalıştırma

Hiçbir bağımlılık yok, herhangi bir tarayıcıda aç:

```bash
open design/landing.html
```

veya hızlı bir local server ile:

```bash
npx serve design
```

ya da Python ile:

```bash
python3 -m http.server 5500 -d design
```

Sonra tarayıcıdan `http://localhost:5500/landing.html` aç.

## Notlar

- Fontlar: Google Fonts (`Press Start 2P` + `VT323`).
- Sadece frontend; backend / API / DB yok.
- `N` tuşu “Yeni Retro Oluştur”, `L` tuşu “Eski Retroları Gör” butonuna odaklanır.
- `prefers-reduced-motion` desteklenir.
