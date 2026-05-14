# Kullanılan AI Modelleri

Araçlar (Cursor, Kiro, ChatGPT, Gemini, BMAD) farklı LLM model ailelerini kullanır. Bu projede aşağıdaki modeller doğrudan veya bir arayüz üzerinden devreye alındı.

## Anthropic — Claude

- **Sürüm aralığı:** Claude 4.x ailesi (Sonnet ve Opus).
- **Nerede:**
  - Cursor agent mode'da varsayılan model olarak.
  - BMAD skill'lerini çalıştırırken (Analyst, Architect, Dev) — uzun talimat takibi gereken durumlar.
- **Güçlü tarafı:** Talimat takibi, tool kullanımı, çok adımlı plan çıkarma; Türkçe doğal akış kuruyor.

## OpenAI — GPT

- **Sürüm aralığı:** GPT-4o / GPT-4.1 / GPT-5 (Codex dahil).
- **Nerede:**
  - ChatGPT arayüzü — fikir, prompt yazımı, review.
  - Cursor'da alternatif model olarak (özellikle hızlı tek-shot kod düzeltmeleri için Codex tarzı).
- **Güçlü tarafı:** Geniş genel bilgi, hızlı kod tamamlama, kısa cevaplarda netlik.

## Google — Gemini

- **Sürüm aralığı:** Gemini 2.5 Pro / Flash.
- **Nerede:**
  - Gemini web arayüzü — uzun doküman özetleme, ikinci görüş.
  - Görsel / ekran görüntüsü olan vakalarda (multimodal).
- **Güçlü tarafı:** Geniş context window, görsel + metin birlikte işleme.

## Diğer / yardımcı

- **Yerel modeller:** Henüz aktif kullanım yok; ileride lint / format gibi düşük gecikme isteyen işler için değerlendirilebilir.
- **Embedding modelleri:** Cursor ve Kiro kendi semantic search/embedding altyapılarını kullanır; ekip tarafında ayrı model yönetmiyoruz.

## Hangi adımda hangi model?

| Adım | Tercih edilen model | Sebebi |
| --- | --- | --- |
| Uzun spec / agent zinciri | Claude (Sonnet/Opus) | Talimat takibi, uzun bağlam |
| Kısa kod düzeltmesi | GPT (Codex) | Hız, kompakt cevap |
| Çapraz görüş / ikinci kafa | Gemini | Farklı bias, geniş bağlam |
| Türkçe prose | Claude / GPT | İkisi de akıcı; tercih içerik tipine göre |
| Multimodal (ekran görüntüsü vb.) | Gemini | Görsel + metin birlikte işleme |

## Model seçimi pratiği

- **Varsayılan:** Cursor agent → Claude.
- **Zor mantık / büyük refactor:** Claude Opus (yüksek düşünme süresi).
- **Hızlı yamamak:** GPT (kısa, sonuç odaklı).
- **Yorumlamayı çapraz doğrulamak:** Aynı soruyu farklı modele tekrar sorma.
