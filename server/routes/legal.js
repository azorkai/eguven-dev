import express from 'express';

/* ---------------------------------------------------------------------------
 *  YASAL BELGELER
 *
 *  Mobil uygulamaların gizlilik politikası, kullanım koşulları ve hesap silme
 *  sayfaları. Bunlar takipkit.com üzerinde de duruyordu ve oradan taşındılar:
 *  o alan adı bir sosyal medya mağazasıdır ("Türk Takipçi, Beğeni & İzlenme
 *  Satın Al") ve her iki mağaza da yapay etkileşim sağlayan hizmetleri
 *  yasaklıyor. Uygulama bunu yapmıyor ama ödeme ekranındaki zorunlu gizlilik
 *  bağlantısına tıklayan inceleyen kişi doğrudan o mağazaya düşüyordu. Bağlantı
 *  hedefi burada olduğunda o çağrışım kalmıyor.
 *
 *  NİÇİN REACT ROTASI DEĞİL, SUNUCUDAN TAM HTML
 *  Bu dosyadaki sayfalar JavaScript çalıştırmadan okunabilir olmak zorunda.
 *  index.js'in sosyal kart bölümü aynı gerekçeyi zaten yazıyor: crawler JS
 *  çalıştırmaz. Mağazaların gizlilik politikası denetimi ve bağlantı sağlık
 *  kontrolleri de aynı sınıfta; boş bir SPA kabuğu döndüren bir adres "politika
 *  yok" olarak işaretlenebilir. Ayrıca SPA'ya dokunmadığı için portföyü
 *  bozma ihtimali sıfır.
 *
 *  SIRA ÖNEMLİ: bu router index.js'te `/*splat` kabuk rotasından ÖNCE
 *  bağlanmalı, yoksa istekler React'e gider ve buradaki HTML hiç çalışmaz.
 * ------------------------------------------------------------------------- */

const router = express.Router();

/** Ticaret Sicil Tasdiknamesi (2026-GD-49272) ve Vergi Levhası'ndan birebir. */
const ENTITY = {
    name: 'EMİRHAN GÜVEN GÜVEN YAZILIM HİZMETLERİ',
    type: 'Gerçek kişilere ait ticari işletme',
    mersis: '4872729489000001',
    registry: '1139793',
    registryOffice: 'İstanbul Ticaret Sicili Müdürlüğü',
    taxId: '48727294890',
    taxOffice: 'Küçükçekmece',
    address: 'Cennet Mah. Hürriyet Cad. Küçükçekmece / İstanbul',
    email: 'info@takipkit.com',
};

const APP = {
    slug: 'takipkit-analiz',
    name: 'Takipkit Analiz',
    androidId: 'com.takipkit.analiz',
    iosId: 'com.takipkit.analiz',
};

const UPDATED = '2026-09-04';
const BASE = `/legal/${APP.slug}`;

const esc = (v) =>
    String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Stil satır içi: bu sayfalar Vite paketinden bağımsız çalışmak zorunda.
   Renkler src/index.css'teki kağıt/mürekkep tokenlarının aynısı. */
