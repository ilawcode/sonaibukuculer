# Eski Retrolar Frontend Geliştirme Promptu

Bu doküman, mevcut retro uygulamasında sadece frontend tarafını geliştirerek eski retroların listelenmesi, retro key ile detay görüntülenmesi ve aksiyon sahiplerine mail hatırlatma deneyiminin UI seviyesinde kurgulanması için hazırlanmış detaylı promptu içerir.

## Amaç

Mevcut retro uygulamasının frontend tarafını geliştir.

Amaç, kullanıcıların geçmişte oluşturulmuş retroları görüntüleyebilmesi ve belirli bir retroya ait detaylı çıktıları inceleyebilmesidir.

Kapsam sadece frontend olsun. Backend, API geliştirme, veritabanı işlemleri, gerçek e-posta gönderimi, auth ve server-side business logic bu işin dışında kalsın. Gerekirse tüm veri akışı mock data, local state, static JSON veya frontend içinde tanımlı örnek veri üzerinden yürüsün.

## Kapsam

### 1. Eski Retrolar Listeleme

Uygulamada "Eski Retrolar" veya "Geçmiş Retrolar" adında bir ekran oluştur.

Bu ekranda geçmiş retro kayıtları kart veya tablo yapısında listelensin.

Her retro kaydında en az şu alanlar gösterilsin:

- Retro adı veya başlığı
- Retro key
- Tarih
- Takım adı veya oturum adı
- Katılımcı sayısı
- Toplam aksiyon sayısı
- Durum etiketi: tamamlandı, devam ediyor, aksiyon bekleniyor gibi

Liste ekranında şu kullanıcı deneyimleri olsun:

- Arama alanı: retro adı veya retro key ile filtreleme
- Sıralama: en yeni, en eski, en fazla aksiyon, en fazla katılımcı
- Filtreler: tarih aralığı, takım, durum
- Boş durum ekranı: hiç retro yoksa anlamlı bir empty state göster
- Loading skeleton veya placeholder yapı
- Hata durumu bileşeni
- Responsive tasarım

### 2. Retro Key ile Detay Görüntüleme

Kullanıcı bir retro key girerek ilgili eski retro çıktısına ulaşabilsin.

Bunun için liste ekranının üst kısmında veya ayrı bir detay erişim alanında bir "Retro Key ile Görüntüle" bölümü oluştur.

Burada:

- Bir input alanı olsun
- Kullanıcı retro key girsin
- "Görüntüle" butonuna basınca ilgili eski retro detay sayfasına geçilsin
- Geçersiz veya bulunamayan key için frontend tarafında uygun hata mesajı gösterilsin
- Bu akış mock data üzerinden çalışsın

### 3. Eski Retro Detay Sayfası

Retro detay ekranında kullanıcı, seçilen retroya ait tüm önemli çıktıları tek sayfada veya sekmeli yapı ile görebilsin.

Bu detay ekranında şu bölümler bulunsun:

#### A. Genel Bilgiler

- Retro başlığı
- Retro key
- Tarih
- Takım veya ekip adı
- Oturum açıklaması varsa kısa özet
- Toplam katılımcı sayısı
- Toplam aksiyon sayısı

#### B. İyi Yapılanlar

"İyi gidenler", "iyi yapılanlar" veya "What went well" benzeri bir bölüm oluştur.

Bu bölümde:

- Maddeler liste halinde gösterilsin
- Her madde için istenirse oy sayısı veya önem derecesi mock olarak gösterilebilsin
- Görsel olarak pozitif bir ayrım olsun
- Boş veri varsa anlamlı mesaj gösterilsin

#### C. Kötü Yapılanlar

"Kötü gidenler", "iyileştirilmesi gerekenler" veya "What went wrong" bölümü oluştur.

Bu bölümde:

- Maddeler ayrı liste halinde gösterilsin
- Negatif veya dikkat gerektiren görsel ton kullanılsın
- Gerekirse kategori etiketi eklenebilsin
- Boş veri durumu düzgün ele alınsın

#### D. Katılımcı Listesi

Katılımcılar için ayrı bir bölüm oluştur.

Her katılımcı kartı veya satırında şu bilgiler gösterilsin:

- Ad soyad
- Rol veya takım içindeki görev
- E-posta adresi
- Varsa avatar veya baş harf avatarı
- Katılım durumu mock olarak gösterilebilir

Arama veya filtreleme ile katılımcı bulma kolaylaştırılabilir.

#### E. Aksiyonlar

Retro sonucunda çıkan aksiyon maddeleri için ayrı ve güçlü bir bölüm tasarla.

Her aksiyon satırında en az şu alanlar olsun:

- Aksiyon başlığı
- Açıklama
- Öncelik: düşük, orta, yüksek
- Durum: açık, planlandı, devam ediyor, tamamlandı
- Son tarih
- Sorumlu kişi
- Sorumlu kişinin e-posta bilgisi
- Oluşturulma tarihi

Aksiyonlar için şu etkileşimleri ekle:

- Duruma göre filtreleme
- Sorumlu kişiye göre filtreleme
- Önceliğe göre filtreleme
- Yaklaşan son tarihleri vurgulama
- Gecikmiş aksiyonları kırmızı veya uyarı tonuyla gösterme
- Tamamlanan aksiyonları görsel olarak ayırma

### 4. Aksiyon Sahibi Atama Görünümü

Her aksiyonun kim tarafından ele alınacağı net biçimde görünmeli.

UI tarafında şu yapı olsun:

