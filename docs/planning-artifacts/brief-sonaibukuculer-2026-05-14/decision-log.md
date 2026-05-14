# Karar Kayıtları

## 2026-05-14

### Karar: Retro key formatı
- **Konu:** Key neye benzeyecek?
- **Karar:** 6 karakter alfanümerik (A-Z, 0-9), case-insensitive. Benzersizlik MongoDB index ile zorlanacak.
- **Gerekçe:** Daha kısa olursa çakışma riski artar; daha uzun hatırlanması zor. 6 karakter = ~2 milyar kombinasyon, yeterli.
- **Alternatif değerlendirilmedi:** Kelime tabanlı (örn. happy-cat-123) — gereksiz uzun, i18n karmaşık.

### Karar: Durum geçişleri (state machine)
- **Konu:** Kaç statü, hangi sırayla?
- **Karar:** 6 durum, lineer geçiş: `created` → `waiting_participants` → `in_progress` → `review` → `action_planning` → `closed`.
- **Gerekçe:** Mevcut app'te card yazma, aksiyon planlama, sonuç değerlendirme ayrı aşamalar değil. Bu yapı ile kontrollü geçiş sağlanır.
- **Not:** Başlangıçta kullanıcı "retro başladı / katılımcı bekleniyor" dedi; `created` ile `waiting_participants` arasındaki ayrım oturumun başlatıldığını ama henüz kart yazımına geçilmediğini gösterir.

### Karar: Oylama yerine aksiyon planlama
- **Konu:** Kullanıcılar oylama mı yapacak, aksiyon mu alacak?
- **Karar:** Oylama kaldırıldı; aksiyon planlama aşaması eklendi.
- **Gerekçe:** Kullanıcı karta oy vermek yerine, retro sonuçlarına dayalı aksiyon kartları oluşturup son tarih ve sorumlu atayacak.
- **Detay:** `action_planning` statüsünde her aksiyon kartı; başlık, açıklama, due date, assignee içerir.
### Karar: Gerçek zamanlı senkronizasyon dışarıda
- **Konu:** Durum değişiklikleri anında tüm katılımcılara mı yansıyacak?
- **Karar:** Hayır — sayfa yenilemesi ile gösterilir. WebSocket değil, polling değil.
- **Gerekçe:** Bu brief'in kapsamı asgari可行 MVP. Gerçek zaman senkronizasyonu ayrı epik.
