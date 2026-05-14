# Geliştirme Dokümantasyonu

Bu klasör; **Sona İbükücüler / Retro App** projesinin geliştirilmesi sırasında kullanılan AI modelleri, IDE'ler ve metodolojik araçların kısa özetini içerir. Amaç; ekipteki yeni bir kişinin "biz hangi araçları, neden kullanıyoruz" sorusunu 5 dakikada cevaplayabilmesidir.

## Proje hakkında özet

- **Stack:** Next.js 14, React 18, TypeScript, Bootstrap 5.3, Bootstrap Icons
- **Yaklaşım:** Frontend-only retrospective board (oylama, aksiyon takip tablosu, katılımcı paneli)
- **Branch stratejisi:** `future/<özellik>` üzerinde geliştir → `main` branch'ine merge → push (örn. `future/retroBoard`, `future/action`)

## Bu klasördeki dosyalar

| Dosya | İçerik |
| --- | --- |
| [`araclar.md`](./araclar.md) | Cursor, Kiro, ChatGPT, Gemini, BMAD, VS Code — kullanım amaçları |
| [`modeller.md`](./modeller.md) | Kullanılan AI modelleri ve hangi adımda devreye girdikleri |

## Tipik geliştirme akışı

1. **Fikir / İhtiyaç** → ChatGPT veya Gemini ile prompt taslağı, kullanıcı senaryosu çıkarımı
2. **Planlama** → BMAD agent skill'leri (Analyst / PM / Architect) ile PRD, epic ve story
3. **Kod yazımı** → Cursor (agent mode) ve gerektiğinde Kiro spec akışı
4. **Manuel düzenleme / debug** → VS Code (extensions, breakpoint, terminal)
5. **Review** → Cursor inline review + ekip içi PR review
6. **Merge & push** → Feature branch → `main` → `origin` push
