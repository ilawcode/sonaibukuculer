# LEAN Retro

Takımlar için modern, kart tabanlı retrospektif (retro) yönetim uygulaması. Next.js (App Router) + MongoDB üzerine kurulu, Bootstrap 5 ile responsive bir arayüze sahiptir. Retro oturumları oluşturma, kart paylaşma, oylama, aksiyon atama ve atanan aksiyonları e-posta ile bildirme özelliklerini destekler.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Ön Koşullar](#ön-koşullar)
- [Kurulum](#kurulum)
- [Ortam Değişkenleri](#ortam-değişkenleri-envlocal)
- [Çalıştırma](#çalıştırma)
- [Proje Yapısı](#proje-yapısı)
- [Sayfalar / Rotalar](#sayfalar--rotalar)
- [API Uç Noktaları](#api-uç-noktaları)
- [E-posta Bildirimleri (Gmail SMTP)](#e-posta-bildirimleri-gmail-smtp)
- [Sık Karşılaşılan Sorunlar](#sık-karşılaşılan-sorunlar)

---

## Özellikler

- **Retro oturumu oluşturma & yönetme**: Başlık, açıklama, katılımcı ve durum bilgisi.
- **Kart kategorileri**: İyi Giden, Geliştirilecek, Aksiyon, Tebrik.
- **Kart işlemleri**: Ekleme, silme, güncelleme ve oylama.
- **Aksiyon atama**: Aksiyon kartlarını katılımcılara atayıp son tarih (`dueDate`) tanımlama.
- **E-posta bildirimi**: Atanan aksiyonlar için Gmail SMTP üzerinden HTML şablonlu otomatik mail.
- **Toplu bildirim**: Tek tıkla tüm aksiyonları sahiplerine gönderme (`/api/actions/send-bulk-mail`).
- **Retro geçmişi**: Eski retroları listeleme ve detayını görüntüleme.
- **Frontend-only demo board** (`/retro`): Veritabanı veya API gerektirmeyen, in-memory çalışan modern retro tahtası.
- **Soft renk teması**: Açık mavi / lila tonlarında modern, ferah tasarım.
- **Responsive UI**: Bootstrap 5 + Bootstrap Icons.

---

## Kullanılan Teknolojiler

### Framework & Runtime

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| [Next.js](https://nextjs.org/) | 14.2.3 | React tabanlı, App Router ile SSR / API Routes |
| [React](https://react.dev/) | 18 | UI kütüphanesi |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tip güvenli geliştirme |
| Node.js | ≥ 18.17 | Çalışma ortamı (Next.js 14 gereksinimi) |

### Veri Katmanı

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| [MongoDB](https://www.mongodb.com/) | 6+ | NoSQL veritabanı |
| [Mongoose](https://mongoosejs.com/) | 8.4 | MongoDB ODM, şema & model yönetimi |

### Arayüz

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| [Bootstrap](https://getbootstrap.com/) | 5.3 | CSS framework, grid & bileşenler |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | 1.11 | İkon seti |

### Servisler

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| [Nodemailer](https://nodemailer.com/) | 8.0 | Gmail SMTP üzerinden HTML e-posta gönderimi |

### Geliştirme Araçları

- **ESLint** (`eslint-config-next`) — Kod kalitesi
- **Next.js Dev Server** — Hot reload geliştirme deneyimi

---

## Ön Koşullar

Kurulumdan önce makinenizde aşağıdakilerin yüklü olması gerekir:

1. **Node.js** `>= 18.17` ([nodejs.org](https://nodejs.org/) üzerinden LTS önerilir)
2. **npm** (Node ile birlikte gelir) veya pnpm / yarn
3. **MongoDB** — Lokal kurulum **veya** [MongoDB Atlas](https://www.mongodb.com/atlas) bulut hesabı
   - Lokal kurulum için: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - macOS için Homebrew: `brew tap mongodb/brew && brew install mongodb-community`
4. **Gmail hesabı** (opsiyonel, sadece e-posta bildirimi kullanılacaksa)
   - 2 Adımlı Doğrulama aktif olmalı
   - [Uygulama Şifresi](https://myaccount.google.com/apppasswords) oluşturulmuş olmalı

---

## Kurulum

### 1. Projeyi Klonla

```bash
git clone <repo-url>
cd sonaibukuculer
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. MongoDB'yi Başlat

**Lokal MongoDB için (macOS, Homebrew):**

```bash
brew services start mongodb-community
```

**Lokal MongoDB için (Linux / manuel):**

```bash
mongod --dbpath ~/data/db
```

**Veya MongoDB Atlas** üzerinden bir cluster oluşturup connection string'ini alın.

### 4. Ortam Değişkenlerini Tanımla

Proje kökünde `.env.local` adında bir dosya oluşturun. Şablon olarak `.env.example` kullanabilirsiniz:

```bash
cp .env.example .env.local
```

Ardından bir sonraki bölümdeki değerleri doldurun.

---

## Ortam Değişkenleri (`.env.local`)

```env
# MongoDB bağlantısı (lokal veya Atlas)
MONGODB_URI=mongodb://localhost:27017/retro-app

# Gmail SMTP (sadece e-posta bildirimi kullanılacaksa)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `MONGODB_URI` | Evet | MongoDB connection string. Atlas için `mongodb+srv://...` formatı |
| `GMAIL_USER` | Opsiyonel | Aksiyon bildirimleri için gönderici Gmail adresi |
| `GMAIL_APP_PASSWORD` | Opsiyonel | Google hesabı için üretilmiş 16 karakterli **Uygulama Şifresi** (normal şifre değil) |

> Not: `.env.local` dosyası `.gitignore` ile zaten dışlanmıştır; commit edilmez.

---

## Çalıştırma

### Geliştirme Modu

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır. Dosya değişikliklerinde otomatik yenilenir.

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Proje Yapısı

```
sonaibukuculer/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   ├── actions/               # Aksiyon CRUD + toplu mail
│   │   ├── cards/                 # Kart CRUD + oylama
│   │   ├── participants/          # Katılımcı CRUD
│   │   ├── sessions/              # Oturum CRUD + retro key arama
│   │   └── users/                 # Kullanıcı CRUD
│   ├── retro/                     # Frontend-only demo board
│   ├── retros/                    # Eski retro listesi & detay
│   ├── sessions/                  # Oturum sayfaları
│   ├── globals.css                # Soft renk teması
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Ana sayfa (Landing Dashboard)
│
├── components/                    # React bileşenleri
│   ├── Navbar.tsx
│   ├── LandingDashboard.tsx
│   ├── RetroBoard.tsx             # Sunucu destekli board
│   ├── RetroBoardClient.tsx       # Client-side board
│   ├── CardColumn.tsx
│   ├── CardItem.tsx
│   ├── AddCardModal.tsx
│   ├── ReminderModal.tsx
│   ├── OldRetrosPage.tsx
│   ├── RetroHistoryDetail.tsx
│   └── BootstrapClient.tsx        # Bootstrap JS hidratasyonu
│
├── models/                        # Mongoose şemaları
│   ├── Session.ts
│   ├── Card.ts
│   ├── Action.ts
│   ├── Participant.ts
│   └── User.ts
│
├── lib/                           # Yardımcı modüller
│   ├── mongodb.ts                 # MongoDB connection (cached)
│   ├── mailer.ts                  # Nodemailer (Gmail SMTP)
│   └── mockRetros.ts              # Demo/dummy veriler
│
├── types/
│   └── index.ts                   # Ortak TypeScript tipleri
│
├── public/                        # Statik varlıklar
├── design/                        # UI / tasarım dosyaları
├── docs/                          # Dokümantasyon
├── .env.example                   # Ortam değişkeni şablonu
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Sayfalar / Rotalar

| Rota | Açıklama |
|------|----------|
| `/` | Ana sayfa — Landing Dashboard |
| `/retro` | Frontend-only retro tahtası (backend gerekmez) |
| `/retros` | Geçmiş retro oturumları listesi |
| `/retros/[id]` | Retro geçmiş detayı |
| `/sessions` | Aktif oturum listesi |
| `/sessions/new` | Yeni oturum oluşturma formu |
| `/sessions/[id]` | Oturum detayı (retro board) |

---

## API Uç Noktaları

### Sessions

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/sessions` | Tüm oturumları listele |
| POST | `/api/sessions` | Yeni oturum oluştur |
| GET | `/api/sessions/[id]` | Oturum detayı |
| PATCH | `/api/sessions/[id]` | Oturum güncelle |
| DELETE | `/api/sessions/[id]` | Oturum sil |
| GET | `/api/sessions/key?key=XXX` | Retro key ile oturum bul |

### Cards

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/cards?sessionId=xxx` | Oturuma ait kartlar |
| POST | `/api/cards` | Yeni kart ekle |
| PATCH | `/api/cards/[id]` | Kart güncelle |
| DELETE | `/api/cards/[id]` | Kart sil |
| POST | `/api/cards/[id]` | Karta oy ver |

### Actions

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/actions` | Aksiyonları listele |
| POST | `/api/actions` | Yeni aksiyon oluştur |
| PATCH | `/api/actions/[id]` | Aksiyon güncelle |
| DELETE | `/api/actions/[id]` | Aksiyon sil |
| POST | `/api/actions/send-bulk-mail` | Tüm aksiyonları sahiplerine maille |

### Participants & Users

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET / POST | `/api/participants` | Katılımcı CRUD |
| GET / PATCH / DELETE | `/api/participants/[id]` | Katılımcı detay işlemleri |
| GET / POST | `/api/users` | Kullanıcı CRUD |
| GET / PATCH / DELETE | `/api/users/[id]` | Kullanıcı detay işlemleri |

---

## E-posta Bildirimleri (Gmail SMTP)

Aksiyon atandığında HTML şablonlu bir e-posta gönderilir. Bu özelliği kullanmak için:

1. Google hesabınızda **2 Adımlı Doğrulama**'yı açın.
2. [Uygulama Şifreleri](https://myaccount.google.com/apppasswords) sayfasından yeni bir uygulama şifresi oluşturun.
3. Üretilen 16 karakterli şifreyi `.env.local` dosyasına `GMAIL_APP_PASSWORD` olarak ekleyin.
4. `GMAIL_USER` değişkenine de gönderici Gmail adresini yazın.

> E-posta gerekmiyorsa bu değişkenler atlanabilir; uygulama çalışmaya devam eder, sadece mail gönderim adımı pas geçilir.

---

## Sık Karşılaşılan Sorunlar

**MongoDB'ye bağlanılamıyor:**
- MongoDB servisinin çalıştığını kontrol edin: `brew services list` veya `systemctl status mongod`.
- `MONGODB_URI` değerinin doğru olduğundan ve Atlas kullanıyorsanız IP whitelist'inizde IP'nizin ekli olduğundan emin olun.

**`Module not found` veya tip hataları:**
- `node_modules` ve `.next` klasörlerini silip tekrar yükleyin:
  ```bash
  rm -rf node_modules .next
  npm install
  ```

**Gmail mail göndermiyor:**
- Normal Gmail şifresi yerine **Uygulama Şifresi** kullandığınızdan emin olun.
- 2 Adımlı Doğrulama'nın aktif olması zorunludur.

**Port 3000 dolu:**
```bash
npm run dev -- -p 3001
```

---

## Lisans

Bu proje özel kullanım amaçlıdır. Lisans bilgisi için proje sahibine başvurun.
