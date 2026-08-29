import type { PlayerSellsContent } from './playersells.en';

/* ---------------------------------------------------------------------------
 *  PlayerSells vaka incelemesi, Türkçe.
 *
 *  Sayılar ve iddialar İngilizce metinle birebir aynı; sadece dili değişti.
 *  Ürün, tablo ve tanımlayıcı adları çevrilmedi. Sektörde yerleşmiş terimler
 *  olduğu gibi kaldı: scraper, crawler, rate limit, deploy, pool, cache,
 *  endpoint, breaker. "scraper" için "tarayıcı" yazılmadı; o kelime tarayıcı
 *  yazılımıyla karışıyor.
 *
 *  Ondalık ayırıcı virgül, binlik ayırıcı nokta. Kod parçalarının içindeki
 *  sayılar kaynakta nasılsa öyle bırakıldı.
 *
 *  <Sub> başlıkları CSS ile büyük harfe çevriliyor ve sayfa lang="tr" altında
 *  duruyor, yani "i" harfi "İ" oluyor. Bu yüzden ara başlıklarda içinde "i"
 *  geçen İngilizce kelime yok: noindex, sitemap, script gibi kelimeler
 *  başlıkta değil, gövde metninde kod parçası olarak duruyor.
 * ------------------------------------------------------------------------- */

