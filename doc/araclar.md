# Kullanılan Araçlar

Bu projede kod yazımı, planlama ve dokümantasyon sırasında birbirini tamamlayan **6 araç** kullanıldı. Her aracın güçlü olduğu noktayı projenin ilgili adımında devreye aldık.

## 1. Cursor

- **Ne:** AI-first kod editörü (VS Code fork'u + agent yetenekleri).
- **Bu projede:**
  - `RetroBoardClient.tsx`, `globals.css` gibi büyük dosyaların agent mode ile üretilmesi.
  - "Bu komponenti X'e göre genişlet" şeklinde refactor istekleri.
  - Akış diyagramı / iş isteri verildiğinde use case tablosu üretimi (workspace rule olarak tanımlı).
  - Git operasyonları (branch, commit, merge, push) — agent shell üzerinden.
- **Neden:** Çok dosyalı, çok adımlı görevleri planlayıp uygulayabilen agent yapısı en hızlı sonucu veriyor.

## 2. Kiro

- **Ne:** Amazon Kiro — spec / hooks / steering odaklı AI IDE.
- **Bu projede:**
  - Yeni bir özelliğin **spec dökümanı** çıkarımı (requirements → design → tasks).
  - Tasarım kararlarının (model, akış, ekran haritası) yazılı hale gelmesi.
  - Hook'lar ile tekrarlayan otomasyonların (lint, format, yapı kontrolü) tetiklenmesi.
- **Neden:** Cursor "uygula" tarafında çok güçlü; Kiro ise iş öncesi "ne yapacağız, nasıl yapacağız"ı zorunlu bir akış olarak çıkarttığı için planlama disiplinini koruyor.

## 3. ChatGPT

- **Ne:** OpenAI'ın chat arayüzü (genel amaçlı LLM erişimi).
- **Bu projede:**
  - Prompt taslaklarının hazırlanması ve geliştirilmesi.
  - Kullanıcı senaryolarının (user story) Türkçe metin olarak kalemlenmesi.
  - "Şu component nasıl daha sade olur?" gibi konuşma temelli mini review.
  - Hızlı sözlük / terim açıklamaları (örn. "lean retro", "spike", "RICE").
- **Neden:** İlk fikir aşamasında en hızlı geri besleme buradan geliyor; konuşma akışı uzun ve serbest.

## 4. Gemini

- **Ne:** Google'ın LLM tabanlı asistanı (Gemini 2.x).
- **Bu projede:**
  - ChatGPT çıktısına alternatif görüş almak (çapraz doğrulama).
  - Büyük doküman özetleme (uzun bağlam pencereli) — örn. eski retro spec'leri.
  - Görsel / ekran görüntüsünden iş kuralı çıkarımı.
- **Neden:** Farklı modeller, aynı isterde farklı boşlukları yakalıyor; tek bir LLM'e bağlı kalmıyoruz.

## 5. BMAD (Method)

- **Ne:** BMad-Method; tekrar üretilebilir agent + workflow + skill kütüphanesi (`.claude/skills/bmad-*`).
- **Bu projede:**
  - Talep aldığımız her özellik için **Analyst (Mary) → PM (John) → Architect (Winston) → UX (Sally) → Dev (Amelia)** zinciri.
  - `bmad-create-prd`, `bmad-create-epics-and-stories`, `bmad-create-story`, `bmad-dev-story` skill'leri ile aşamalı ilerleme.
  - **Brownfield doc** üretimi (`bmad-document-project`) ile mevcut kodun AI'ya öğretilmesi.
  - **Sprint planning / status** skill'leri ile basit takip.
- **Neden:** "Önce konuş, sonra yaz, sonra test et" disiplinini agent katmanına gömüyor; çıktılar tutarlı ve izlenebilir oluyor.

## 6. VS Code

- **Ne:** Klasik Visual Studio Code editörü.
- **Bu projede:**
  - Cursor'un agent mode'a girmediği küçük el düzeltmeleri.
  - Eklentilerle çalışan kısımlar: ESLint, Prettier, GitLens, Tailwind / CSS Intellisense, Error Lens.
  - Debug breakpoint koyma, integrated terminal'de `npm run dev` izleme.
  - Genel "okuma" modu — kodu hızlı tarama ve PR review.
- **Neden:** Ekosistemin geri kalanı (eklentiler, settings sync, Live Share) hala VS Code üzerinde en stabil çalışıyor.

## Hızlı bakış: Hangi araç ne için?

| Adım | Birincil araç | Yardımcı |
| --- | --- | --- |
| Fikir / ideation | ChatGPT | Gemini |
| Spec / planlama | Kiro, BMAD | Cursor (yazım) |
| Kod üretimi | Cursor (agent) | Kiro (manuel akış) |
| Manuel düzenleme | VS Code | Cursor |
| Review | Cursor inline | ChatGPT, Gemini (çapraz) |
| Otomasyon / git | Cursor shell | VS Code terminal |
