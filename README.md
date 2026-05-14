# Retro App

Next.js + MongoDB + Bootstrap ile geliştirilmiş retrospektif yönetim uygulaması.

## Özellikler

- Retro oturumu oluşturma ve yönetme
- 4 kategori: İyi Giden, Geliştirilecek, Aksiyon, Tebrik
- Kart ekleme, silme ve oylama
- Soft renk teması (açık mavi, açık lila)
- Responsive tasarım (Bootstrap 5)

## Kurulum

```bash
npm install
```

`.env.local` dosyasını düzenleyin:

```env
MONGODB_URI=mongodb://localhost:27017/retro-app
```

## Geliştirme

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinde açılır.

## Frontend-only Retro Board (`/retro`)

Demo amaçlı, **backend gerektirmeyen** modern retrospective board ekranı:

- Ana sayfadaki **"Create Retro"** butonu ile açılır.
- Sol panelde dummy nickname'ler ile katılımcı listesi (avatar + online durum).
- Sağda iki kolonlu board: **İyi Gidenler** & **Kötü Gidenler**.
- "+" ile editable sticky-note kart eklenir, hover ile silinebilir.
- "Share Link" butonu otomatik oluşturulan **Retro Key**'e göre URL'i panoya kopyalar.
- Tüm state in-memory; veritabanı, API veya auth bağlantısı yoktur.

Ekrana doğrudan gitmek için: [http://localhost:3000/retro](http://localhost:3000/retro)

## Proje Yapısı

```
├── app/
│   ├── api/
│   │   ├── sessions/        # Session CRUD API
│   │   └── cards/           # Card CRUD + vote API
│   ├── sessions/
│   │   ├── page.tsx         # Oturum listesi
│   │   ├── new/page.tsx     # Yeni oturum formu
│   │   └── [id]/page.tsx    # Oturum detay (retro board)
│   ├── layout.tsx
│   ├── page.tsx             # Ana sayfa
│   └── globals.css          # Soft renk teması
├── components/
│   ├── Navbar.tsx
│   ├── RetroBoard.tsx       # Ana board bileşeni
│   ├── CardColumn.tsx       # Kategori kolonu
│   ├── CardItem.tsx         # Tek kart
│   ├── AddCardModal.tsx     # Kart ekleme modalı
│   └── BootstrapClient.tsx  # Bootstrap JS yükleyici
├── models/
│   ├── Session.ts           # Mongoose Session modeli
│   └── Card.ts              # Mongoose Card modeli
├── lib/
│   └── mongodb.ts           # MongoDB bağlantısı
└── types/
    └── index.ts             # TypeScript tipleri
```

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/sessions | Tüm oturumları listele |
| POST | /api/sessions | Yeni oturum oluştur |
| GET | /api/sessions/:id | Oturum detayı |
| PATCH | /api/sessions/:id | Oturum güncelle |
| DELETE | /api/sessions/:id | Oturum sil |
| GET | /api/cards?sessionId=xxx | Oturuma ait kartlar |
| POST | /api/cards | Yeni kart ekle |
| PATCH | /api/cards/:id | Kart güncelle |
| DELETE | /api/cards/:id | Kart sil |
| POST | /api/cards/:id | Karta oy ver |
