---
title: "Retro Key & Oturum Durum Yönetimi"
status: draft
created: 2026-05-14
updated: 2026-05-14
---

# Ürün Özeti: Retro Key & Oturum Durum Yönetimi

Retro App'te bir retrospektif oturumu oluşturulunca kullanıcı doğrudan board sayfasına yönlendirilir. Bu durumda oturum hiçbir zaman kontrollü bir "başlangıç" geçişi yaşamaz; katılımcılar session linki ile katılır ancak oturumun hangi aşamada olduğu net değildir.

Bu özellik iki temel yetenek sunar. Birincisi, her yeni retro oturumuna sistem tarafından benzersiz bir **retro key** (katılım kodu) atanmasıdır. İkincisi, oturumun yaşam döngüsü boyunca durum (statü) yönetiminin sağlanmasıdır. Retro key, katılımcıların oturuma doğrudan katılmasını sağlar. Oturum durumları oturum sahibinin kontrolünde, dashboard üzerinden ilerletilir.

## Problem

1. **Oturum kontrolü eksik:** Retro oluşturulunca board hemen açılır; "retro henüz başlamadı" veya "katılımcı bekleniyor" durumu yok.
2. **Katılım sürtünmesi:** Katılımcılar, doğrudan bir MongoDB `_id`'sini içeren link yerine kısa ve hatırlanabilir bir kod ile katılmalı.
3. **Aşama belirsizliği:** Card yazma, aksiyon planlama ve sonuç değerlendirme aşamaları arasında geçiş yok; her şey aynı ekranda.

## Çözüm

1. **Oturum oluşturulduğunda** sistem 6 karakterlik alfanümerik, büyük-küçük harf duyarsız, benzersiz bir retro key üretir (örn. `ABC123`).
2. Oluşturma ekranında key görsel olarak gösterilir; kopyalanabilir.
3. **Ayrı bir "Retro'ya Katıl" giriş noktası** eklenir; kullanıcılar bu kodu girerek oturuma katılır.
4. Oturum dashboard'unda durum kontrolü sunulur. Oturum sahibi durumları ilerletebilir.
5. Aksiyon planlama aşamasında katılımcılar, retro sonuçlarına dayalı aksiyon kartları oluşturur; her aksiyona son tarih (due date) ve sorumlu (assignee) atanır.

## Yaklaşımın Tercihi

- Basitlik: Kısa kod ile katılım, harici kimlik doğrulama olmadan çalışır.
- Durum makinesi: Retrospektifin her aşaması kontrollü, tesadüfi değil.
- Mevcut yeteneklerin üzerine inşa: Card ve kategori yapısı olduğu gibi korunur; aksiyon planlama yeni yetenek olarak eklenir.

## Hedef Kitle

- **Birincil:** Scrum Master'lar ve takım liderleri — oturum yönetimi ve durum kontrolü.
- **İkincil:** Takım üyeleri — kod ile çabuk katılım, mevcut aşamaya göre etkileşim.

## Başarı Kriterleri

- [ ] Her yeni oturuma otomatik retro key atanır; çakışma olmaz.
- [ ] Key formatı 6 karakter alfanümerik, okunabilir.
- [ ] Katılımcılar "Retro'ya Katıl" ekranından key girerek oturuma erişir.
- [ ] Oturum dashboard'ında durum değişimi yapılabilir; geçersiz durum geçişleri engellenir.
- [ ] Durum değişikliği tüm katılımcılara yansır (sayfa yenilemesi ile).

## Kapsam

### İçinde

- Retro key üretimi ve MongoDB'de `Session` modeline kaydedilmesi.
- "Retro'ya Katıl" giriş sayfası ve key doğrulama.
- Oturum dashboard'una durum kontrol paneli.
- Durum geçişleri — lineer, manuel, sadece ileri:
  `created` → `waiting_participants` → `in_progress` → `review` → `action_planning` → `closed`
- Aksiyon planlama ekranı: retro çıktılarından yeni aksiyon kartları oluşturma, son tarih ve assignee atama.

### Dışında

- Gerçek zamanlı (WebSocket) senkronizasyon. Durum değişikliği sayfa yenilemesi ile görülür.
- Süre bazlı otomatik durum değişimi (zamanlayıcı).
- Kullanıcı yetkilendirme (auth); herkes key biliyorsa katılır.
- Retro key'in süresinin dolması (key kalıcıdır).
- Eşzamanlı durum değişimi çatışmalarının özel çözümü; son yazan kazanır.

## Vizyon

Retro App, yapılandırılmış bir yaşam döngüsü ile senkron retrospektif oturumlarını yöneten, kod tabanlı katılımı standartlaştıran bir araçtır. Her oturumun başlangıcından aksiyonların kapanışına kadar izlenebilir bir akış sunar.
