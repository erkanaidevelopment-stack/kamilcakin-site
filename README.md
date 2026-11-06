# Prof. Dr. Kamil Çakın — Web sitesi

Hadis, gelenek ve modern dönem üzerine akademik bilgi platformu.
Site, yönetim paneli, yazılar, görseller ve PDF'ler bu depoda durur; GitHub Pages'ta ücretsiz yayınlanır.

## İçerik nasıl güncellenir?

1. `https://kamilcakin.com/admin/` adresine gidin (alan adı bağlanana kadar: `https://KULLANICI.github.io/kamilcakin-site/admin/`).
2. **Sign In Using Access Token** düğmesine basın ve GitHub erişim anahtarınızı yapıştırın (aşağıya bakın).
3. Soldaki menüden bölümü seçin, ekleyin, düzenleyin ya da silin, sonra **Save** deyin.
4. Site 1–2 dakika içinde kendiliğinden güncellenir.

| Panelde | Sitede |
|---|---|
| Yazılar | Ana sayfadaki son yazı, Yazılar sayfası |
| Akademik yayınlar | Yayınlar listesi ve konu düğmeleri |
| Kitaplar | Hocanın kitapları |
| Videolar | YouTube bağlantısını yapıştırmanız yeterli |
| Araştırma alanları | Ana sayfadaki alan kartları |
| Klasik eserler | Kitap rafındaki ciltler ve kartlar |
| Soru-Cevap | Ana sayfa ve Soru-Cevap sayfası |
| Sayfa ayarları → Ana sayfa | Büyük görsel, slogan, sayılar, **bölümlerin sırası ve görünürlüğü** |
| Sayfa ayarları → Hakkında | Portre, kısa bilgiler, özgeçmiş |
| Sayfa ayarları → Genel ve iletişim | E-posta, YouTube, ORCID, Google Scholar, bülten bağlantısı |

Bir kaydı silmeden gizlemek için **Sitede yayında** anahtarını kapatın.
İçeriği olmayan bölümler (ör. hiç video yoksa Videolar) sitede kendiliğinden gizlenir.

## Erişim anahtarı (bir kez yapılır)

GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**

- Repository access: **Only select repositories** → `kamilcakin-site`
- Permissions → Repository permissions → **Contents: Read and write**
- Süre: 1 yıl (süresi dolunca aynı adımlarla yenisini oluşturun)

Anahtarı kimseyle paylaşmayın; panel onu yalnızca kendi tarayıcınızda saklar.

## Alan adı (kamilcakin.com)

Depoda **Settings → Pages → Custom domain** alanına `kamilcakin.com` yazın, alan adı sağlayıcısında GitHub'ın gösterdiği DNS kayıtlarını girin ve **Enforce HTTPS** seçeneğini açın.

## Geliştirici notları

- Astro 7 (statik site), GSAP + Lenis (animasyon), Sveltia CMS (panel, `public/admin/`).
- `npm run dev` yerel geliştirme, `npm run build` derleme.
- `main` dalına her gönderimde `.github/workflows/yayinla.yml` siteyi derleyip GitHub Pages'a yayınlar.