export const playersellsTr: PlayerSellsContent = {
    meta: {
        title: 'PlayerSells vaka incelemesi | Emirhan Güven',
        desc:
            'PlayerSells nasıl çalışıyor: beş ağda 25,3 milyon indekslenmiş sosyal hesap, sıfır ' +
            'veritabanı sorgusuyla verilen takipçi yüzdeliği, çoklu karşılaştırma düzeltmesi olan ' +
            'hesap içi eşleştirmeli bir tahminci ve yirmi beş ücretsiz aracın önünde duran tek ' +
            'bir kapı.',
    },

    kicker: 'VAKA İNCELEMESİ',
    byline: 'TEK GELİŞTİRİCİ / MART 2026’DAN BERİ CANLIDA',

    standfirst:
        'Sosyal medya hesabı alıp satmak için kurulmuş, emanet sistemiyle çalışan bir pazar yeri; bir de her alıcının sorduğu ama kimsenin dürüstçe cevaplayamadığı tek soruya cevap vermek için altında büyüyen veri katmanı: bu hesap gerçekten bir şey ediyor mu? Crawler’lar, veritabanı, uygulama, deploy ve nöbet, hepsi bende. ==Beş ağda 25,3 milyon indekslenmiş hesap.==',
    intro:
        'Pazar yerinin kendisi sıradan bir yazılım: ilanlar, işlemler, bir durum makinesi, cüzdan, itirazlar. İlginç kısım, o soruya cevap vermek için gerekenler. Kimsenin satmadığı bir veri gerekiyordu; proje de bunun üzerine bir crawler yığını, 25 milyon satırlık bir hesap kataloğu, bir takip grafiği, gönderi düzeyinde bir istihbarat katmanı ve bunların üstünde üç halka açık ürün büyüttü: 25 ücretsiz araç, beş takipçi sıralaması sayfası ve X’te etkileşimi neyin gerçekten değiştirdiğine dair yayımlanmış çalışmalar. Bu sayfa o üçünü anlatıyor. Sıralama sayfaları bütün yaklaşımın en net örneği: “kaç takipçi çoktur” sorusuna 18,5 milyon indekslenmiş hesap üzerinden gerçek bir dağılımla cevap veriyorlar, üstelik bunu sıfır veritabanı sorgusuyla yapıyorlar.',

    stats: [
        ['25,3 M', '5 ağda indekslenmiş hesap'],
        ['12-44sn → 0', 'sayfa açılışındaki yüzdelik sorgusu, öncesi ve sonrası'],
        ['79,8 M', 'takip grafiği kenarı'],
        ['25', 'tek kapının arkasındaki ücretsiz araç'],
        ['1.156', 'her build’de statik üretilen sayfa, 24 saniyede'],
        ['18.002', 'satır Python, crawler yığınının arkasında'],
    ],
    statsNote:
        'Hepsi depoda sayıldı, canlı deploy loglarından okundu ya da neyin nerede ölçüldüğünü yazan bir kod yorumundan alındı. Katalog satır sayıları ve süre ölçümleri 2026-08-24 ve öncesi tarihli yorumlardan geliyor. Depo özel; dolayısıyla kanıt bu sayfa.',

    contents: 'İÇİNDEKİLER',
    contentsAria: 'İçindekiler',

    toc: {
        problem: 'Problem',
        architecture: 'Mimari',
        rank: 'Sıralama motoru',
        framing: 'Popülasyon mu, takip mi',
        insights: 'İçgörü motoru',
        guard: 'Tek kapı, 25 araç',
        graph: 'Takip grafiği',
        seo: 'Kısıt olarak SEO',
        failures: 'İşe yaramayanlar',
        stack: 'Teknolojiler',
        numbers: 'Rakamlar',
        links: 'Bağlantılar',
    },

    heading: {
        problem: 'Problem',
        architecture: 'Mimari',
        rank: 'Sıralama motoru: arkasında sorgu olmayan bir yüzdelik',
        framing: 'Popülasyon mu, takip mi: cümlenin fiilini değiştiren bir alan',
        insights: 'İçgörü motoru ve hiçbir şey bulamayan bir tahminci',
        guard: 'Yirmi beş araç için tek kapı',
        graph: 'Takip grafiği ve gerçekte neyi ölçtüğünü söylemek',
        seo: 'Mühendislik kısıtı olarak SEO',
        failures: 'İşe yaramayanlar',
        stack: 'Teknolojiler',
        numbers: 'Rakamlar',
        links: 'Bağlantılar',
    },

    /* ---- 01 --------------------------------------------------------------- */
    problem: {
        intro: [
            'Birine Telegram’dan bir X hesabı teklif edilmiş ve tanımadığı birine 150 ile 2.000 dolar arası para göndermek üzere. Elinde bir takipçi sayısının ekran görüntüsünden başka hiçbir şey yok. Satıcının derdi tam tersi: elinde gerçekten değerli bir şey var ama bunu kanıtlayacak hiçbir yolu yok.',
            'Buradan üç somut problem çıkıyor.',
        ],
        subs: [
            {
                head: 'Takipçi sayısının ne demek olduğunu kimse bilmiyor',
                body: '“42.000 takipçi” paydası olmayan bir sayı. Çok mu? Platformlar dağılımı yayımlamıyor, yayımladığını iddia eden her üçüncü parti araç ise ya tahmin yürütüyor ya da elindeki örneklemi sessizce popülasyon diye sunuyor. Doğru düzgün cevap vermek için bir veri kümesi gerekiyor, veri kümesi için de bir crawler.',
            },
            {
                head: 'Asıl önemli sinyaller profilde durmuyor',
                body: 'Takipçi sayısı herkesin baktığı tek sayı ve mevcut sinyallerin en az bilgi vereni sayılır. Attığı gönderiye üç beğeni alan 100.000 takipçili bir hesap, üç bin alanla tamamen farklı bir varlık, profil sayfasında ise ikisini ayıran hiçbir şey yok. Ayırt etmek için gönderi düzeyinde veri gerekiyor, o da akışları okumak demek, o da pahalı.',
            },
            {
                head: 'Veri kaynağı ortak, sınırlı ve banlanabilir',
                body: 'X tarafındaki veri yolu, resmî olmayan GraphQL uçlarını süren 35 tek kullanımlık hesaplık bir havuzun üstünde çalışıyor. Aynı havuz, bir satıcı ilan açtığında kullanıcı adının gerçekten ona ait olduğunu da doğruluyor. Ücretsiz halka açık araçlar ile geliri doğrudan etkileyen satıcı kaydı aynı kuyudan içiyor ve o kuyu tek bir shell döngüsüyle zehirlenebiliyor. Sistemdeki tasarımı en çok şekillendiren şey bu oldu.',
            },
        ],
    },

    /* ---- 02 --------------------------------------------------------------- */
    architecture: {
        intro:
            'Tek bir Hetzner sunucusunda, bir Docker ağıyla birbirine bağlanmış iki yığın; aralarında da sert bir salt okunur sınır var.',
        pieces: [
            {
                name: 'Engine yığını',
                tech: 'Python, 14 container, kendi Postgres’i',
                why: 'Crawler’lar. Ağ başına bir servis, üstüne ortak bir keşif ve rollup katmanı. Kataloğu bu yazıyor.',
            },
            {
                name: 'Uygulama',
                tech: 'Next.js 16 App Router, React 19, TypeScript',
                why: 'Pazar yeri ve bütün halka açık sayfalar. Kataloğu okuyor, yazamıyor.',
            },
            {
                name: 'Pazar yeri veritabanı',
                tech: 'Postgres 17, PostgREST 12.2.3',
                why: 'Kullanıcılar, ilanlar, işlemler, cüzdan. Haziran 2026’dan beri kendi sunucumuzda.',
            },
            {
                name: 'Edge',
                tech: 'Caddy 2',
                why: 'TLS, PostgREST’e giden `/rest` yolu ve istemci IP’sinin normalize edilmesi.',
            },
        ],
        whyNotHead: 'Ayrım neden servis sınırı değil de veritabanı rolü',
        whyNot: [
            'Uygulama, engine tarafındaki Postgres’e ortak Docker ağı üzerinden `directory_reader` olarak bağlanıyor; bu rolde `SELECT` var, başka hiçbir şey yok. Bütün izolasyon mekanizması bu. İki yığın arasında API yok, mesaj kuyruğu yok, sürümlenecek bir sözleşme yok.',
            'Kulağa tembellik gibi geliyor, ta ki karşılığında ne aldığına bakana kadar. Halka açık rehber sayfaları her istekte o bağlantı üzerinden servis ediliyor. İleride yazılacak bir route handler ne yaparsa yapsın, ne kadar kötü yaparsa yapsın, kataloğa yazamıyor; çünkü veritabanı buna izin vermiyor. Yönetim konsolunun yazması gerekiyor, LinkedIn lead yönetimi için; o yüzden ilk rolü genişletmek yerine ikinci bir rol üzerinde ikinci bir pool açıldı: `linkedin_writer`, üç fiil ve tek bir sütun bazlı yetki. `directory-db.ts` içindeki yorum bunun bilinçli olduğunu açıkça yazıyor: okuma yolu, hangi route handler ne yaparsa yapsın yazmaktan aciz kalmalı.',
            'İkinci pool bilerek küçük tutuldu, okuma pool’unun `max: 8` değerine karşılık `max: 3`, ve sebebi de yanına yazılmış: bu makinede iki kaçak pool zaten iki kez tükendi.',
        ],
        crawlerHead: 'Neden API değil de bir crawler yığını',
        crawler: [
            'Çünkü bu projenin ödeyebileceği fiyatta bir API yok. Ücretli sağlayıcı çağrı başına faturalandırıyor ve bakiyesi 2026-08-11’de bitti, bu da dokuz aracı birden düşürdü. Resmî YouTube Data API’si var ama şartları saklamayı 30 günle sınırlıyor ve yeniden dağıtımı yasaklıyor; YouTube kanallarının katalogda halka açık profil sayfası olmayan tek platform olmasının sebebi bu, sadece toplu istatistik var. Geri kalan her şey tek kullanımlık hesaplardan oluşan bir havuzun üstünde `twscrape` ile dönüyor: parayla hiçbir maliyeti yok, ilgiyle çok fazla.',
        ],
        runtimeHead: 'Çalışma zamanı görünümü',
        runtime: [
            'Engine: 41 Python dosyası, 18.002 satır; ayrıca 13 SQL şema dosyası, 2.802 satır. 14 compose servisi: ağ başına bir crawler, ortak bir keşif motoru, `xlookup` okuma servisi, bir IPv6 proxy ve Postgres.',
            'Uygulama: 1.196 TypeScript ve TSX dosyası, mock verileri hariç 314.842 satır. 245 route handler, 244 sayfa dosyası. Canlı build 617 ayrı rota üretiyor ve 24 saniyede 1.156 sayfayı statik olarak basıyor.',
            'Katalog: `xdir_accounts` 18,5M satır, `bdir_accounts` 3,8M, `tgdir_chats` 3,0M, `ytdir_channels` 35,1K, `ttdir_accounts` 17,5K. Bir de takip grafiği `xedges`, 79,8M satır, ve gönderi akışı `scraper.x_tweets`, 90 günlük saklama penceresiyle.',
            'Yerelleştirme: dört dil derleniyor, `en`, `es`, `tr` ve `pt-br`, biri yayında. İngilizce ön ek almadan servis ediliyor ki zaten indekslenmiş adresler hiç yer değiştirmesin.',
            'Site haritası: platforma göre bölünmüş on çocuk dosya üzerinde tek bir dizin.',
        ],
        diagramCaption:
            'Çizimin bütün derdi o salt okunur sınır. Halka açık sayfaların yaptığı her şey ya SELECT olarak sınırı geçiyor ya da hiç geçmiyor: sitenin en yoğun sayfası, dağılımını kaynak dosyaya yazılmış bir bloktan okuyor ve o ok veritabanına hiç ulaşmıyor. Ters yöne bakan tek ok, LinkedIn lead’lerini üç fiillik ikinci bir rolle yazan yönetim konsolu.',
    },

    /* ---- 03 --------------------------------------------------------------- */
    rank: {
        need: {
            head: 'İhtiyaç',
            body: 'Her ağ için bir tane, toplam beş sayfa; hepsi “kaç takipçi çoktur” sorusuna cevap veriyor. Bu sorunun dürüst cevabı, gerçek bir veri kümesine karşı alınmış bir yüzdelik.',
        },
        broken: {
            head: 'Akla ilk gelen çözüm neden yürümüyor',
            body: 'Sorgu, 18,5 milyon satırlık bir tablonun örneklemi üzerinde 101 noktalı bir `percentile_disc`. Canlıda ölçüldüğünde 12 ila 44 saniye sürüyor. Uygulamanın rehber pool’unda ise `statement_timeout: 15000` var. Yani sorgu sayfayı yavaşlatmakla kalmıyor, ==onu çalıştırması gereken bağlantının içinde hiç bitmiyor==. Önüne cache koymak da 44 saniyeyi sadece TTL dolduktan sonra gelen ilk ziyaretçinin sırtına yıkıyor.',
        },
        fix: {
            head: 'Çözüm',
            body: 'Yüzdelik tabloları istek dışında hesaplanıp kaynak dosyanın içine yazılıyor. `scripts/refresh-rank-ladders.mjs`, engine veritabanına erişebilen makinede çalışıyor, beşini birden ölçüyor ve `src/lib/audience-rank.ts` içindeki `BAKED` bloğunu ölçüm tarihiyle birlikte yeniden yazıyor. Sayfalar da dağılım tablosunu sıfır veritabanı erişimiyle basıyor ve tarihi yanına yazıyor.',
        },
        resultFigure: {
            alt: 'PlayerSells X takipçi sıralaması aracı: büyük ve herkese açık bir hesabı, indekslenmiş 18,4 milyon X hesabı içinde 99,1. yüzdelikte gösteriyor; yanında seviyesi, üst yüzdesi ve tahmini sırası var.',
            caption:
                'Aynı kartın içinde bir yüzdelik, bir payda ve bir dürüstlük etiketi. Tahmini sıra, rakamın hemen yanında ve harfiyen “tahmin” diye işaretli; çünkü onu tam saymak her sayfa açılışında bütün kataloğu taramak demek.',
        },
        consequencesHead: 'Bunun kazandırdıkları',
        consequences: [
            'Adresinde kullanıcı adı olmayan bir sıralama sayfası veritabanına sıfır kez dokunuyor ve sıfır JavaScript gönderiyor. Ne kadar arama trafiği gelirse gelsin ek maliyeti yok.',
            'Soğuk bir container’da, engine veritabanına tasarım gereği erişilemeyen bir Docker build’i sırasında ve veritabanı çöktüğünde bile doğru basılıyor.',
            'Elinde olmayan bir yüzdeliği asla göstermiyor.',
        ],
        refresh: {
            head: 'Yenileme işi neyi yazmayı reddediyor',
            body: 'Ağır sorgu tek bir yerde duruyor ve yazmadan önce doğruluyor: tam olarak 101 kırılım noktası, hepsi sonlu ve negatif olmayan, monoton azalmayan ve en az 5.000 örneklenmiş satır. Monotonluk kontrolü hakkını veriyor. Herhangi bir yerde azalan bir tablo, sorgunun yanlış olduğu anlamına geliyor; onu yayımlamak da `percentileForValue` içindeki ikili aramanın eğrinin koca bir bandında görünür şekilde hata vermek yerine saçmalık döndürmesi demek.',
        },
        ladderFigure: {
            alt: 'Sıralama sayfasındaki X takipçi dağılımı tablosu: 10. yüzdelikten 99. yüzdeliğe takipçi sayıları, altında da örneklem büyüklüğü, katalog büyüklüğü ve ölçüm tarihi.',
            caption:
                'Bu tablo soğuk container’da, build sırasında ve veritabanı çöktüğünde de basılıyor; çünkü ölçüldüğü tarihle birlikte depoya yazılı. Örneklem, katalog ve tarih sorulmayı beklemeden altına yazılmış.',
        },
        sampling: {
            head: 'Örnekleme',
            body: 'X, 45.308 satır için `tablesample system(0.25)` ile örnekleniyor; Bluesky 115.643 satır için %3, Telegram 119.346 satır için %4. TikTok ve YouTube tamamı ölçülecek kadar küçük. Oranlar, 101 kırılım noktasının her birinin arkasında yeterince satır olsun diye seçildi: yaklaşık 10.000 örnek satırın altında üst yüzdelikler çalıştırmalar arasında oynayacak kadar gürültülü hâle geliyor, bu da dışarıdan sayıların durup dururken kaymasına benziyor. Veri kümesinin büyüklüğü `pg_stat_user_tables.n_live_tup` üzerinden, yani planlayıcının canlı tahmininden geliyor; çünkü anında dönüyor ve manşetlik bir sayı için yeterince yakın.',
        },
        detailsHead: 'Yüzdelik fonksiyonunda göze çarpmayan iki ayrıntı',
        details: [
            'Tabloların alt ucunda uzun uzun aynı değerin tekrarladığı diziler var. Telegram tablosu p4’ten p18’e kadar `1` değerini tutuyor. Saf bir `upper_bound` araması, tek aboneli bir kanala eşitliğin ilk noktasını değil son noktasını, yani p18’i veriyor. Bu yüzden arama, ara değer hesabına geçmeden önce eşit değerlerin üzerinden geriye doğru yürüyor; p0’a eşit ya da altındaki bir değer de eşitliğin içine ara değer basmak yerine doğrudan 0 dönüyor.',
            'Sayfadaki tahmini sıra, yani “18,5 milyon içinde yaklaşık N.”, sayılmıyor; yüzdelik ile veri kümesi büyüklüğünden türetiliyor. 18,5M satır üzerinde tam bir `count(*)` 30 saniyede bitmiyor. Bu sayıyı basan her yüzey, rakamın hemen yanında ve harfiyen bunun bir tahmin olduğunu yazıyor; p1’in altında ise `null` dönüyor, çünkü %1 çözünürlükte oradaki bir sayı tahmin değil uydurma olurdu.',
        ],
        miss: {
            head: 'Katalogda olmayan bir hesap sorulunca',
            body: 'Hiçbir şey. Kataloğun hiç görmediği bir kullanıcı adına “indeksimizde yok” cevabı veriliyor; yanında da bunun genelde hesabın yeni, gizli ya da farklı yazılmış olduğu anlamına geldiğini anlatan bir metin ve aynı yüzdeliği veren “takipçi sayısını kendin yaz” daveti var. Canlı olarak çekilmiyor ve yorum sebebini yazıyor: bilinmeyen bir kullanıcı adını çekmek, halka açık ve kapısız bir sayfayı, satıcı doğrulamasının bağlı olduğu scraper havuzunun önüne koymak demek.',
        },
        closing:
            'Beş sayfa, ortak tek bir sunucu bileşeni, platform başına tek bir metin kaydı. Yeni bir ağ eklemek, bir metin kaydı ve üç satırlık bir sayfa dosyası demek.',
    },

    /* ---- 04 --------------------------------------------------------------- */
    framing: {
        paras: [
            'Beş katalog aynı türden şeyler değil ve kod bunu bir alanla söylüyor. X, Bluesky ve Telegram bağlantı ve yönlendirme takip edilerek tarandı, dolayısıyla gerçek bir uzun kuyrukları var: indekslenmiş medyan X hesabının 550, Bluesky’ın 133, Telegram’ın 48 takipçisi var. Bunlar dürüst popülasyon cümleleri. TikTok ve YouTube katalogları ise diğer üreticilerin referans verdiği üreticilerden yola çıkılarak kuruldu; medyanları 10.200 ve 62.000, ve bu sayılar platformun değil, seçim yönteminin bir yan ürünü.',
            'İkinci ikiliyi platform geneli bir yüzdelikmiş gibi sunmak, her küçük üreticiye alt %1’de olduğunu söylemek olurdu. ==Bu, kendinden emin ama yanlış bir çıktı; hiç araç olmamasından beter.==',
            'Bu yüzden `framing`, platform kaydında iki değeri olan bir alan: `"population"` ve `"tracked"`. Ürettiği cümlenin fiilini değiştiriyor: “indekslediğimiz 18,5M hesap” ile “takip ettiğimiz 17,5K üretici”. TikTok sayfası daha hiçbir şey söylemeden önce bu uyarıyla açılıyor.',
            'Maliyeti ortak bir bileşende bir alan ve bir dal. Karşılığında aynı kod hem dürüst bir cümleyi hem de temkinli bir cümleyi kurabiliyor, ikisi de diğerinin yerine geçmeye çalışmadan.',
        ],
        figure: {
            alt: 'TikTok takipçi sıralaması sayfası: giriş paragrafı, kataloğun diğer üreticilerin referans verdiği üreticilerden kurulduğunu, büyüklere kaydığını ve bunun TikTok yüzdeliği değil çalışan üreticilere karşı bir kıyas olarak okunması gerektiğini söylüyor.',
            caption:
                'Uyarı, sayfadaki ilk şey; hiçbir rakamdan önce geliyor. Bir kereye mahsus bir metin tercihi de değil: cümle framing alanından üretiliyor, yani popülasyon olduğunu dürüstçe iddia edemeyen bir katalog kendini asla öyle ifade etmiyor.',
        },
    },

    /* ---- 05 --------------------------------------------------------------- */
    insights: {
        intro:
            '`/insights`, X’te etkileşimi gerçekte neyin değiştirdiğine dair çalışmalar yayımlıyor: etkileşim oranı kıyasları, paylaşmak için en iyi saat ve gün, bağlantılar ve erişim, görselle metnin karşılaştırması, gönderi uzunluğu, hashtag’ler; bir de son çalıştırmadan bu yana neyin değiştiğini gösteren bir değişiklik günlüğü. Dokuz sayfa, hesap bazlı bir rapor şablonu ve `/insights/data.json` adresinde CC BY 4.0 lisanslı, makine okuyabilir bir kopya.',
        input: {
            head: 'Girdi ve sitenin hiç okumadığı şey',
            body: '`xtweets` motoru akışları `twscrape` üzerinden okuyor ve gönderi başına tek satır tutuyor: altı sayaç, yani beğeni, retweet, yanıt, alıntı, yer imi ve görüntülenme; artı karakter uzunluğu, medya sayısı, bağlantı var mı, hashtag sayısı, zincirdeki sıra, UTC saati, haftanın günü ve istemci gibi içerik özellikleri. Ham satırlar 90 gün duruyor, gönderi metni 30. günde siliniyor. Site bu ham akışı hiç okumuyor. Sayfalardaki her şey toplu verilerden geliyor ve sebebi servisin içinde yazılı: ham tablo kayan bir saklama penceresinin üstünde duruyor, yani onun üstüne kurulmuş bir sayfa pencere ilerledikçe sessizce içerik kaybederdi.',
        },
        brokenHead: 'İlk tahminci çalışmadı ve bunu görmek için gerçek veri gerekti',
        broken: [
            'İlk sürüm her gönderi için `viral_multiple` hesaplıyordu: etkileşimin, o gönderinin kendi yazarının medyan etkileşimine bölümü. Sonra da kırılım başına bunların medyanını alıyordu.',
            'Bu çalışamaz ve sebebi tek satır: bir hesabın kendi medyan katsayısı tanım gereği 1,0. Her biri 1,0 etrafında toplanmış oranları bir araya atıp yeniden medyan almak, gerçek ne olursa olsun size 1,0 döndürür. Canlıda yayımladığı 138 satırın 72’si tam olarak 1,000’de duruyordu ve bütün katalogda bulabildiği en büyük etki %17’lik bir düşüştü. Araç çalışıyordu, çıktı üretiyordu ve hiçbir şey tespit edemeyecek durumdaydı.',
        ],
        replacedHead: 'Yerine gelen: hesap içi eşleştirmeli tasarım',
        replaced: [
            'Her hesap için, o kırılımın içindeki gönderilerinde `ln(1 + sayaç)` ortalamasını al, dışındaki gönderilerinde aynı ortalamayı çıkar. Logaritma, çünkü etkileşim mertebeler halinde ağır kuyruklu. Medyan değil ortalama, bilerek: ortalamayla tümleyen bir toplam ve bir sayımdan çıkıyor, `sum_all - sum_in`, ve self join gerektirmiyor; 240.000 gönderi üzerindeki bütün geçişi 20 saniye civarında tutan da bu.',
            'Hesaplar arasında bu farkların medyanını al. Bu, Hodges-Lehmann tarzı bir konum tahmini; yani tek bir uçuk hesap sonucu oynatamıyor. Bunun `exp()` değeri katsayı, yüzdeye çevrilmişi de yayımlanan etki.',
            'Aynı farkların sıra istatistiklerinden dağılımdan bağımsız bir güven aralığı: `k` ve `n+1-k` konumlarında, `k = floor(n/2 - 0.98*sqrt(n))` ile. Hiçbir yerde bir dağılım varsayılmıyor.',
        ],
        replacedNote:
            'Eski sürümün düz dediği aynı veride bu yöntem, medya için %53 etkileşim artışı ve [+45, +61] aralığı, bağlantılar için de %52 düşüş ve [-54, -49] aralığı buluyor. Yayımlama kuralı şu: bir satırı yayımlanabilir yapan şey `sample_size` değil, `accounts_sampled`. Tek bir hesabın içindeki gönderiler bağımsız gözlem değil. Hesaplar bağımsız. Bir satırın yazılabilmesi için en az 200 gönderi ve en az 30 hesap gerekiyor.',
        correctionHead: 'Sonra ikinci bir doğruluk problemi: fazla test',
        correction: [
            'Tahminci kabaca 2.648 kırılım üretiyor. Bu kadarını %95 düzeyinde test etmek, tesadüfen düzeltilmemiş bir aralığın dışına çıkan yaklaşık 130 satır demek. Canlı veride ölçüldüğünde, anlamlı diye işaretlenen 904 satırın 137’si düzeltmeden sağ çıkamadı; hepsi de sınırın kıl payı içinde duran, ondalık dilim bazlı küçük saat ve gün hücreleriydi ve %53’lük medya etkisiyle birebir aynı güvenle basılıyorlardı.',
            'Bu yüzden bir düzeltme adımı eklendi: hesap-artı ve hesap-eksi sayıları üzerinde çift taraflı tam bir işaret testi, tam sayı binom katsayılarıyla log uzayında hesaplanıyor; ardından metrik başına aile tanımlanmış bir Benjamini-Hochberg adım yukarı prosedürü geliyor. `is_significant_bh` doğru olmadıkça ve düzeltme kendisini üreten hesaplamadan yeni olmadıkça hiçbir şey yayımlanmıyor.',
            'Test seçimi keyfî değil ve kod tabanındaki en derli toplu şey. İşaret testi, sayfanın zaten yayımladığı aralığın tersi: `k = floor(n/2 - 0.98*sqrt(n))` tam olarak, binom kuantili normal yaklaşımından alınmış hâliyle işaret testi aralığı; z = 1,96 ve 1,96 / 2 = 0,98. p değeri ile aralık tek bir testin iki okunuşu, yani sayfada birbiriyle çelişemiyorlar. Canlı 2.648 satıra karşı denendiğinde 2.606’sında aynı fikirdeydiler ve 42 uyuşmazlığın hepsi aralığın biraz temkinli kalmasıydı, p = 0,043 ile p = 0,049 arasında.',
        ],
        figure: {
            alt: 'PlayerSells X içgörü sayfası: ölçülen hesap sayısı, incelenen gönderi sayısı, medyan etkileşim oranı, medyan erişim ve son hesaplama tarihini gösteren bir sayaç şeridi; altında da paydası yazılı, logaritmik bir etkileşim oranı yüzdelik çizelgesi.',
            caption:
                'Sıralama tablosuyla aynı disiplin, farklı konu: bir dağılım, bir kıyas grubu, bir zaman aralığı ve bir tarih, hepsi sayfanın üstünde. Şeridin üstündeki satır da şundan var: ölçülebilir farkı olmayan bir boyut listeden elenmiyor, listede kalıyor.',
        },
        ai: {
            head: 'İçinde yapay zekâ var mı? Yok',
            body: '`/insights` üzerindeki her sayı SQL ve aritmetik. Motor bunu araştırma modülünün en başında söylüyor ve ilkesel sebebin yanında operasyonel sebebi de veriyor: canlıdaki Anthropic anahtarının kredisi yok, yani doğruluğu bir model çağrısına bağlı olan her şey daha doğmadan ölürdü. Bütün alt sistemde tek bir model çağrısı var ve sıkı sıkıya çevrelenmiş. İsteğe bağlı bir adım, değişiklik günlüğü cümlelerini daha az mekanik bir dile çeviriyor. Varsayılan olarak kapalı, bir env bayrağının arkasında, çalıştırma başına 25 olayla ve 20 saniyelik zaman aşımıyla sınırlı; sonuç da kendisine verilen cümledeki yüzde rakamını hâlâ içermiyorsa reddediliyor. API sözleşmesi bunu herkese açık şekilde tekrar ediyor: `detail_source` ya `template` ya `llm` oluyor ve bir olayın var olup olmadığı da, sayılarının ne olduğu da hiçbir model çağrısına bağlı değil. Metin süs. Ürün olan şey aritmetik.',
        },
        caching: {
            head: 'Önbellek ve on rotadan dokuzu neden ISR değil',
            body: 'Her okuma ortak bir etiket altında bir saatlik TTL ile `unstable_cache` üzerinden geçiyor; araştırma modülü de bilerek aynı TTL’i kullanıyor ki ikisini birden okuyan bir sayfa aynı çalıştırmanın iki farklı sürümünü gösteremesin. On rotanın dokuzu ISR değil `force-dynamic` ve sebebi çok net: engine veritabanına Docker build’inden erişilemiyor, yani bir ISR penceresi başarısız bir okumanın üstüne ön render alır ve her deploy’dan sonraki ilk bir saat gelen ziyaretçilere “henüz ölçülemedi” yazan boş bir kabuk gönderirdi; hem de bütün değeri verisinden ibaret olan sayfada. Altındaki bir saatlik cache sayesinde veritabanı yükü iki durumda da aynı. Değişen tek şey HTML’in ne kadar bayat olduğu.',
        },
    },

    /* ---- 06 --------------------------------------------------------------- */
    guard: {
        intro:
            '`toolGuard`, halka açık her araç rotasının işe başlamadan önce çağırdığı tek bir fonksiyon. 1.200 satır ve projedeki en çok savunulmuş dosya.',
        why: {
            head: 'Neden var',
            body: 'X araçları eskiden ücretli bir sağlayıcı üzerinden okuyordu; o da kendini gerçekten işe yarayan tek yolla sınırlıyordu: kötüye kullanım gerçek para tutuyordu ve fatura bunu görünür kılıyordu. Artık `xlookup` üzerinden okuyorlar, yani kendi yazdığımız bir `twscrape` servisi üzerinden, ve bu tehdit modelini tamamen değiştiriyor. Hesap havuzu satıcı kaydıyla ortak, yani havuzu boşaltan bir ziyaretçi ücretsiz bir aracı bozmuyor, ilan açabilme yeteneğini bozuyor. Havuz sınırlı ve kırılgan: o hesaplardan X’e yüklenmek onları bana yediriyor ve yenisini hazırlamak kimsenin sıraya koymadığı elle bir iş. Üstelik araçlar halka açık ve kimlik doğrulaması yok, yani tek bir shell döngüsü bütün havuzu birkaç dakikada harcayabiliyor; hiçbir şey bunun faturasını kesmediği için de kimse haber vermiyor. Eskiden faturanın uyguladığı sınırı artık kodun uygulaması gerekiyordu.',
        },
        figure: {
            alt: 'PlayerSells ücretsiz araçlar sayfası: X, TikTok, YouTube, Telegram ve Bluesky için araç kartlarından oluşan bir ızgara; içinde takipçi sıralaması, kitle kesişimi, konuma göre trendler ve paylaşmak için en iyi saat araçları var.',
            caption:
                'Yirmi beş araç, beş veri kaynağı, tek kapı. Hepsi tek bir yukarı akış okuması bile harcayamadan aynı dokuz kontrolden geçiyor ve hepsi kaç okumaya mal olduğunu ortak bir tabloda ilan ediyor.',
        },
        order: {
            head: 'Bilinçli bir sırayla dokuz kontrol',
            body: 'Girdi doğrulama, e-posta, IP başına ani yük, global tavanlar, IP başına günlük, e-posta başına günlük, kötüye kullanım deseni, captcha, havuz baskısı. Tasarım olan şey sıranın kendisi. Reddetmek için ucuz ve yerel olan sebepler önce çalışıyor; tek ağ çağrısı olan baskı yoklaması ise en sonda, bütün ucuz sebepler tükendikten sonra.',
        },
        cost: {
            head: 'Dağınık limitler yerine yazılı bir maliyet tablosu',
            body: 'Her araç `poolReads` değerini ilan ediyor: başarılı tek bir çağrının en kötü ihtimalle kaç yukarı akış okumasına yayıldığı, tahminle değil servis kodlarından sayılarak. Kademeler de buradan türüyor: `none`, tek okumalık `cheap`, üç okumalık `standard`, dört ve üzeri ya da sayfalı gezinti gerektiren `heavy`, bir de havuzdan hiç okumayan ama sağlayıcı kredisi harcayan `external`. `shadowban-check` beş okumaya yayılıyor. Değerleme, takipçi denetimi ve shadowban kontrolünü tek seferde çalıştıran Hesap Güven Raporu on iki okumaya mal oluyor ve sitedeki en pahalı tekil istek o. Tablonun neden tek olduğunu yorum açıklıyor: limitleri on sekiz rota dosyasına dağıtmak, tam olarak onların birbirinden ayrı düşme ve pahalı olanların ucuzların kotasını yeme biçimi.',
        },
        ceilings: {
            head: 'Global tavanlar, çünkü IP başına limitler kör',
            body: 'IP başına limitler, bin adrese yayılmış bir kazımayı göremiyor. Bu yüzden trafiğin nasıl dağıldığını hiç umursamayan üç sayaç var: dakikada 30 havuz destekli çağrı, dakikada 10 ağır çağrı, saatte 300 havuz destekli çağrı. Boyutlandırma hesabı da yazılı. `xlookup` dört eşzamanlı işçi çalıştırıyor ve ağır bir çağrı yaklaşık dört yukarı akış okuması, yani dakikada 30 çağrı ani yükte dakikada 90 okumaya kadar çıkıyor, saatte 300 çağrı da kabaca saatte 900 okuma; bunu bir avuç `twscrape` hesabı ban yemeden süresiz karşılayabiliyor. IP başına rakamlar sırf havuz hesabının gerektirdiğinden bilerek daha gevşek ve sebebi yazılı: bir IP bir kişi değil. Mobil operatörler tek bir CGNAT adresinin arkasına binlerce aboneyi koyuyor, tek kullanıcıya göre ayarlanmış bir sınır da koca bir ağı dışarı kilitler. IP başına limitler tek bir bariz suistimalciyi durdurmak için var. Sert sınır, global tavan.',
        },
        refunds: {
            head: 'İadeler, ki aslında bir güvenlik özelliği',
            body: 'Kota harcayan her kontrol, geri alma işlemini bir geri alma yığınına koyuyor ve sonraki herhangi bir ret hepsini çalıştırıyor. Bu olmasa global tavan kendisi bir servis dışı bırakma vektörü olurdu: reddedilen bir saldırgan yine de herkesin tavanını yakardı, yani yeterince ret tek başına bütün meşru ziyaretçileri dışarı kilitlerdi. İade döngüsü kendi istisnalarını yutuyor, çünkü başarısız bir iade bir reddi asla 500’e çevirmemeli.',
        },
        breaker: {
            head: 'Birbirinden bağımsız iki girdisi olan bir devre kesici',
            body: 'Birincisi `xlookup` servisinin kendi `/health` ucu. İkincisi rotaların gerçekte gördüğü şey: iki dakikalık pencerede son 64 altyapı hatasını tutan sınırlı bir halka; üçü `elevated`, sekizi `critical` demek. İkincisinin varlık sebebi yorumda yazıyor ve alıntılamaya değer: `/health`, `xlookup`’un kendisi hakkındaki fikri, fikir de yanlış ya da bayat olabilir; gerçekten başarısız olan istekler ise kanıt. Devre kesiciyi yalnızca altyapı hataları besliyor. Gizli bir hesap ya da hiç gönderisi olmayan bir kullanıcı adı havuz hakkında hiçbir şey söylemiyor; onları saymak, araçların gayet normal kullanıcı girdisi yüzünden kendilerini kapatması demek olurdu.',
        },
        failClosed: {
            head: 'Hata durumunda kapanıyor ve bunun bir sebebi var',
            body: 'Sağlık yoklaması zaman aşımına uğrar, hata verir ya da hiç erişilemezse bu asla sakinlik değil, baskı olarak not ediliyor. Yorum olayın adını koyuyor: erişilemeyen ya da sessiz bir sağlık ucu, ücretli API’nin sekiz gün boyunca içinde durduğu durumun ta kendisi, hani şu guard’ın trafiği el sallayıp geçirdiği sekiz gün. Ayrıştırıcı belirli bir konuda paranoyak. Aynı sinyalin birden fazla yazılışını kabul ediyor: `breaker`, `breaker_open`, `circuit`, `state`, `degraded`, ve etiket de olabilen, 0..1 doygunluk da olabilen, 0..100 yüzde de olabilen bir baskı değeri. Çünkü `xlookup` tarafına sonradan eklenecek bir devre kesici sinyaline başka bir ad verebilir ve tek bir yazılışı anlayan bir guard, avaz avaz bağıran bir yanıttan “baskı yok” diye okurdu. Tanınmayan bir yanıt asla sakinlik sayılmıyor. Kademeler de sırayla geri çekiliyor: `heavy` `elevated` seviyesinde, `standard` `critical` seviyesinde, `cheap` yalnızca `down` seviyesinde servis edilmeyi bırakıyor. Havuza hiç dokunmayan araçlar ise havuzun durumundan hiç etkilenmiyor.',
        },
        errorsHead: 'Hata sözleşmesi: içerikten önce altyapı',
        errors: [
            '`classifyToolError`, fırlatılan bir hatayı bir duruma ve kullanıcıya gösterilecek bir mesaja eşliyor. 156 satır ve tasarımın tamamı beş kuralının sırası: yapılandırılmamış, yukarı akış tükenmiş ya da kısıtlanmış, yukarı akış hiç cevap vermemiş, sonra 404 ile hesap düzeyindeki hatalar, sonra 422 ile yetersiz veri hataları. Tanınmayan her şey genel bir mesajla genel bir 500 olarak kalıyor, böylece iç hata detayı hiçbir zaman tarayıcıya ulaşmıyor.',
            'Altyapı sinyallerinin içerik sinyallerinin üstünde durmasının sebebi somut bir canlı olay. Ücretli sağlayıcı, tükenmiş bakiyeye harfiyen “Credits is not enough” diye cevap veriyordu ve bu, “not enough” alt dizesi üzerinden yetersiz aktivite kuralına takılıyordu. Sıra ters olsaydı, bizim ödenmemiş faturamız ziyaretçiye “o hesabın aktivitesi çok az” diye bildirilirdi: onların verisi hakkında kendinden emin ve yanlış bir cümle, üstelik hemen yanında yukarı akışın ham gövdesi de tarayıcıya basılmış olarak, ve kullanıcı buna göre hareket ederdi. Dosyanın yazdığı kuralın iki maddesi var. Her zaman önce altyapı, ve yukarı akışın kendi sözlerini asla olduğu gibi aktarma.',
            'Sınıflandırıcı ayrıca bir `kind` alanı döndürüyor, `"infrastructure" | "input" | "unknown"`, ve yukarıdaki yerel devre kesiciyi besleyen de bu. İki dosyayı birleştiren yer burası: ziyaretçiye ne söyleneceğine karar veren sınıflandırma, sistemin kendini korumaya başlayıp başlamayacağına da karar veriyor.',
        ],
        email: {
            head: 'Ürünü değiştiren tek bir ölçüm',
            body: 'Ücretsiz araçlardaki e-posta duvarı, ona dokunulmadan önce ölçüldü: 158 günde 118 yeni adres, yani günde 0,75; toplam araç kullanımı günde yaklaşık 5 iken, ve altı araç hiç kullanılmamışken. Lead kaynağı değil, kapıdan geri döndüren bir engeldi. Bu yüzden kullanımın %74’ünü taşıyan üç araçtan kaldırıldı. E-posta alanı duruyor ve kendiliğinden yazılan adres hâlâ kaydediliyor; giden şey, adres yokken gelen ret. Kötüye kullanım koruması adına hiçbir şey değişmedi, çünkü `requireEmail` en başından beri yalnızca çağıranın kendi yazdığı bir metne bağlı bir limiti koruyordu, ki o da limit sayılmaz.',
        },
    },

    /* ---- 07 --------------------------------------------------------------- */
    graph: {
        paras: [
            'Kitle kesişimi aracı iki X hesabını karşılaştırıp ikisini birden kimin takip ettiğini söylüyor. Grafik 79,8 milyon kenar ve iki yoldan toplandı: taranan her hesabın takip ettikleri listesi okunarak, bir de taranan her hesabın takipçilerinden sınırlı bir örneklem okunarak.',
            'İkisi de kimse için tam bir takipçi listesi vermiyor. Koddaki örnek tam da işe yarayan örnek: @naval’ın 3,9 milyon takipçisi var ve grafik bunların 2.666’sını tutuyor.',
            'Yani araç iki kitlenin kesişimini ölçmüyor. İki kitlenin indekslenmiş kısımlarının kesişimini ölçüyor; o kısımların toplanma biçimi yüzünden de kendisi taranacak kadar önemli hesaplara doğru kayıyor. Bu aslında daha faydalı soru çıkıyor, çünkü “bu ikisini birden hangi bilinen hesaplar takip ediyor”, gerçek her kullanımda “kaç isimsiz hesabı ortak” sorusunu yeniyor. Ama bunun sayfada, rakamın hemen yanında yazması gerekiyor.',
            'Aritmetik sonucu ise yanlış yapması en kolay yer. Oran indekslenmiş kümelere göre ifade ediliyor, asla halka açık takipçi sayılarına göre değil. Örneklenmiş bir kesişimi tam takipçi sayısına bölmek, üç mertebe yanlış ama gayet makul görünen bir sayı üretiyor.',
            '`idx_xedges_dst`, 79,8M satır üzerinde `(dst_user_id, edge_type)` üstünde bir btree; dolayısıyla “bu hesabı kim takip ediyor” sorusu taraf başına birkaç bin satırlık bir indeks taraması. Canlıda ölçüldüğünde soğukta 5,7 saniye, sıcakta 85 milisaniye. Soğuk rakam disk, planlama değil: indeks, sayfaları genelde bellekte kalmayacak kadar büyük. Bu yüzden 24 saatlik bir cache ve hesap başına sert bir 25.000 kenar tarama sınırı var; ki merkezî bir hesap tek bir sayfa görüntülemesini sıralı okumaya çeviremesin.',
            'İçinde düşünmek gerektiren iki küçük şey var. Cache anahtarı sıralanmış ikili, çünkü (a,b) ile (b,a) aynı karşılaştırma; sıralama olmasa paylaşılan bir bağlantı ile onun aynası soğuk maliyeti ayrı ayrı öderdi. Tarama sınırını aşan bir hesap da sessizce kesilmek yerine `capped` olarak bildiriliyor, çünkü kesilmiş bir kesişim, gerçeğine birebir benzeyen daha küçük bir sayı.',
            'Sıfır dış çağrı. Grafiğin hiç görmediği bir kullanıcı adına “indekste yok” cevabı veriliyor; sıralama aracının aynı cevabı vermesiyle aynı sebepten.',
        ],
    },

    /* ---- 08 --------------------------------------------------------------- */
    seo: {
        intro:
            'Halka açık yüzey ürünün dağıtım kanalı; bu yüzden pazarlama gibi görünen birkaç karar aslında kodun üstündeki kısıtlar.',
        subs: [
            {
                head: 'Sonuç görünümleri arama motoruna kapalı',
                body: 'Bir sıralama sayfasındaki `?u=` ya da `?n=` adresi, aynı sayfanın tek bir okunuşu. Google’ın bunları indekslemesine izin vermek, asıl sıralanması gereken sayfayla yarışan binlerce neredeyse birebir aynı ince kopya üretirdi. `noindex` ama `follow` kalıyorlar ve canonical olarak aracın kendisine dönüyorlar.',
            },
            {
                head: 'İki yerde yazılmış, birbiriyle uyuşan tek bir yönlendirme',
                body: '`/tools/shadowban-checker` yalnızca `/tools/shadowban-check` adresini göstermek için var. `next.config.ts` içinde `permanent: true`, yani 308 olarak tanımlı; sayfanın kendisi de yine 308 dönen `permanentRedirect()` çağırıyor. Eskiden `redirect()` çağırıyordu, o da 307 dönüyor, yani geçici yönlendirme; bu da Google’a kopyayı indekste tutmasını ve tekrar tekrar uğramasını söylüyor, tam olarak bu ara sayfanın durdurmak için eklendiği yamyamlığı. Ara sayfa site haritasından da çıkarılmış ve `scripts/validate-sitemap.mjs` bu istisnayı aynı yapılandırma dosyasından okuyor, ki bir build rotayı sessizce geri ekleyemesin.',
            },
            {
                head: 'Site haritası dizini lastmod konusunda doğruyu söylüyor',
                body: 'Platforma göre bölünmüş on çocuk site haritası. Bunların yalnızca ikisi gerçek bir `lastmod` taşıyor; diğer sekizinin taşımama sebebi kayıt dosyasında yazılı: dizin eskiden hepsine isteğin geldiği anın zaman damgasını basıyordu, bu da bota sitedeki her site haritasının tam onu çektiği anda değiştiğini söylüyor. Burada `lastmod` değerinin anlamsız olduğuna karar veren bir bot, onu dürüst kayıtlarda da planlama için kullanmayı bırakıyor. Savunulabilir bir zaman damgası olmayan parçalar haritada hiç yer almıyor ve şimdiye düşüyorlar, ki bu en azından içerik hakkında bir iddia değil.',
            },
            {
                head: 'Dört dil derleniyor, biri yayında',
                body: '`BUILT_LOCALES` içinde `en`, `es`, `tr` ve `pt-br` var; `LIVE_LOCALES` içinde yalnızca `en`. Bir dil önce derleniyor ki sayfaları gerçek bir adres üzerinde gözden geçirilebilsin; derlenmiş ama yayına alınmamış bir dildeki sayfalar da `noindex` servis ediliyor, ki yarı çevrilmiş bir ağaç keşfedilemesin. Yorum sebebi açıkça yazıyor: gözden geçirilmemiş makine çevirisi yayımlamak, ölçekli içerik kötüye kullanımı politikasının hedeflediği şeyin ta kendisi ve elle verilecek bir ceza rehberler dahil bütün siteyi vurur. İngilizce ön eksiz kalıyor, çünkü zaten indekslenmiş yaklaşık 50.000 adresi bir dil segmentinin altına taşımak sitenin sahip olduğu bütün sıralamaları sıfırlardı.',
            },
            {
                head: 'Open Graph kartları bir dağıtım aracı, süs değil',
                body: 'Bir güven raporu için dağıtım modeli, bağlantıyı ileten insanın kendisi: alıcı satıcıya yolluyor, satıcı bir gruba yapıştırıyor, oradaki biri başka bir gruba atıyor. Her sıçramada kart görünüyor, başka hiçbir şey görünmüyor. Site eskiden `twitter:card: "summary"` ile, yani küçük kartla, tek bir sabit görsel gönderiyordu; dolayısıyla belirli bir hesap hakkındaki bir hükme giden bağlantı, ana sayfaya giden bağlantıyla birebir aynı görünüyordu. Kart artık ortak bir üreticiden rapor başına üretiliyor. Edge yerine `nodejs` çalışma zamanında dönüyor, çünkü Inter yazı tipleri diskten okunuyor ve tasarlanmış görünen bir kartla üretilmiş görünen bir kart arasındaki farkın büyük kısmı gerçek tipografide. Hiç ağ çağrısı yapmıyor ve avatar çekmiyor: render olmadan önce dış bir sunucuya uzanmak zorunda olan bir kart, bağlantının bozuk görünmesine yol açacak tek yerde arada bir zaman aşımına uğrayan bir karttır.',
            },
            {
                head: 'Sitenin kendi çıkarına aykırı bir not',
                body: 'SEO modülü, JSON-LD’nin yapay zekâ atıflarını değiştirmesini beklememek gerektiğini söyleyen bir paragraf taşıyor ve bu konuda bulabildiği tek eşleştirilmiş kontrollü deneyi de kaynak gösteriyor: Ahrefs, Mayıs 2026, JSON-LD ekleyen 1.885 sayfaya karşı eşleştirilmiş 4.000 kontrol sayfası; AI Overviews üzerinde %4,6 düşüş, AI Mode ve ChatGPT üzerinde ise etki yok. `llms.txt` rotası da aynı türden bir dürüstlükle açılıyor: büyük sağlayıcıların hiçbiri bu dosyayı çekmeyi taahhüt etmedi, sıralama girdisi olduğuna dair kamuya açık bir kanıt yok, ve dosya ucuz, standart ve okunabilir; savunmasının tamamı bu. Gerçekten işe yaradığı ölçülen şey, hiçbir bağlam olmadan alıntılandığında ayakta kalan, sunucuda üretilmiş düz metin; güven raporunun editoryal kuralının her bulgunun rakamını, tarihini ve paydasını yazması da bu yüzden.',
            },
        ],
    },

    /* ---- 09 --------------------------------------------------------------- */
    failures: {
        intro:
            'Dürüst bölüm burası. Aşağıdaki her madde, yayına çıkmış, canlıda ya da ölçülmüş bir testte çuvallamış ve yerine başkası konmuş bir şey. Bilerek uzun, çünkü sayfanın geri kalanını kontrol edilebilir kılan şey bu ayrıntılar.',
        panelHead: 'Düzeltmeler ve her birinin bedeli',
        items: [
            {
                lead: 'Etki bulmak için oranları bir araya atmak.',
                body: 'İlk desen tahmincisi her gönderinin etkileşimini kendi yazarının medyanına bölüyor, sonra kırılım başına medyan alıyordu. Bir hesabın kendi medyan katsayısı tanım gereği 1,0 olduğu için, veri ne derse desin cevap 1,0 çıkıyordu. Yayımlanan 138 satırın 72’si tam olarak 1,000’de duruyordu. Araç kendinden emin çıktı üretiyordu ve matematiksel olarak hiçbir şey bulamaz durumdaydı. Yeniden yazılan hâli aynı veride medya için [+45, +61] aralığıyla %53 buluyor.',
            },
            {
                lead: 'Düzeltilmemiş anlamlılık yayımlamak.',
                body: '2.648 kırılımı %95 düzeyinde test etmek tesadüfen yaklaşık 130 yanlış pozitif üretiyor. İşaretlenen 904 satırın 137’si Benjamini-Hochberg’den sağ çıkamadı ve bunlar gerçek etkilerle aynı görsel güvenle basılıyordu.',
            },
            {
                lead: 'Siteyi hiçbir şey işe yaramıyormuş gibi okutan bir filtre.',
                body: 'Asgari etki filtresi, dürüst cevabı “ölçülebilir bir fark yok” olan her boyutu eliyordu. Geriye negatifler kalıyordu; sayfa dört kart gösteriyor, üçü negatif oluyor ve X’te paylaşmak umutsuzmuş gibi okunuyordu. Boş sonuç da bir sonuç: “158 bin gönderi üzerinde ölçülebilir fark yok” bir bulgudur ve artık açıkça söyleniyor.',
            },
            {
                lead: 'Kıyas bantlarında medyan yerine ortalama.',
                body: '999 takipçili, üç gönderisi örneklenmiş ve medyan görüntülenmesi 455.506 olan bir hesap, bandın “ortalama” etkileşim oranını %288 çıkardı. Bu bir oran bile değil, iki küçük ve gürültülü sayıyı bölmenin yan ürünü. Artık her yerde medyan var, hem de SQL içinde.',
            },
            {
                lead: 'Çekilen ilk N kayıt üzerinde JavaScript ile yüzdelik hesaplamak.',
                body: 'Kıyas sayfası eskiden en üstteki 5.000 hesabı çekip yüzdelikleri onların üzerinde hesaplıyordu. 5.000’in bütün popülasyon olduğuna dair elde tek kanıt, var olandan fazla satır isteyip daha azını geri almaktı. O kanıt, kohort limitin üstüne çıktığı an geçersiz oluyor; tam da o yüzdelikleri okunmaya değer kılmak için kohort genişletilirken sayfa yayımlamak için var olduğu bütün yüzdelikleri sessizce düşürecekti. Artık SQL tarafında bir toplama işlemi ve bir toplama işlemi kesilemiyor.',
            },
            {
                lead: 'Her rollup’ı sessizce öldüren eksik bir cast.',
                body: '`percentile_cont` `double precision` döndürüyor, `numeric / double precision` da `double precision` oluyor ve Postgres’in bunun için `round(x, int)` imzası yok. Üç ifade, cast edilmemiş bir yüzdeliğe bölünüyordu. Her biri kendi sorgusunun hazırlanma aşamasında patlamasına yol açıyordu; yani etkileşim toplaması, özgünlük geçişi ve desen analizi bir kez bile tamamlanmamıştı. Doğruymuş gibi okunmasının sebebi, aynı bölmelerin diğer tarafındaki cast’lerin zaten yerinde olmasıydı.',
            },
            {
                lead: 'Gönderi taramasından sonraki dört yazmayı düz sırayla çalıştırmak.',
                body: 'Bunların ilki, `xdir_accounts` tablosuna yazan diğer bütün motorlarla çekişiyor. Bir kilit yarışını kaybetti, hata fırlattı ve arkasındaki üçünü de beraberinde götürdü. Scraper iki gün boyunca kusursuz çalıştı ve ham tabloya 114.000 gönderi yazdı; üstüne tek bir toplama bile kurulmadı. Veri tam oradayken `/insights` sıfır okuyordu. Bundan çıkan kural şu: damga muhasebe, ürün olan şey toplamalar, ve birincisini kaybetmek asla ikincisine mal olmamalı.',
            },
            {
                lead: '22 saat kilit tutan bir rollup.',
                body: '`citation_score` ve `out_degree`, günlük rollup’ın işlemi içinde, takip grafiğinin tam bir `GROUP BY` sonucuna bağlanan iki UPDATE olarak yeniden kuruluyordu. Planlayıcı o birleştirmeyi 193 milyon satır tahmin ediyordu, gerçek sayı 756.000’di.',
            },
            {
                lead: 'Veritabanına erişilemediğinde 404 cevap vermek.',
                body: 'Depodaki en pahalı hata. `withRetries(fn, [])`, bir sorgu ısrarla başarısız olduğunda boş dizi döndürüyordu, `rows[0]` `undefined` çıkıyordu ve sayfa `notFound()` çağırıyordu. Yani “sorgu başarısız oldu” ile “öyle bir hesap yok” aynı 404’ü üretiyordu. 2026-08-15’te bir crawler işçisi bir UPDATE ile 26 saat boyunca satır kilidi tuttu, arkasında biriken insert’ler bağlantıları teker teker doldurdu ve `max_connections` tükendi; sonraki on beş saat boyunca beş rehberdeki her profil hem kullanıcılara hem Googlebot’a 404 döndü. Hesaplar o süre boyunca vardı ve satırlar sağlamdı; site sadece soramıyordu. 404, Google’ın “bu adresi indeksten çıkar” diye okuduğu tek durum kodu; 500 ise “sonra tekrar gel” diye okunuyor ve yalnızca bir tarama denemesine mal oluyor. Bir sayfanın var olup olmadığını öğrenemiyorken yok olduğunu iddia etmek, verilebilecek en pahalı karar.',
            },
            {
                lead: '“Sıfır” ile “bozuk”u ayırt edemeyen bir izleme.',
                body: 'Zaman aşımına uğramış bir sayım ile ölü bir motor, ikisi de 0 okunuyordu. 2026-08-25’te ve tekrar 2026-08-26’da motor panosu, saatte on binlerce satır yazan altı sağlıklı motora ölü dedi. Altındaki mekanizma göstergeden de kötüydü: yedi motorun hepsi için `Promise.all`, her birine dört sorgu, 10 saniyelik bağlantı zaman aşımı olan 8 bağlantılık bir pool’a karşı 28 sorgu. Yavaş bir tablo yerlerini tam 15 saniyelik statement timeout boyunca tuttu ve diğer bütün motorlar kendi sorgusunda değil, bağlanırken öldü. Loglarda tam olarak öyle yazıyordu: bir statement timeout, yirmi dört bağlantı zaman aşımı.',
            },
            {
                lead: 'Para bitince açık kalan bir guard.',
                body: 'Ücretli sağlayıcının bakiyesi 2026-08-11’de bitti ve dokuz X aracı öldü. Guard sekiz gün boyunca trafiği el sallayıp geçirdi ve kimseye söylemedi. 06. bölümdeki hata durumunda kapanma duruşunun tamamı buradan geliyor. Düzeltme yalnızca guard değildi: `xlookup`, sağlayıcının yanıt biçimlerini birebir döndüren bir adaptörle sarıldı, böylece ince ayarı yapılmış dokuz servis dosyasına hiç dokunulmadı. Onları yeni bir biçime göre yeniden yazmak, gerileme hatalarının çıkacağı yerdi.',
            },
            {
                lead: 'Kötüye kullanım filtresinde yanlış yazımların peşinden koşmak.',
                body: 'Platform dışına çıkarma mesaj filtresi yazımları birebir eşleştiriyordu, yani her yeni yanlış yazım taze bir delikti: “WhatsApp’tan anlaşalım” yazınca engellenen bir satıcı, bunu “WasApp” diye yeniden yazdığında hiçbir şey tetiklenmeden geçiyordu. Daha önceki bir sürüm, bulanık eşleştirmeyi normalleştirmenin yanlış tarafında çalıştırdı ve bir haftada 19 kullanıcıda 264 yanlış pozitif engel üretti; çünkü “seller” ve “excellent” kelimeleri “zelle”ye bir düzenleme uzaklıkta, “message” de “imessage”a. Yedinci sürüm yaklaşımı tersine çevirdi: kuralları genişletme, girdiyi onar. Canlı trafik yeniden oynatılarak doğrulandı. İletilen 6.352 mesajın 58’i artık engelleniyor, hepsi gerçek denemeler; geçmişte engellenen 515 mesajın ise yalnızca 10’u artık geçiyor ve hepsi eski yanlış pozitifler.',
            },
            {
                lead: 'Paylaşımlı bir makinede sınırsız heap.',
                body: '2026-08-24’te bir Docker build’i, iki Postgres örneği ve sekiz crawler ile paylaşılan 7,5 GB’lık bir makinede 2,8 GB boş alanla çalıştı. TypeScript aşaması bunu aştı ve çekirdeğin OOM killer’ı build yerine üç Postgres arka ucunu seçti. Buna sebep olan süreç çalışmaya devam ederken site yaklaşık bir dakika kapandı. `--max-old-space-size=3072` ile sınırlandı ve gerekçesi Dockerfile’a yazıldı: sınırsız bir heap, “bu build’in bizde olandan fazla belleğe ihtiyacı var” durumunu makine çapında bir olaya çeviriyor; sınırlı olanı ise başarısız bir build’e çeviriyor, ki o da logda okunup tekrar denenebilecek bir problem.',
            },
            {
                lead: 'Origin’den gelen X-Forwarded-For değerine güvenmek.',
                body: 'Caddy bunu eskiden `{remote_host}` yapıyordu, yani en yakın eşe; bu da yalnızca origin doğrudan erişilirken doğru. Cloudflare bölgesi DNS-only konumundan proxy konumuna geçtiği an, o satır gerçek istemci IP’sinin üstüne bir Cloudflare edge adresi yazıyor. Uygulamada dokuz yer istemci IP’sini okuyor ve bunların ikisi güvenlik kararı: tek bir kaynak adresi beyaz listeye alan bir ödeme webhook’u ve IP bazlı bir yönetim rate limiti. Webhook kendi geri çağrılarını reddetmeye başlayacak ve bakiyeler sessizce yüklenmeyi bırakacaktı. Yerine iki modda da doğru olan `{client_ip}` kondu ve güvenilen proxy listesi çekildiği tarihle birlikte sabitlendi.',
            },
            {
                lead: 'Başarının kendisi bir hata olarak, iki kez.',
                body: 'Rehberler yayına girdikten sonra site haritası yaklaşık 28.000 adrese çıktı ve makale üreticisinin prompt’u 1.000.000 sınırına karşı 1.053.556 token’a ulaşıp her çalıştırmada patladı. Sınırlandı ve prompt yaklaşık 8.200 token’a düştü. Bir ay sonra X kataloğu yaklaşık 14 milyon satıra ulaştı ve tam `count(*)` toplamaları, sadece indeksten okunan taramalar olmasına rağmen 10 ila 12 saniye sürmeye başladı; 15 saniyelik statement timeout’u zorluyor, altısı aynı anda çalışırken görülüp engine diskini doyuruyordu. Yerine `reltuples` tahminleri ve %1 blok örneklemeleri kondu.',
            },
            {
                lead: '424 e-posta gönderip hiçbir şey silmeyen bir GDPR silme akışı.',
                body: '`anonymize_user_account()`, `deleted_` artı 32 hex karakter, toplam 40 karakterlik anonim bir kullanıcı adı üretiyordu; kimlik koruma tetikleyicisi ise 3 ile 30 arasını dayatıyor. Her çağrı iptal oluyor, talep “onaylandı” olarak kalıyor ve süpürme her yönetim sayfası açılışında yeniden deniyordu; çünkü bir rozet yoklaması her beş dakikada bir aynı uca vuruyor. Sessiz bir hatayı fırtınaya çeviren ayrıntı şuydu: e-posta işten önce gönderiliyordu.',
            },
            {
                lead: 'Commit atmadan deploy etmek.',
                body: 'Deploy, git checkout değil, çalışma dizininin tar’lanıp scp ile gönderilmesi; yani başka hiçbir yerde var olmayan bir kodu yayına almak tamamen mümkün. Bu defalarca oldu ve depo bu deseni kendi adlandırıyor: bir commit yalnızca canlı motor kodunu çalışan bir container imajından git’e geri almak için var, çünkü o imaj tek kopyaydı. Bunu düzeltmek için push ile deploy akışı eklendi ama tutmadı. Projedeki en net operasyonel borç bu ve bir kod probleminden çok bir süreç problemi; zor türden olmasının sebebi de tam olarak bu.',
            },
        ],
        closing:
            'Tema bir önceki projeyle aynı. ==En pahalıya patlayan hatalar sessiz olanlardı.== 1,000 döndüren bir tahminci, hazırlanamayan bir sorgu, “soramadık” demek olan bir 404, zaman aşımına uğradığı için sıfır okuyan bir pano, hiçbir şey fırlatmadığı için trafiği geçiren bir guard. Düzeltmelerin çoğu aslında tek bir düzeltme: iki farklı şeyin aynı çıktıyı üretmesine izin vermemek.',
    },

    /* ---- 10 --------------------------------------------------------------- */
    stack: {
        intro: 'Özgeçmiş kategorisine göre değil, bu sistemde ne iş yaptığına göre gruplandı.',
        rows: [
            [
                'UYGULAMA',
                'Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Radix yerine @base-ui-components/react üzerine kurulmuş shadcn/ui, Framer Motion. Varsayılan olarak sunucu bileşenleri; sıralama sayfaları ise istemciye hiç JavaScript göndermiyor.',
            ],
            [
                'VERİ TOPLAMA',
                'Python. 35 hesaplık bir havuz üzerinde X GraphQL uçlarına karşı twscrape, Bluesky firehose ve takip grafiği, Telegram web ve bot crawler’ları, TikTok, resmî YouTube Data API, LinkedIn. 14 compose servisi, 18.002 satır.',
            ],
            [
                'VERİTABANLARI',
                'İki yığın da Postgres. Engine veritabanı katalogları, takip grafiğini ve toplamaları tutuyor; pazar yeri ise Haziran 2026’dan beri kendi sunucumuzda, önünde PostgREST 12.2.3 olan Postgres 17 üzerinde. statement_timeout değeri açıkça verilmiş node-postgres pool’ları, bir salt okunur rol ve bir dar yazma rolü.',
            ],
            [
                'İSTATİSTİK',
                'Hepsi SQL ve Python içinde: percentile_cont ve percentile_disc, ntile, percent_rank, tablesample system, grouping sets, Hodges-Lehmann konum tahminleri, dağılımdan bağımsız sıra istatistiği güven aralıkları, tam bir işaret testi ve Benjamini-Hochberg düzeltmesi.',
            ],
            [
                'YAPAY ZEKÂ',
                'Şemayla kısıtlanmış JSON için zorunlu araç kullanımıyla Anthropic Claude: aracın girdi şeması, z.toJSONSchema ile çevrilmiş bir Zod 4 şeması; tool_choice çağrıyı zorunlu kılıyor ve çıktı aynı şemadan geri doğrulanıyor, böylece çağıran taraf tipli ve çalışma zamanında kontrol edilmiş bir nesne alıyor. Bu araçlar başta OpenAI Responses API üzerine kurulmuştu ve canlıda bir Anthropic anahtarı olduğu, hiç OpenAI anahtarı olmadığı için taşındı. İki ücretsiz araç, KYC inceleme ajanı, mesaj filtresi ve destek önericisi kullanıyor. İçgörü tarafında hiçbir yerde kullanılmıyor.',
            ],
            [
                'ALTYAPI',
                'Docker Compose, otomatik TLS ile Caddy 2, önünde Cloudflare, tek bir Hetzner sunucusu. V8 heap’i sınırlandırılmış, çok aşamalı bir Node 22 Alpine build’i. Captcha için Cloudflare Turnstile.',
            ],
            [
                'GÜVENLİK',
                'Birincil izolasyon sınırı olarak salt okunur bir veritabanı rolü. next.config.ts içinde CSP, HSTS ve diğer güvenlik başlıkları. Şifrelenmiş kimlik bilgisi saklama. Edge tarafında istemci IP normalizasyonu, ki iletilen bir başlık asla istemcinin kendisi hakkındaki iddiası olamasın.',
            ],
            [
                'SEO',
                'Platforma göre bölünmüş, on parçalı bir site haritası dizini. JSON-LD: Dataset, ItemList, ProfilePage, FAQPage, BreadcrumbList. Node çalışma zamanında üretilen Open Graph kartları. llms.txt. Tek bir anahtarın arkasında dile duyarlı canonical ve hreflang.',
            ],
        ],
    },

    /* ---- 11 --------------------------------------------------------------- */
    numbers: {
        intro:
            'Hepsi depoda sayıldı, canlı deploy loglarından okundu ya da ne zaman ölçüldüğünü yazan bir kod yorumundan alındı. Katalog satır sayıları ve süre ölçümleri 2026-08-24 ve öncesi tarihli.',
        rows: [
            ['Beş ağda indekslenmiş hesap', '25.296.740'],
            ['X kataloğu, xdir_accounts', '18.486.455'],
            ['Bluesky, bdir_accounts', '3.802.535'],
            ['Telegram, tgdir_chats', '2.955.123'],
            ['YouTube, ytdir_channels', '35.149'],
            ['TikTok, ttdir_accounts', '17.478'],
            ['Takip grafiği kenarı, xedges', '79.800.000'],
            ['Medyan indekslenmiş hesap, X / Bluesky / Telegram', '550 / 133 / 48'],
            ['Medyan takip edilen üretici, TikTok / YouTube', '10.200 / 62.000'],
            ['Yüzdelik sorgusu, canlıda', '12 ila 44 sn'],
            ['Rehber pool’unun statement timeout değeri', '15 sn'],
            ['Sıralama sayfası başına yüzdelik sorgusu', '0'],
            ['Platform başına kırılım noktası', '101'],
            ['Kitle kesişimi, soğuk / sıcak', '5,7 sn / 85 ms'],
            ['@naval, gerçek takipçi ile indekslenen', '3.900.000 / 2.666'],
            ['Ücretsiz araç', '25, artı bir 2FA üreteci'],
            ['toolGuard içindeki sıralı kontrol', '9'],
            ['Global tavanlar', 'dk 30 havuz, dk 10 ağır, sa 300 havuz'],
            ['En pahalı tekil istek', 'güven raporu, 12 yukarı akış okuması'],
            ['twscrape havuzu', '35 hesap'],
            ['Desen çalıştırması başına test edilen kırılım', 'yaklaşık 2.648'],
            ['Benjamini-Hochberg’de kaybedilen bulgu', '904 satırın 137’si'],
            ['En büyük etki, medyanın etkileşime etkisi', '%53, aralık [+45, +61]'],
            ['En büyük negatif, bağlantıların erişime etkisi', '%52 düşüş, aralık [-54, -49]'],
            ['Desen geçişinin süresi', '240.000 gönderide yaklaşık 20 sn'],
            ['Eski tahminci, tam 1,000’de takılan satır', '138 satırın 72’si'],
            ['Canlı build’deki rota', '617'],
            ['Build başına statik üretilen sayfa', '24,0 sn’de 1.156'],
            ['TypeScript ve TSX', '314.842 satır, 1.196 dosya'],
            ['Python', '18.002 satır, 41 dosya'],
            ['404 hatasından çıkan en uzun kesinti', '15 saat, beş rehberin hepsi'],
            ['En kötü yanlış pozitif olayı', 'bir haftada 19 kullanıcıda 264 engel'],
        ],
    },

    /* ---- 12 --------------------------------------------------------------- */
    links: {
        intro: 'Depo özel. Aşağıdakiler halka açık yüzeyler.',
        notes: {
            tools: '25 ücretsiz araç. Hesap gerekmiyor, en yoğun üçünde e-posta da gerekmiyor.',
            rank: 'Sıralama motoru. Bir kullanıcı adı deneyin ya da sadece dağılım tablosunu okuyun.',
            insights: 'Yayımlanmış çalışmalar, güven aralıkları ve paydalarıyla birlikte.',
            data: 'Aynı bulgular, makine okuyabilir hâlde, CC BY 4.0.',
            site: 'Pazar yerinin kendisi.',
        },
        disclaimer:
            'Bu sayfada hiçbir kimlik bilgisi, halka açık ürün alan adının ötesinde bir sunucu adı, bir sunucu adresi, bir müşteri adı ya da gerçek bir kullanıcı verisi yok. Burada adı geçen tek kullanıcı adı olan @naval, bir kod yorumunda örneklem büyüklüğü olarak anılan tanınmış bir isim. Buradaki bir rakam doğrulanamıyorsa bana yazın, sayfadan çıkarayım.',
        allProjects: 'TÜM PROJELER',
        visitSite: 'PLAYERSELLS.COM ADRESİNE GİT',
    },

    /* ---- diyagram ---------------------------------------------------------- */
    diagram: {
        title: 'PlayerSells çalışma zamanı mimarisi',
        desc:
            'Yukarıdan aşağıya dört bant. En üstte altı kaynak: 35 hesaplık bir twscrape havuzu ' +
            'üzerinde X, Telegram web ve bot, Bluesky, TikTok, resmî YouTube Data API ve ' +
            'LinkedIn. X havuzunun satıcı doğrulamasıyla ortak olduğu ayrıca işaretli. Altlarında ' +
            'engine yığını: crawler’ları, keşif katmanını, rollup’ları ve xlookup okuma servisini ' +
            'tutan on dört Python container’ı; engine Postgres’ine yazan da bu. Veritabanı ile ' +
            'uygulama arasında kalın bir çizgi var: uygulama directory_reader olarak bağlanıyor, ' +
            'elinde SELECT var, başka hiçbir şey yok. Çizginin altında Next.js uygulaması; ' +
            'sıralama sayfaları, içgörü sayfaları, ücretsiz araçlar ve yönetim konsolu. Sıralama ' +
            'sayfaları çizgiyi tek bir indekslenmiş kullanıcı adı sorgusu için bir kez geçiyor; ' +
            'yüzdelik tablolarını ise kaynak dosyaya yazılmış bir bloktan okuyorlar ve o ok ' +
            'veritabanına hiç ulaşmıyor. İçgörü sayfaları yalnızca toplu veri okuyor. Ücretsiz ' +
            'araçlar xlookup’a ulaşmadan önce tool-guard’dan geçiyor. Çizgiyi ters yönde geçen ' +
            'tek ok, LinkedIn lead’lerini üç fiillik linkedin_writer rolüyle yazan yönetim ' +
            'konsolu. Kenarda Caddy, PostgREST ve pazar yeri Postgres’i; bir de aynı scraper ' +
            'havuzunu kullanan satıcı ilan akışı var.',

        bandSources: 'KAYNAKLAR',
        bandEngine: 'ENGINE YIĞINI',
        bandDb: 'ENGINE POSTGRES',
        bandApp: 'NEXT.JS UYGULAMASI',

        xSub: 'twscrape havuzu, 35 hesap',
        telegramSub: 'web + bot crawler',
        blueskySub: 'firehose + takip grafiği',
        tiktokSub: 'keşif + crawler',
        youtubeSub: 'resmî Data API',
        linkedinSub: 'lead rehberi',
        sharedNote: 'satıcı doğrulamasıyla ortak',

        crawlers: 'crawler’lar',
        crawlersSub: 'ağ başına bir servis',
        discovery: 'keşif',
        discoverySub: 'yönlendirme, bahsetme, takip grafiği',
        rollups: 'rollup’lar',
        rollupsSub: 'SQL toplamaları',
        xlookupSub: 'okuma servisi, HTTP',
        engineNote: 'Python, 14 container, 18.002 satır',

        write: 'yazma',
        boundary: 'directory_reader, sadece SELECT',
        countsNote: 'satır sayıları, 2026-08-24',

        rank: 'Sıralama sayfaları',
        rankSub: '5, ağ başına bir tane',
        insights: 'İçgörüler',
        insightsSub: '9 sayfa + data.json',
        tools: 'Ücretsiz araçlar',
        toolsSub: '25, tek kapı',
        admin: 'Yönetim konsolu',
        adminSub: 'LinkedIn lead’leri',

        baked: 'BAKED tablolar',
        bakedSub: '101 kırılım noktası, kaynak dosyada',
        guardSub: 'dokuz kontrol; yoklama kapanarak hata veriyor',
        seller: 'Satıcı ilan akışı',
        sellerSub: 'aynı 35 hesap',

        caddySub: 'TLS, /rest yolu, istemci IP’si',
        postgrestSub: 'pazar yeri API’si',
        marketSub: 'kullanıcı, ilan, işlem, cüzdan',

        zeroQueries: '0 sorgu',
        indexedLookup: 'tek indekslenmiş kullanıcı adı sorgusu',
        aggregates: 'sadece toplu veri, ham akış asla',
        aggregatesShort: 'sadece toplu veri',
        writer: 'linkedin_writer, 3 fiil',
        writerShort: 'linkedin_writer',
        lookupShort: 'tek indekslenmiş sorgu',
        nineGates: '9 kapı, sonra havuz',
        ownership: 'kullanıcı adı sahipliği kontrolü',
    },
};