const STYLE = `
:root{color-scheme:light dark}
*{box-sizing:border-box}
body{margin:0;background:#f6f2e9;color:#2e2a24;
  font:16px/1.65 ui-serif,Georgia,"Times New Roman",serif;
  -webkit-text-size-adjust:100%}
.wrap{max-width:46rem;margin:0 auto;padding:2.5rem 1.25rem 5rem}
a{color:#a12c20}
a:hover{color:#c1392b}
header{border-bottom:2px solid #1c1a16;padding-bottom:1rem;margin-bottom:2rem}
.kicker{font:600 .75rem/1.4 ui-sans-serif,system-ui,sans-serif;letter-spacing:.14em;
  text-transform:uppercase;color:#6b6358;margin:0 0 .5rem}
h1{font-size:2rem;line-height:1.2;margin:0;color:#1c1a16;letter-spacing:-.01em}
.sub{margin:.6rem 0 0;color:#6b6358}
h2{font-size:1.2rem;margin:2.5rem 0 .75rem;color:#1c1a16;
  border-bottom:1px solid #d5c9b3;padding-bottom:.35rem}
h3{font-size:1rem;margin:1.5rem 0 .5rem;color:#1c1a16}
p,li{color:#2e2a24}
ul,ol{padding-left:1.25rem}
li{margin:.35rem 0}
table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:.95rem}
th,td{border:1px solid #d5c9b3;padding:.5rem .65rem;text-align:left;vertical-align:top}
th{background:#ede6d8;font:600 .85rem/1.4 ui-sans-serif,system-ui,sans-serif}
code{background:#ede6d8;padding:.1rem .35rem;border-radius:3px;
  font:.9em ui-monospace,SFMono-Regular,Menlo,monospace}
.note{background:#faf7f0;border-left:3px solid #c1392b;padding:.85rem 1rem;margin:1.5rem 0}
footer{margin-top:3.5rem;padding-top:1rem;border-top:1px solid #d5c9b3;
  font-size:.875rem;color:#6b6358}
footer a{margin-right:1rem}
@media(prefers-color-scheme:dark){
  body{background:#16140f;color:#ddd5c6}
  h1,h2,h3{color:#f2ece0}
  p,li{color:#ddd5c6}
  th{background:#221f18}
  th,td{border-color:#3f382c}
  code,.note{background:#1e1b15}
  .kicker,.sub,footer{color:#9a9184}
  a{color:#e8836f}
}
`;