- "Assigned to" veya "Sorumlu kişi" alanı belirgin olsun
- Katılımcı listesinden seçilmiş gibi görünen mock atama yapısı kullanılsın
- Sorumlu kişi kartı veya badge ile vurgulansın
- Bir aksiyonun sahipsiz olması durumunda görsel uyarı gösterilsin

### 5. Mail ile Hatırlatma Akışı - Sadece Frontend Simülasyonu

Gerçek e-posta gönderimi yapılmayacak. Bunun yerine frontend içinde mail hatırlatma deneyimi simüle edilsin.

Beklenen davranış:

- Her aksiyon satırında "Hatırlatma Gönder" butonu olsun
- Bu butona tıklanınca bir modal veya drawer açılsın
- Modal içinde şu bilgiler gösterilsin:
  - Aksiyon başlığı
  - Sorumlu kişi adı
  - Sorumlu kişi e-posta adresi
  - Hazır mail konusu
  - Hazır mail içeriği
- Kullanıcı isterse mail içeriğini düzenleyebilsin
- "Gönder" butonuna basınca gerçek mail gönderme yerine başarılı bir frontend feedback gösterilsin
- Örneğin:
  - toast mesajı
  - "Hatırlatma gönderildi" etiketi
  - aksiyon satırında "Son hatırlatma tarihi" bilgisi güncellenmiş gibi gösterim
- İstenirse "Daha önce hatırlatma gönderildi" durumu da badge ile gösterilsin

Mail içeriği örneği kullanıcı dostu ve profesyonel olsun:

- Selamlama
- İlgili aksiyon özeti
- Beklenen teslim tarihi
- Gecikme varsa nazik uyarı
- Kapanış

### 6. UI ve UX Beklentileri

Arayüz sade ama güçlü bir kurumsal ürün hissi vermeli.

Özellikle aşağıdakilere dikkat et:

- Eski retro detay sayfasında bilgi yoğunluğu yüksek olacak, buna rağmen okunabilirlik bozulmamalı
- Sekmeli yapı veya accordion kullanılabilir
- İyi yapılanlar, kötü yapılanlar ve aksiyonlar birbirinden net ayrılmalı
- Aksiyon bölümü en güçlü alanlardan biri olmalı
- Desktop ve mobile uyumlu olsun
- Boş durum, loading, hata durumu ve başarı geri bildirimleri eksik bırakılmasın
- Renk ve tipografi mevcut ürün yapısına uyumlu olsun
- Erişilebilirlik düşünülerek form alanları, butonlar ve modal yapıları oluşturulsun

### 7. Teknik Beklentiler

Sadece frontend geliştir.

Backend entegrasyonu yapma.

Gerçek API çağrısı yerine aşağıdaki yöntemlerden birini kullan:

- Mock data
- Local JSON
- Component-level state
- Temporary service abstraction with fake responses

Kod yapısında şunlara dikkat et:

- Bileşenleri ayrıştır
- Tekrar eden UI parçalarını reusable yap
- TypeScript tiplerini tanımla
- Veriyi temsil eden tipler oluştur:
  - Retro summary
  - Retro detail
  - Participant
  - Action item
  - Reminder state
- Loading, empty, error state bileşenleri oluştur
- Eğer mevcut proje Next.js ise mevcut routing ve component yapısına uyumlu ilerle
- Var olan tasarım dilini bozma

### 8. Örnek Veri Modeli Beklentisi

Frontend mock verisinde şu yapılar yer alsın:

- Retro özet listesi
- Retro key bazlı detay
- İyi yapılanlar listesi
- Kötü yapılanlar listesi
- Katılımcılar
- Aksiyonlar
- Her aksiyon için:
  - assignee
  - assignee email
  - due date
  - reminder status
  - last reminder date

### 9. Kabul Kriterleri

İş tamamlandığında kullanıcı aşağıdaki akışları deneyimleyebilmeli:

- Geçmiş retroları listede görebilmeli
- Arama ve filtreleme yapabilmeli
- Retro key girerek eski bir retronun detayına ulaşabilmeli
- İlgili retroda iyi yapılanlar ve kötü yapılanlar listelerini görebilmeli
- Katılımcı listesini görebilmeli
- Aksiyonları, sorumlularını ve durumlarını görebilmeli
- Bir aksiyon için "hatırlatma gönder" deneyimini frontend üzerinde yaşayabilmeli
- Gerçek backend veya gerçek mail servisi olmadan bu akışlar UI seviyesinde çalışmalı

### 10. Çıktı Beklentisi

Üretilecek çıktı sadece frontend odaklı olsun.

Aşağıdakileri dahil et:

- Sayfa ve bileşen yapısı
- Mock veri kullanımı
- Gerekli tip tanımları
- UI durumları
- Aksiyon hatırlatma modalı veya drawer deneyimi
- Temiz, okunabilir, genişlemeye uygun kod yapısı

Gerçekleştirme sırasında backend tarafına geçme, API yazma, database modeli üretme veya gerçek mail servisi entegre etme.

## Kısa Uygulama Notu

Eğer bu prompt bir kod üretim aracına verilecekse, şu çerçeve korunmalı:

- Sadece FE kapsamı
- Mock data ile çalışan akışlar
- Next.js yapısına uyumlu sayfa ve component tasarımı
- Aksiyon hatırlatma deneyiminin UI simülasyonu
- Listeleme, detay, filtreleme ve kullanıcı geri bildirim durumlarının eksiksiz ele alınması