function page({ title, description, path, body }) {
    const url = `https://eguven.dev${path}`;
    return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · ${esc(APP.name)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)} · ${esc(APP.name)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<style>${STYLE}</style>
</head>
<body>
<div class="wrap">
<header>
  <p class="kicker">${esc(APP.name)}</p>
  <h1>${esc(title)}</h1>
  <p class="sub">${esc(description)}</p>
  <p class="sub">Son güncelleme: <time datetime="${UPDATED}">${UPDATED}</time></p>
</header>
${body}
<footer>
  <a href="${BASE}/gizlilik">Gizlilik Politikası</a>
  <a href="${BASE}/kosullar">Kullanım Koşulları</a>
  <a href="${BASE}/hesap-silme">Hesap Silme</a>
  <a href="/">eguven.dev</a>
  <p>${esc(ENTITY.name)} · MERSİS ${esc(ENTITY.mersis)} · ${esc(ENTITY.address)}</p>
</footer>
</div>
</body>
</html>`;
}

const identityTable = `
<table>
  <tr><th>Unvan</th><td>${esc(ENTITY.name)}</td></tr>
  <tr><th>Türü</th><td>${esc(ENTITY.type)}</td></tr>
  <tr><th>MERSİS</th><td>${esc(ENTITY.mersis)}</td></tr>
  <tr><th>Ticaret sicil no</th><td>${esc(ENTITY.registry)} (${esc(ENTITY.registryOffice)})</td></tr>
  <tr><th>Vergi kimlik no</th><td>${esc(ENTITY.taxId)} · ${esc(ENTITY.taxOffice)} Vergi Dairesi</td></tr>
  <tr><th>Adres</th><td>${esc(ENTITY.address)}</td></tr>
  <tr><th>E-posta</th><td><a href="mailto:${esc(ENTITY.email)}">${esc(ENTITY.email)}</a></td></tr>
</table>`;

/* ── Dizin ──────────────────────────────────────────────────────────────── */

router.get(`${BASE}`, (req, res) => {
    res.type('html').send(page({
        title: 'Yasal belgeler',
        description: `${APP.name} mobil uygulamasının gizlilik, kullanım ve hesap silme belgeleri.`,
        path: BASE,
        body: `
<p>Bu sayfalar <strong>${esc(APP.name)}</strong> mobil uygulamasını kapsar
(Android <code>${esc(APP.androidId)}</code>, iOS <code>${esc(APP.iosId)}</code>).</p>
<ul>
  <li><a href="${BASE}/gizlilik">Gizlilik Politikası</a></li>
  <li><a href="${BASE}/kosullar">Kullanım Koşulları</a></li>
  <li><a href="${BASE}/hesap-silme">Hesap Silme Talebi</a></li>
</ul>
<h2>Uygulamayı yayınlayan</h2>
${identityTable}
<div class="note">
  <p>${esc(APP.name)} bağımsız bir üründür; Instagram, Meta ya da başka bir sosyal ağ
  ile bağlantısı, ortaklığı veya onayı yoktur. Uygulama yalnız herkese açık profil
  verisini okur ve hiçbir aşamada sosyal medya şifresi veya oturumu istemez.</p>
</div>`,
    }));
});

/* ── Gizlilik ───────────────────────────────────────────────────────────── */

router.get(`${BASE}/gizlilik`, (req, res) => {
    res.type('html').send(page({
        title: 'Gizlilik Politikası',
        description: 'Hangi veriler toplanıyor, niçin işleniyor, ne kadar saklanıyor ve nasıl siliniyor.',
        path: `${BASE}/gizlilik`,
        body: `
<h2>1. Veri sorumlusu</h2>
${identityTable}

<h2>2. Toplanan veriler</h2>
<table>
  <tr><th>Veri</th><th>Niçin</th><th>Zorunlu mu</th></tr>
  <tr><td>E-posta adresi</td><td>Hesap açma, giriş, şifre sıfırlama</td><td>Evet</td></tr>
  <tr><td>Görünen ad</td><td>Hesap ekranında kimlik</td><td>Hayır</td></tr>
  <tr><td>Satın alma kayıtları</td><td>Abonelik ve jeton hakkının doğrulanması</td><td>Hayır</td></tr>
  <tr><td>Cihaz bildirim anahtarı</td><td>Bildirim gönderimi</td><td>Hayır</td></tr>
  <tr><td>Çökme ve hata kayıtları</td><td>Hataların bulunup düzeltilmesi</td><td>Hayır</td></tr>
</table>

<h3>Analiz edilen sosyal medya hesapları</h3>
<p>Uygulamanın ölçtüğü profiller <strong>herkese açık</strong> verilerdir ve lisanslı bir veri
sağlayıcısından, kendi sunucumuz üzerinden gelir. Bu ölçümler <strong>hesabı ölçülen kişiye</strong>
aittir, uygulamayı kullanan kişiye değil; kimin baktığı bilgisini taşımaz. Kullanıcı hesabınıza
bağlanan tek şey, hangi profilleri takip etmeyi seçtiğinizdir.</p>

<div class="note">
  <p><strong>Sosyal medya şifreniz hiçbir aşamada istenmez.</strong> Uygulama Instagram'a ya da
  başka bir ağa sizin adınıza bağlanmaz, oturum açmaz, gönderi paylaşmaz.</p>
</div>

<h2>3. İşleme amaçları ve hukuki sebep</h2>
<ul>
  <li><strong>Sözleşmenin kurulması ve ifası:</strong> hesap yönetimi, aboneliğin sağlanması.</li>
  <li><strong>Meşru menfaat:</strong> hata ayıklama, kötüye kullanımın önlenmesi, hizmet güvenliği.</li>
  <li><strong>Hukuki yükümlülük:</strong> mali kayıtların saklanması.</li>
  <li><strong>Açık rıza:</strong> bildirim izni (istediğiniz an cihaz ayarlarından geri alınır).</li>
</ul>

<h2>4. Paylaşım</h2>
<p>Veriler satılmaz, pazarlama amacıyla üçüncü taraflara aktarılmaz. Yalnız hizmetin çalışması
için gereken <strong>veri işleyenler</strong> kullanılır:</p>
<ul>
  <li><strong>Mağaza ve abonelik doğrulaması</strong> (Apple App Store, Google Play, RevenueCat)</li>
  <li><strong>Çökme raporlama</strong> (Sentry) — istek gövdeleri ve başlıklar gönderilmeden önce silinir, yalnız kullanıcı kimliği taşınır</li>
  <li><strong>Bildirim iletimi</strong> (Expo / platform bildirim servisleri)</li>
</ul>
<p><strong>Reklam yoktur, reklam kimliği kullanılmaz, uygulamalar arası izleme yapılmaz.</strong></p>

<h2>5. Saklama süreleri</h2>
<ul>
  <li>Hesap verileri: hesap silinene kadar.</li>
  <li>Fatura, ödeme ve sipariş kayıtları: <strong>beş yıl</strong> (Vergi Usul Kanunu m.253).</li>
  <li>Sunucu ve güvenlik kayıtları: en fazla bir yıl.</li>
  <li>Ölçülen profillere ait sayısal seriler: süresiz; bu veri kişisel veriniz değildir.</li>
</ul>

<h2>6. Güvenlik</h2>
<p>Tüm trafik TLS ile şifrelenir. Şifreler geri döndürülemez özet olarak saklanır. Yetkili
erişim kayıt altına alınır.</p>

<h2>7. Haklarınız</h2>
<p>KVKK m.11 uyarınca verilerinize erişme, düzeltme, silme, işlemeye itiraz etme ve aktarılan
taraf bilgisini isteme haklarına sahipsiniz. Başvuru:
<a href="mailto:${esc(ENTITY.email)}">${esc(ENTITY.email)}</a>. Hesabınızı kendiniz silmek için
<a href="${BASE}/hesap-silme">hesap silme sayfasına</a> bakın.</p>

<h2>8. Çocuklar</h2>
<p>Uygulama 18 yaş ve üzeri için tasarlanmıştır; çocuklardan bilerek veri toplanmaz.</p>

<h2>9. Değişiklikler</h2>
<p>Bu metin değiştiğinde yukarıdaki güncelleme tarihi yenilenir. Esaslı değişikliklerde
uygulama içinde bilgilendirme yapılır.</p>`,
    }));
});

/* ── Koşullar ───────────────────────────────────────────────────────────── */

router.get(`${BASE}/kosullar`, (req, res) => {
    res.type('html').send(page({
        title: 'Kullanım Koşulları',
        description: 'Hizmetin kapsamı, abonelik ve jeton kuralları, sorumluluk sınırları.',
        path: `${BASE}/kosullar`,
        body: `
<h2>1. Taraflar</h2>
${identityTable}
<p>Uygulamayı indirerek ve kullanarak bu koşulları kabul etmiş olursunuz.</p>

<h2>2. Hizmetin kapsamı</h2>
<p>${esc(APP.name)}, herkese açık sosyal medya profil verilerini ölçer ve bu ölçümlerden
türeyen öneriler sunar. Hizmet <strong>bilgi amaçlıdır</strong>; belirli bir takipçi artışı,
erişim ya da gelir taahhüdü içermez.</p>
<ul>
  <li>Uygulama takipçi, beğeni, izlenme veya etkileşim <strong>satmaz</strong>.</li>
  <li>Sosyal medya hesabınıza giriş yapmaz, şifrenizi istemez, adınıza içerik paylaşmaz.</li>
  <li>Ölçülemeyen bir değer boş bırakılır; sıfır olarak ya da tahminle doldurulmaz.</li>
</ul>

<h2>3. Veri kaynağı ve doğruluk</h2>
<p>Veriler lisanslı üçüncü taraf bir sağlayıcıdan gelir. Sağlayıcının veya sosyal ağın
sunduğu bilgi eksik, gecikmeli ya da hatalı olabilir. Uygulama ölçümün kaynağını ve yaşını
ekranda belirtir; bu bilgilere dayanarak alacağınız kararların sorumluluğu size aittir.</p>

<h2>4. Hesap</h2>
<p>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz. Hesabınızı başkasına devredemezsiniz.
Hizmeti hukuka aykırı biçimde, otomatik araçlarla kötüye kullanarak ya da sistemlere zarar
verecek şekilde kullanmanız hâlinde hesap askıya alınabilir.</p>

<h2>5. Abonelik ve jeton</h2>
<ul>
  <li>Ücretli özellikler <strong>yalnızca uygulama içi satın alma</strong> ile satılır; ödeme
      Apple App Store veya Google Play üzerinden alınır.</li>
  <li>Abonelik, dönem bitiminden en az 24 saat önce iptal edilmezse <strong>otomatik yenilenir</strong>.
      Yenileme ücreti dönem bitiminden önceki 24 saat içinde tahsil edilir.</li>
  <li>Abonelik yönetimi ve iptali mağaza hesabınızın ayarlarından yapılır.</li>
  <li>Jetonlar tüketilebilir dijital üründür; kullanıldıktan sonra iade edilmez ve hesap
      silindiğinde kalan bakiye yanar.</li>
  <li>İade talepleri, mağazanın kendi iade politikasına tabidir.</li>
</ul>
<p>Ücretsiz deneme uygulama tarafından tanınır, mağaza tarafından değil: ödeme aracı istenmez
ve süre bittiğinde kendiliğinden bir satın alma gerçekleşmez.</p>

<h2>6. Fikri mülkiyet</h2>
<p>Uygulamanın yazılımı, tasarımı, metinleri ve marka öğeleri ${esc(ENTITY.name)}'ne aittir.
Ölçüm sonuçlarını kişisel veya kurumsal amaçla kullanabilir, paylaşabilirsiniz.</p>

<h2>7. Bağımsızlık</h2>
<div class="note">
  <p>${esc(APP.name)}, Instagram, Meta Platforms ya da başka bir sosyal ağ tarafından
  desteklenmez, onaylanmaz ve bu şirketlerle bağlantılı değildir. Anılan tüm marka adları
  yalnız tarif amacıyla kullanılır ve sahiplerine aittir.</p>
</div>

<h2>8. Sorumluluğun sınırı</h2>
<p>Hizmet "olduğu gibi" sunulur. Kesintisiz veya hatasız çalışacağı taahhüt edilmez.
Kanunun izin verdiği ölçüde, dolaylı zararlardan sorumluluk kabul edilmez; her hâlükârda
sorumluluk, talebe konu dönemde ödediğiniz tutarla sınırlıdır.</p>

<h2>9. Fesih</h2>
<p>Hesabınızı istediğiniz an uygulama içinden silebilirsiniz. Bu koşulları esaslı biçimde
ihlal etmeniz hâlinde hesabınız kapatılabilir.</p>

<h2>10. Uygulanacak hukuk</h2>
<p>Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Uyuşmazlıklarda İstanbul (Küçükçekmece)
mahkemeleri ve icra daireleri yetkilidir. Tüketici işlemlerinde tüketici hakem heyetlerine
başvuru hakkınız saklıdır.</p>`,
    }));
});

/* ── Hesap silme ────────────────────────────────────────────────────────── */

router.get(`${BASE}/hesap-silme`, (req, res) => {
    res.type('html').send(page({
        title: 'Hesap Silme Talebi',
        description: 'Hesabınızı ve verilerinizi kalıcı olarak kaldırma yolları, silinen ve saklanan veri listesi.',
        path: `${BASE}/hesap-silme`,
        body: `
<p>Bu sayfa <strong>${esc(ENTITY.name)}</strong> tarafından yayınlanan
<strong>${esc(APP.name)}</strong> uygulaması için geçerlidir
(<code>${esc(APP.androidId)}</code>).</p>

<h2>1. Uygulama içinden silme</h2>
<p>En hızlı yol budur ve talebiniz <strong>anında</strong> işlenir.</p>
<ol>
  <li>Uygulamayı açın ve hesabınıza giriş yapın.</li>
  <li>Alt sekme çubuğundan <strong>Hesap</strong> sekmesine gidin.</li>
  <li>Sayfanın altındaki <strong>Hesabımı sil</strong> satırına dokunun.</li>
  <li>Açılan pencerede silinecekleri okuyun ve onaylayın.</li>
</ol>
<p>İşlemin <strong>geri dönüşü yoktur</strong>.</p>

<h2>2. Uygulamayı kurmadan silme</h2>
<p>Uygulamayı kaldırdıysanız ya da giriş yapamıyorsanız, talebinizi hesabınızda
<strong>kayıtlı e-posta adresinden</strong>
<a href="mailto:${esc(ENTITY.email)}?subject=Hesap%20silme%20talebi">${esc(ENTITY.email)}</a>
adresine gönderin. Kimlik doğrulaması bu şekilde yapılır; başka bir adresten gelen talep
işleme alınamaz. <strong>Şifrenizi veya kart bilgilerinizi yazmayın</strong>, bunlara ihtiyaç yoktur.</p>

<h2>3. Silinen veriler</h2>
<ul>
  <li>Kimlik bilgileri: e-posta, ad, telefon, şifre özeti</li>
  <li>Fatura profili: ad, adres, telefon, vergi/kimlik numarası</li>
  <li>Bildirim cihazları ve bildirim tercihleri</li>
  <li>Takip listeniz, panonuza bağlı hesaplar, raporlarınız ve yapay zekâ yorumlarınız</li>
  <li>Varsa yayındaki sayfalarınız ve ziyaret istatistikleri</li>
  <li>Sepetiniz ve varsa API anahtarlarınız</li>
</ul>
<p>E-posta adresiniz ayrıca <strong>gönderim engel listesine</strong> eklenir; bir daha
pazarlama e-postası gönderilmez.</p>

<h2>4. Saklanan veriler ve süresi</h2>
<p>Vergi Usul Kanunu m.253 uyarınca fatura, ödeme ve sipariş kayıtları <strong>beş yıl</strong>
saklanmak zorundadır. Silme hakkınız bu yükümlülüğü ortadan kaldırmaz.</p>
<table>
  <tr><th>Kayıt</th><th>Süre</th></tr>
  <tr><td>Sipariş, fatura, ödeme kayıtları (anonimleştirilmiş kimliğe bağlı)</td><td>Beş yıl</td></tr>
  <tr><td>Jeton hareket defteri</td><td>Beş yıl</td></tr>
  <tr><td>Gönderim engel listesindeki e-posta adresi</td><td>Süresiz</td></tr>
  <tr><td>Ölçülen profillere ait sayısal seriler (kişisel veriniz değildir)</td><td>Süresiz</td></tr>
  <tr><td>Sunucu ve güvenlik kayıtları</td><td>En fazla bir yıl</td></tr>
</table>

<h2>5. Silmenin sonuçları</h2>
<ul>
  <li>Hesaba bir daha giriş yapamazsınız.</li>
  <li>Kalan jetonlarınız yanar; devredilmez ve iade edilmez.</li>
  <li><strong>Aboneliğiniz kendiliğinden iptal olmaz.</strong> Uygulama içi abonelikleri yalnız
      mağaza yönetir; App Store için iPhone ayarlarından, Google Play için Play Store
      uygulamasından iptal etmeniz gerekir.</li>
  <li>Aynı e-posta ile yeniden kaydolabilirsiniz; bu eski hesabı geri getirmez.</li>
</ul>

<h2>6. Süre</h2>
<p>Uygulama içinden yapılan silme anında uygulanır. E-posta ile gelen talepler, kayıtlı
adresten geldiği doğrulandıktan sonra <strong>en geç 30 gün</strong> içinde işlenir. Yedek
kopyalar yedek dönüşümü tamamlandığında geçersiz hale gelir.</p>`,
    }));
});

export default router;
