import type { CrmSolidContent } from './crmsolid.en';

/* ---------------------------------------------------------------------------
 *  CRMSolid vaka incelemesi, Türkçe.
 *
 *  Sayılar ve iddialar İngilizce metinle birebir aynı; sadece dili değişti.
 *  Ürün ve teknoloji adları çevrilmedi. Sektörde yerleşmiş terimler olduğu
 *  gibi bırakıldı: backend, deploy, stack, rate limit, prompt, lead, container.
 *  Ondalık ayırıcı virgül, binlik ayırıcı nokta.
 * ------------------------------------------------------------------------- */

export const crmsolidTr: CrmSolidContent = {
    meta: {
        title: 'CRMSolid vaka incelemesi | Emirhan Güven',
        desc:
            'CRMSolid nasıl çalışıyor: tek bir Linux sunucuda beş deploy edilmiş servis, 277 saniye ' +
            'yerine 15ms’de cevap veren 1,79 milyon satırlık bir firma kataloğu, elle yazılmış bir ' +
            'MCP sunucusu ve ürünü şekillendiren rate limit hataları.',
    },

    kicker: 'VAKA İNCELEMESİ',
    byline: 'TEK GELİŞTİRİCİ / 2025’TEN BERİ CANLIDA',

    standfirst:
        'E-posta yerine mesajlaşma uygulamaları üzerinden satış yapan ekipler için çok kiracılı bir SaaS CRM. Tasarımı, kodu ve işletmesi bana ait: bir .NET 8 API, bir Next.js panel, bir .NET 9 masaüstü ajanı, bir sağlık monitörü ve bir tanıtım sitesi; ==tek bir Linux sunucuda, Traefik’in arkasında==.',
    intro:
        'İlginç kısımlar CRUD değil. Açık harita verisinden kurulmuş 1,79 milyon satırlık bir firma rehberi, Claude ve diğer asistanların CRM’i bir araç gibi kullanmasını sağlayan bir MCP sunucusu ve hangi arka plan işinin harcama yapabileceğine karar veren, hesap başına tutulan bir rate bütçesi. Backend modüler bir monolit. Bu bir tercihti, kaza değil; 02. bölüm nedenini anlatıyor.',

    stats: [
        ['1,79 M', 'firma kaydı, yerelde aranıyor'],
        ['277s → 15ms', 'katalog sorgusu, öncesi ve sonrası'],
        ['5', 'ayrı deploy edilen servis'],
        ['62', 'yapay zekâ asistanları için MCP aracı'],
        ['516', 'NUnit test metodu'],
        ['211 K', 'satır elle yazılmış C#'],
    ],
    statsNote:
        'Depodan sayıldı veya canlı loglardan okundu. Depo özel olduğu için kanıt bu sayfa.',

    contents: 'İÇİNDEKİLER',
    contentsAria: 'İçindekiler',

    toc: {
        problem: 'Problem',
        architecture: 'Mimari',
        catalogue: 'Katalog',
        mcp: 'MCP sunucusu',
        tenancy: 'Çok kiracılılık',
        flood: 'Flood bütçesi',
        realtime: 'Canlı güncelleme, model seçimi',
        operations: 'Testler ve operasyon',
        failures: 'İşe yaramayanlar',
        stack: 'Teknolojiler',
        numbers: 'Rakamlar',
        links: 'Bağlantılar',
    },

    heading: {
        problem: 'Problem',
        architecture: 'Mimari',
        catalogue: '1,79 milyon satırlık bir rehber: 277 saniyeden 15 milisaniyeye',
        mcp: 'Spesifikasyona bakarak elle yazılmış bir MCP sunucusu',
        tenancy: 'Çok kiracılılık: ortak havuz ve taklit edilemeyen bir header',
        flood: 'Flood bütçesi: ürün kısıtı olarak rate limit',
        realtime: 'Canlı güncellemeler ve her tur için ayrı model seçmek',
        operations: 'Testler ve canlı operasyon',
        failures: 'İşe yaramayanlar',
        stack: 'Teknolojiler',
        numbers: 'Rakamlar',
        links: 'Bağlantılar',
    },

    /* ---- 01 --------------------------------------------------------------- */
    problem: {
        intro: [
            'Türkiye’de satış ekiplerinin işinin büyük kısmı e-postada değil, Telegram ve X üzerinde geçiyor. Bu pazara yazılmış CRM’ler ise e-posta zincirlerini, bir web formunu ve o formu dolduran bir kişiyi varsayıyor. Hiçbiri işin gerçekte yürüdüğü şekle uymuyor: ilk temas bir direkt mesaj, satış aynı yazışmanın içinde ilerliyor ve satışçı aynı anda birkaç hesabı birden çeviriyor.',
            'Yani çözülmesi gereken üç şey vardı.',
        ],
        subs: [
            {
                head: 'İnsanları CRM’e sokmak',
                body: 'Lead listesi satın almak pahalı ve veri bayat. Overture Maps açık lisanslı küresel bir mekân veri seti yayımlıyor (CDLA-Permissive-2.0, ticari kullanıma izinli); içinde adı, kategorisi, telefonu ve web sitesiyle birlikte yaklaşık 1,9 milyon Türk firması var. Bir arama kutusunun arkasına koyacak kadar hızlı sorgulayabiliyorsanız, bu her liste satıcısından daha iyi bir başlangıç.',
            },
            {
                head: 'Hesap kısıtlanmadan mesaj göndermek',
                body: 'Telegram hesap başına flood limitleri uyguluyor ve duvara tekrar tekrar toslayınca cezayı büyütüyor. Kullanıcı adına mesaj gönderen bir CRM, o kullanıcının kendi bütçesini harcıyor; arka plandaki temizlik işleri de aynı bütçeden harcamaya başladığı an ürün çalışmayı bırakıyor. Sistemdeki en zor kısıt bu çıktı.',
            },
            {
                head: 'Hepsini tek kişinin işletmesi',
                body: 'SRE yok, platform ekibi yok, nöbet listesi yok. Her mimari tercih, bir yıl sonra gecenin ikisinde tek başıma ayakta tutabileceğim bir tercih olmak zorundaydı.',
            },
        ],
        figure: {
            alt: 'CRMSolid birleşik gelen kutusu: bir posta kutusu listesi, farklı kanallardan gelen yazışmaların okunmamış sayıları ve lead puanlarıyla dizildiği bir sütun, ve boş bir okuma paneli.',
            caption:
                'Satışın ilerlediği bütün kanallar için tek bir gelen kutusu. Buradaki bir yazışma, 02. bölümdeki pipeline kartının takip ettiği konuşmanın ta kendisi; e-postaya göre tasarlanmış CRM’lerin kaçırdığı nokta da bu.',
        },
    },

    /* ---- 02 --------------------------------------------------------------- */
    architecture: {
        intro:
            'Beş ayrı deploy edilen parçadan oluşan modüler bir monolit. Ürünün büyük bölümü tek bir .NET 8 sürecinde yaşıyor. Üç şey dışarı ayrılmış ve her ayrımın gerekçesi modayla değil, deploy veya hasar yarıçapıyla ilgili.',
        pieces: [
            {
                name: 'API',
                tech: '.NET 8, EF Core, Npgsql, Redis, DuckDB',
                why: 'Ürünün kendisi. Tek süreç, tek veritabanı, tek deploy.',
            },
            {
                name: 'Panel',
                tech: 'Next.js 15, React 19, TypeScript',
                why: 'Farklı çalışma zamanı, farklı sürüm temposu. Kendi container’ı olarak yayınlanıyor; böylece bir arayüz düzeltmesi API’yi yeniden başlatıp bütün SignalR bağlantılarını düşürmüyor.',
            },
            {
                name: 'Masaüstü ajan',
                tech: '.NET 9, Blazor ile Photino.NET, SQLite',
                why: 'Kullanıcının makinesinde çalışıyor, çünkü Telegram MTProto oturumlarının yeri kullanıcının IP’si, paylaşımlı bir sunucu IP’si değil. Sunucu bileşeni olması mümkün değil.',
            },
            {
                name: 'Sağlık monitörü',
                tech: '.NET, ayrı container',
                why: 'İzlediği şeyden sağ çıkması gerekiyor. API’nin içinde olsaydı onunla birlikte düşerdi; oysa önem taşıdığı tek an tam da o an.',
            },
            {
                name: 'Tanıtım sitesi',
                tech: 'Vite üzerinde React 18, ön render',
                why: 'Statik. Backend deploy’una bağlamak için bir sebep yok.',
            },
        ],
        whyNotHead: 'Neden mikroservis değil',
        whyNot: [
            'Tek kişiyim. Mikroservisler karmaşıklığı koddan alıp operasyona taşıyor: servis keşfi, dağıtık izleme, servis başına deploy hattı, servisler arası sürümlenmiş sözleşmeler ve bir veritabanı işleminin yettiği yerde dağıtık işlem problemi. Bu, bu ölçekte ihtiyacım olmayan bağımsız ölçeklenebilirlik karşılığında her hafta ödenen gerçek bir maliyet.',
            'Modüler monolit bana asıl istediğim şeyi veriyor: tek bir işlem sınırı. Bir mesaj geldiğinde CRM mesajı yazıyor, konuşmayı güncelliyor, kişinin aşamasını ilerletiyor ve bir webhook gönderimini kuyruğa alıyor. Tek süreçte bunların hepsi tek bir `SaveChanges`. Servislere bölündüğünde ise telafi mantığı olan bir saga oluyor ve o telafilerin her biri tek başıma yazıp test etmem gereken kod.',
            'Dışarı ayrılan parçalar ya fiziksel olarak birlikte olamadıkları için ayrıldı (masaüstü ajan), ya birlikte düşmemeleri gerektiği için (sağlık monitörü), ya da farklı bir çalışma zamanı ve sürüm ritmi oldukları için (panel ve tanıtım sitesi). Sorgulamaya dayanan gerekçeler bunlar.',
            'Monolitin içinde sınırlar modüllerle çiziliyor: `Services/Mcp`, `Services/Assistant`, `Services/Bot`, `Services/Webhooks`, `Services/Email`, `Services/Alerts`, `Services/Clipper`, `Services/Ads`, `Services/PaymentProviders`. Ürünün bir gün bölünmesi gerekirse, dikişler bunlar.',
        ],
        runtimeHead: 'Çalışma zamanı görünümü',
        runtime: [
            'PostgreSQL 16 üzerinde, tek bir `AppDbContext` içinde 168 `DbSet` özelliği ve 2.521 satır yapılandırma.',
            '`Controllers/Api` altında 100’den fazla REST controller, ayrıca MCP’ye ayrılmış bir controller çifti.',
            '17 arka plan servisi. Önemlileri: `JobWorker` kuyruğu 5 saniyede bir yoklayıp mesajları gönderiyor, `SequenceProcessor` kampanya adımlarını işletiyor, `BusinessDiscoveryWorker` ve `SocialHarvestWorker` kataloğu zenginleştiriyor, `SubscriptionEnforcementService` plan limitlerini uyguluyor.',
            '3 SignalR hub’ı, 1.223 satır: panel sohbeti, siteye gömülen canlı destek bileşeni ve anlık ziyaretçi durumu.',
            'Rate limit sayaçları ve onları koruyan dağıtık kilit için Redis.',
            'Konsola ve sıkıştırılmış JSON dosyalarına Serilog; her isteğe bir korelasyon kimliği iliştiriliyor.',
        ],
        diagramCaption:
            'Uçtan uca tek bir istek yolu. Çizimin derdi şu: MCP sunucusu ile REST API aynı süreç ve aynı veritabanını okuyor, Telegram bağlantısı ise sunucudan değil kullanıcının kendi makinesinden çıkıyor.',
        figure: {
            alt: 'CRMSolid kişi pipeline panosu: sekme olarak dört adlandırılmış pipeline, bir sayaç şeridi ve Prospect, Contacted, Negotiating ve Live başlıklı kanban sütunlarında kullanıcı adları, mesaj önizlemeleri ve etiketleriyle kişi kartları.',
            caption:
                'Panel, demo bir çalışma alanında. Tek bir Next.js uygulamasında on altı ürün alanı; hepsi semantik token’lar ve arayüz primitiflerinden oluşan ortak bir tasarım sistemi üzerinde. Buradaki her kart, API’nin sunduğu ve bir SignalR hub’ının güncel tuttuğu bir satır.',
        },
    },

    /* ---- 03 --------------------------------------------------------------- */
    catalogue: {
        subs: [
            {
                head: 'İhtiyaç',
                body: 'Kullanıcıların satış yapacak firmalar bulması gerekiyor. Overture Maps mekân verisini herkese açık S3 üzerinde parquet dosyaları olarak yayımlıyor. DuckDB uzaktaki parquet’i doğrudan okuyabildiği için ilk sürüm, kullanıcı her arama yaptığında sorguyu doğrudan bucket’a yöneltiyordu.',
            },
            {
                head: 'Bunun neden çöktüğü',
                body: 'Türkiye’deki bir sunucudan ölçüldüğünde, Overture bucket’ına yapılan tek bir il sorgusu 277 saniye sürüyordu. Bu yavaş bir arama kutusu değil, bozuk bir özellik. us-west-2’ye olan gecikme ve taranan parquet hacmi, sorgu nasıl yazılırsa yazılsın sorgu başına uzak okumayı imkânsız kılıyordu.',
            },
            {
                head: 'Çözüm',
                body: 'Ülkeyi bir kez çek, aramaları yerel tablodan cevapla. `BusinessCatalogSyncService`, yaklaşık 1,79 milyon satırlık, çalışma alanından bağımsız ortak bir tablo olan `business_catalog`’u kuruyor. Aynı sorgu artık ==277 saniye yerine 15ms== sürüyor. Arama başına çekim değil de tam bir aktarım olduğu için katalog gerçekten bütün firmaları içeriyor, sadece birinin aradıklarını değil.',
            },
            {
                head: 'Yazma yolunun neden EF Core olmadığı',
                body: '1,9 milyon satırı EF Core üzerinden yüklemek, 1,9 milyon takip edilen varlık ve saatlerce değişiklik takibi demek. Senkronizasyon, 20.000 satırlık partiler hâlinde geçici bir hazırlık tablosuna Npgsql binary `COPY` ile yazıyor, sonra parti başına Overture kimliğine dayalı tek bir upsert yapıyor. Bu, işin tamamını idempotent kılıyor: tekrar çalıştırmak kopyalamıyor, tazeliyor; yarıda kalan bir çalıştırma da sadece tekrarlanıyor.',
            },
            {
                head: 'İl atamasının neden gerçek bir nokta-poligon testi olduğu',
                body: 'Akla ilk gelen yöntem sınırlayıcı kutular. Türkiye’de il sınırlayıcı kutuları fazlasıyla üst üste biniyor ve en küçük kapsayan kutuyu seçmek İzmir’in merkezini Manisa’ya, Antalya’nın merkezini Burdur’a koyuyor. Bu yüzden senkronizasyon Overture’ın idari sınır poligonlarını yüklüyor ve gerçek geometriye karşı `ST_Within` kullanıyor.',
            },
            {
                head: 'Adres alanının neden hiç kullanılmadığı',
                body: 'Overture’ın `region` alanı Türkiye satırlarının yaklaşık %92’sinde boş, kalanında da tutarsız. İl ve ilçe filtrelemesi tamamen coğrafi.',
            },
        ],
    },

    /* ---- 04 --------------------------------------------------------------- */
    mcp: {
        intro:
            'CRMSolid, Model Context Protocol konuşuyor; böylece bir yapay zekâ asistanı CRM’i kazınmış bir arayüz veya genel amaçlı bir HTTP sarmalayıcısı üzerinden değil, bir araç kümesi olarak kullanabiliyor.',
        facts: [
            {
                k: '62 araç',
                v: 'crm_search_contacts ve crm_get_contact’tan crm_create_deal, crm_schedule_social_post, crm_list_invoices ve crm_run_agent’a kadar.',
            },
            {
                k: '21 kaynak, 15 prompt',
                v: 'böylece bir istemci CRM’in ne sunduğunu listeleyebiliyor ve çıplak bir fonksiyon imzası yerine çalışan bir prompt alabiliyor.',
            },
            {
                k: 'Yaklaşık 8.400 satır',
                v: 'Services/Mcp ve Controllers/Mcp arasında.',
            },
        ],
        subs: [
            {
                head: 'Protokol elle yazıldı',
                body: 'JSON-RPC 2.0 ve MCP DTO’larını, önizleme aşamasındaki C# SDK’sını almak yerine kendim yazdım. Sebep sürüm zamanlaması: MCP 2025 ve 2026 boyunca hızlı değişti ve canlı API’min ne zaman biçim değiştireceğine bir önizleme bağımlılığının karar vermesini istemedim. Uygulama 2025-06-18 spesifikasyon revizyonunu hedefliyor ve `initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get` ve `ping` çağrılarını, ayrıca sunucudan başlatılan bildirimler için bir SSE kanalını kapsıyor.',
            },
            {
                head: 'Oturumlar bilerek isteğe bağlı',
                body: '`McpSessionManager`, Streamable HTTP oturumlarını takip ediyor; her birinin 256 bitlik rastgele bir kimliği, ait olduğu doğrulanmış kullanıcısı ve bir `GET /mcp` SSE okuyucusunun boşalttığı giden bildirim kanalı var. Hiç `Mcp-Session-Id` göndermeyen istemciler hiç oturum açmıyor ve çalışmaya devam ediyor. Oturum sahipliği, yönetici oturumu teslim etmeden önce controller içinde doğrulanıyor; böylece bir kullanıcının MCP oturumuna başkası seslenemiyor. Kendi test paketleri var: `McpServerTests` ve `McpSocialSurfaceTests`.',
            },
        ],
        figure: {
            alt: 'CRM Solid MCP paketinin kapak kartı; üzerinde şunlar yazıyor: sosyal DM kutunuzu okuyun ve Claude, Cursor veya ChatGPT üzerinden gönderi planlayın, 12 platform, tek bir tipli araç seti, npm @crmsolid/mcp-server, MIT, stdio ve HTTP.',
            caption:
                'Yayımlanmış TypeScript MCP sunucusu; yukarıda anlatılan C# uygulamasından ayrı, MIT lisanslı bir paket. İkisi de aynı API’ye karşı aynı protokolü konuşuyor: biri yerel istemciler için stdio, diğeri Streamable HTTP üzerinden.',
        },
    },

    /* ---- 05 --------------------------------------------------------------- */
    tenancy: {
        paras: [
            'Çalışma alanları, birkaç kişinin tek bir CRM’i paylaşmasını sağlıyor. Model, satır düzeyi güvenlik politikası veya kiracı başına veritabanı değil; ortak bir havuz.',
            'Veri sahipliği `UserId` üzerinden kurulu kalıyor, dolayısıyla ekleme işlemleri hiç değişmedi. Okuma, düzenleme ve silme, çağıranın aktif çalışma alanındaki üyelere ait `UserId` değerlerinin birleşimiyle sınırlanıyor. Sorgular `scopedIds.Contains(x.UserId)` ile filtreliyor.',
            'Aktif çalışma alanı bir `X-Workspace-Id` istek başlığıyla geliyor, yani saldırganın kontrolünde. `WorkspaceScope` bunu her zaman gerçek üyeliğe karşı doğruluyor; tanınmayan veya yabancı bir kimlik sessizce çağıranın kişisel kapsamına düşüyor. Taklit edilmiş bir başlık bu yüzden erişimi hiçbir zaman genişletemiyor, olsa olsa genişletmeyi başaramıyor. Bu tek kural özelliğin güvenlik temeli ve bir refactor sırasında kaybolmasın diye arayüz dokümantasyonuna yazılmış durumda.',
            'Yazma yetkisi ayrı bir mesele. `RequireWorkspaceWriteAttribute`, yalnızca değişiklik yapan uçlara uygulanan bir action filter. Viewer rolü için 403 dönüyor. Üzerindeki yorum asıl meseleyi söylüyor: yetkili merci backend, frontend’deki rol kontrolü kullanıcı deneyimi.',
            'Üye listeleri `WorkspaceService` tarafından açıkça geçersiz kılınmak üzere 45 saniye önbellekleniyor ve çözülen kapsam istek başına hafızada tutuluyor.',
        ],
    },

    /* ---- 06 --------------------------------------------------------------- */
    flood: {
        paras: [
            'Sistemin bir kullanıcı hesabı üzerinden yaptığı her MTProto çağrısı, o kullanıcının giden mesajlarının ihtiyaç duyduğu hesap başına flood bütçesinden harcanıyor. Bu da rate limit’i bir nezaket özelliği değil, kaynak dağıtımı problemi hâline getiriyor.',
            '`RateLimiter`, hesap başına sayaçları 5 saniyelik zaman aşımı olan dağıtık bir kilidin arkasında Redis’te tutuyor ve kilidi alamazsa kapalı tarafa düşüyor. Varsayılanlar bilinçli olarak tutucu: saatte 20 mesaj, mesajlar arasında en az 10 saniye, arka arkaya 10 gönderimden sonra zorunlu mola ve `PEER_FLOOD` durumunda tekrarlarda 8 saate çıkan 2 saatlik ceza. Tarayıcılar art arda gelen `FLOOD_WAIT` yanıtlarında üstel geri çekilme uyguluyor ve bekleme süresini hatanın kendisinden okuyor.',
            'Herkese açık REST API’nin kendi sınırlayıcısı var: `PublicApiRequestLimiter`, API anahtarı kimliğine göre dakikalık pencerede çalışıyor; anahtar başına limit JWT içinde bir claim olarak taşınıyor, claim eksik veya okunamıyorsa varsayılan dakikada 60 istek.',
            'Bütün bunları şekillendiren hata 09. bölümde.',
        ],
    },

    /* ---- 07 --------------------------------------------------------------- */
    realtime: {
        subs: [
            {
                head: 'Güncellemeleri gizleyen interceptor hatası',
                paras: [
                    'Canlı güncellemeler SignalR üzerinden gidiyor. Her çağrı noktasında yayın yapmayı hatırlamak yerine, yayın bir EF Core `SaveChangesInterceptor`’ına asılı: bir mesajı veya konuşmayı kaydeden her şey onu yayımlıyor, kaydı yapan koddan hiçbir iş birliği istemeden.',
                    'Bunu doğru kurmak EF Core’a dair belirli bir bilgi gerektiriyordu. Interceptor bir singleton, dolayısıyla kayıt başına durumun `DbContext` örneğine göre anahtarlanması gerekiyor; bunu bir `ConditionalWeakTable` ile yapıyor. Daha önemlisi, varlıklar `SavingChanges` içinde, `EntityState` hâlâ `Added` veya `Modified` iken yakalanıyor ve `SavedChanges` içinde yayımlanıyor. `SavedChanges` içinde `EntityState.Added` okumak hiçbir şey bulmuyor, çünkü EF Core çoktan `AcceptAllChanges` çağırmış ve her varlığı `Unchanged` hâline getirmiş oluyor.',
                    'Bu uzun süre yaşayan bir hataydı: mesajlar doğru kaydediliyordu, arayüz sadece haberdar olmuyordu ve hiçbir şey hata fırlatmadığı için loglarda da iz yoktu.',
                ],
            },
            {
                head: 'Özellik başına değil, tur başına model seçmek',
                paras: [
                    'Uygulama içi asistan işi Claude’a gönderiyor. Trafiği iki uçlu: turların çoğu “ödenmemiş faturaları göster” ya da “bugün bana kim yazdı” gibi sorgular; tek bir araç çağrısı ve bir cümlelik anlatım. Azınlıkta kalanlar ise özelliğin var olma sebebi olan turlar: iki dönemi karşılaştırmak, bir takip dizisi planlamak veya kullanıcının birazdan onaylayacağı bir yazma işlemini hazırlamak.',
                    '`AssistantModelRouter` niyete göre yönlendiriyor ve sorgular için daha ucuz, daha hızlı modeli seçiyor. Yönlendirmenin kendisinden daha önemli iki ayrıntı var. Tahmin yanlış olduğunda yukarı yönde yanlış oluyor ve bir yazma önerisi her zaman üst modele çıkıyor; çünkü onay kartı ne olacağına dair bir söz ve kullanıcı onu yeniden hesaplamadan onaylıyor. Bir de yükseltme işaretleri çok dilli, çünkü panel Türkçe, İngilizce ve Rusça çıkıyor ve Türkçe soran bir operatörün aynı soru için İngilizce konuşanla aynı modeli alması gerekiyor.',
                    'Her yönlendirme kararı gerekçesiyle loglanıyor, böylece seçimler sonradan denetlenebiliyor.',
                ],
            },
        ],
        figure: {
            alt: 'CRMSolid yapay zekâ ajanları ekranı: toplam ajan, aktif ajan ve son 24 saatteki çalıştırma sayaçlarının altında Inbound Sales Assistant, Support Triage Bot ve Lead Qualifier adlı üç ajan kartı; her biri kanallarını, gönderim modunu ve en son ne zaman çalıştığını gösteriyor.',
            caption:
                'Ajanlar kod değil, yapılandırma. Her biri hangi kanallara baktığını ve kendi başına mı gönderdiğini yoksa sadece öneri mi yaptığını belirtiyor. Yönlendiricinin hangi modelle cevap verebileceğine karar veren de bu mod.',
        },
    },

    /* ---- 08 --------------------------------------------------------------- */
    operations: {
        subs: [
            {
                head: 'Testler',
                body: 'API paketinde 34 dosyada 516 NUnit test metodu, ayrıca .NET SDK’sı için ayrı bir paket. Yanılmanın pahalıya patladığı yerleri kapsıyorlar: `RateLimiterTests`, `BusinessCatalogSyncTests` ve `BusinessCatalogFullSyncTests`, `McpServerTests`, `PublicApiRequestLimiterTests`, `OutreachSafetyTests`, `OutreachRetryTests`, `JobFailureClassifierTests`, `WebhookSignatureTests`.',
            },
            {
                head: 'Deploylar',
                body: 'GitHub Actions, hedef seçiciyle elle tetikleniyor; yani neyin çıkacağına ben karar veriyorum. Önce test işi koşuyor. Deploy, sunucuya depo secret’ında tutulan bir SSH anahtarıyla bağlanıyor, hiçbir zaman parolayla değil.',
            },
            {
                head: 'Çalışma ortamı',
                body: 'Traefik 3.1 arkasında Docker Compose; sertifikalar Let’s Encrypt ile otomatik alınıyor ve her sunucu adı için kalıcı bir HTTP’den HTTPS’e yönlendirme var. PostgreSQL 16 kendi container’ında, sağlık kontrolüyle. Ayrı bir sağlık monitörü container’ı API’yi API’nin dışından yokluyor.',
            },
            {
                head: 'Saklanmaya değer bir derleme ayrıntısı',
                body: 'API imajı Alpine değil, Debian: `aspnet:8.0-bookworm-slim`. DuckDB’nin getirdiği yerel `libduckdb.so` glibc’ye göre derlenmiş ve musl üzerinde yüklenmiyor: eksik `libstdc++.so.6`, eksik `libgcc_s.so.1`, çözülemeyen `std::` sembolleri. Katalog var olduğu andan itibaren küçük temel imaj bir seçenek değildi ve kimse geri optimize etmesin diye gerekçe Dockerfile’a yazıldı.',
            },
        ],
    },

    /* ---- 09 --------------------------------------------------------------- */
    failures: {
        intro:
            'Bu dürüst bölüm. Aşağıdaki her madde, yayına aldığım ya da denediğim, canlıda veya ölçülmüş bir testte çöktüğünü gördüğüm ve değiştirdiğim bir şey.',
        panelHead: 'Düzeltmeler, bana zaman kaybettirdikleri sırayla',
        items: [
            {
                lead: 'Her aramada uzaktaki parquet’i okumak.',
                body: 'DuckDB’yi her kullanıcı aramasında Overture S3 bucket’ına yöneltmek tek bir il için 277 saniyeye mal oldu. Yerine tam bir yerel senkronizasyon kondu.',
            },
            {
                lead: 'Uzamsal birleştirmeyi S3 üzerinden akıtmak.',
                body: 'Akla gelen bir sonraki deneme veriyi uzakta bırakıp filtrelemeyi tek sorguda yapmaktı: `ST_Within`’i doğrudan uzaktaki parquet’e karşı birleştirmek. DuckDB tek bir satır üretmeden önce birleştirmenin tamamını maddeleştiriyor. 2,5 GB bellekte oturdu ve 15 dakika sonra sıfır satır üretti. İkiye bölmek çözdü: önce hiç uzamsal iş yapmadan ülkeyi bir sınırlayıcı kutu içinde indir, sonra yerel veriye karşı il il birleştir. Her adım sınırlı ve daha da önemlisi gözlenebilir. İlerlemeyi görebiliyordum.',
            },
            {
                lead: 'İl atamasında sınırlayıcı kutulara güvenmek.',
                body: 'Türkiye’de il kutuları fazlasıyla üst üste biniyor. En küçük kapsayan kutuyu seçmek İzmir’in merkezini Manisa’ya, Antalya’nın merkezini Burdur’a koydu. Overture sınır geometrisine karşı gerçek nokta-poligon testi işe yarayan tek şeydi.',
            },
            {
                lead: '81 il varsaymak.',
                body: 'Türkiye’de 81 il var. Overture 109 il satırı gönderiyor, çünkü Adana, Antalya ve Artvin birden fazla kez geçiyor. Birleştirme yapılmazsa ikinci aşama o illeri iki kez işliyor ve firmalarını çift sayıyor. `ST_Union_Agg` geometrileri isme göre birleştiriyor ve sayı 81’e dönüyor.',
            },
            {
                lead: 'Firma adlarının geçerli UTF-8 olduğunu varsaymak.',
                body: 'Veri setindeki gerçek firma adları yalnız kalmış vekil karakterler taşıyor; genelde kırpılmış bir kaynak kayıttan arta kalan yarım bir emoji çifti. Npgsql’in UTF-8 kodlayıcısı bunlarda hata fırlatıyor ve bütün binary `COPY` partisini iptal ediyor. Bir metni sütun genişliğine kırpmak geçerli bir çifti de ikiye bölebildiği için temizlik kırpmadan önce değil, sonra çalışmak zorunda. Null baytlar ise doğrudan atılıyor, çünkü Postgres onları metin sütunlarında kabul etmiyor.',
            },
            {
                lead: 'Kozmetik bir özelliğin flood bütçesini harcamasına izin vermek.',
                body: 'En kötüsü bu. Avatar senkronizasyonunun ilk sürümü kişi başına bir kez `Contacts_GetContacts`, `Messages_GetDialogs` ve `Contacts_ResolveUsername` çağırıyordu. 15 dakikada bir işlenen 150 kişilik bir parti, günde yaklaşık 2.500 `ResolveUsername` çağrısı ediyordu; üstelik kullanıcının mesajlarının çıktığı hesabın üzerinden. Hesap sürekli bir flood penceresinin içinde kaldı ve sıradan sohbet mesajları `FLOOD_WAIT_300` ile düşmeye başladı. Profil fotoğrafları ürünü bozdu.',
            },
            {
                lead: 'Bunu döngü başına bir bayrakla düzeltmek.',
                body: 'İlk düzeltme yetmedi. Döngü başına bayrak on beş dakikada bir sıfırlanıyordu; yeni döngü sıfırdan başlıyor, çağrılarını harcıyor, aynı duvara tosluyor ve Telegram her seferinde cezayı uzatıyordu. Canlı ortam bir gecede `FLOOD_WAIT_15062`’den, yaklaşık 4 saat, `FLOOD_WAIT_80024`’e, yaklaşık 22 saat, çıktı. Tutan çözüm, döngüler arasında saklanan, hesap başına bir “şu ana kadar dokunma” damgası oldu.',
            },
            {
                lead: 'ResolveUsername’i yedek yol olarak kullanmak.',
                body: 'Avatarı olmayan kişilerin çoğu CRM’e başka kanallardan geliyor, dolayısıyla kayıtlı kullanıcı adları bir kullanıcı adı değil, telefon numarası. On saatlik canlı çalışma bunların tam olarak sıfırını çözdü ve hesaba 22 saatlik ceza kazandırdı. Kaldırıldı. Gerçekten konuştuğumuz kişiler ilk mesajlarıyla birlikte bir kimlik ve erişim anahtarıyla geldiği için avatarları yine de önbellekten çözülüyor; çözülen her şey de geri yazılıyor, böylece gönderim yolu bir daha çözmek zorunda kalmıyor.',
            },
            {
                lead: 'SavedChanges içinde EntityState.Added okumak.',
                body: '07. bölümde anlatıldı. EF Core o noktada `AcceptAllChanges`’i çoktan çağırmış oluyor, dolayısıyla kontrol sessizce hiçbir şeyle eşleşmiyordu ve gerçek zamanlı mesaj iletimi usulca gerçekleşmiyordu.',
            },
            {
                lead: 'Sohbet öğrenme prompt’unu tek seferde kurmak.',
                body: 'Tek seferlik prompt kurulumu yaklaşık 28.000 karakterden sonrasını sessizce düşürüyordu. Hata yok, sadece girdinin bir kısmı üzerinde akıl yürüten bir model. Yerine partili pencereler kondu: en yeni konuşmalar önce, birleştirilmiş sonuç ve hangi konuşmaların gerçekten içeri girdiğini bildiren dürüst kapsam istatistikleriyle.',
            },
            {
                lead: 'Temel imaj olarak Alpine.',
                body: 'Daha küçük ve DuckDB’nin getirdiği, glibc’ye bağlı yerel kütüphaneyle tamamen uyumsuz.',
            },
        ],
        closing:
            'Hepsindeki ortak tema şu: ==en çok zaman kaybettiren hatalar sessiz olanlardı==. Sıfır satır, düşen bir prompt kuyruğu, hiç tetiklenmeyen bir olay. Yukarıdaki düzeltmelerin birkaçı aslında aynı düzeltme: hatayı görünür kılmak.',
    },

    /* ---- 10 --------------------------------------------------------------- */
    stack: {
        intro: 'Özgeçmiş kategorisine göre değil, bu sistemde gerçekte ne yaptığına göre gruplandı.',
        rows: [
            ['BACKEND', 'API için C#, .NET 8, ASP.NET Core Web API, Entity Framework Core, LINQ, SignalR, Serilog.'],
            ['VERİ', 'Npgsql ile PostgreSQL 16, toplu yükleme için binary COPY dâhil. Overture hattı için httpfs ve spatial eklentileriyle DuckDB. Rate limit sayaçları ve dağıtık kilitler için Redis. Masaüstü ajanın içinde SQLite.'],
            ['FRONTEND', 'Next.js 15, React 19, TypeScript, Tailwind CSS ve semantik token’lar ile arayüz primitiflerinden oluşan kendi tasarım sistemimiz Solid DS. Tanıtım sitesi Vite üzerinde React 18, Puppeteer ile ön render ediliyor. Çoklu dil desteği next-intl ile.'],
            ['MASAÜSTÜ', '.NET 9, Blazor ile Photino.NET, ayrıca bir Electron derlemesi. Windows ve macOS sürümleri, etiket gönderiminde çalışan matris bir GitHub Actions iş akışıyla üretiliyor.'],
            ['YAPAY ZEKÂ', 'Uygulama içi asistan için Anthropic API, tur başına model yönlendirmesiyle. Mesaj analizi ve lead puanlama için OpenAI API. Elle yazılmış bir MCP sunucusu: SSE’li Streamable HTTP üzerinde JSON-RPC 2.0, 62 araç, 21 kaynak ve 15 prompt sunuyor.'],
            ['ALTYAPI', 'Docker ve Docker Compose, Traefik 3.1, Let’s Encrypt, anahtar tabanlı SSH deploy’larıyla GitHub Actions, Hetzner üzerinde Linux sunucu yönetimi, ayrı bir sağlık monitörü servisi.'],
            ['KİMLİK VE GÜVENLİK', 'BCrypt parola özetlemesiyle JWT. Sunucu tarafında doğrulanan çalışma alanı kapsamı. HMAC imzalı webhook’lar. Şifrelenmiş API anahtarı saklama. Güvenlik başlıkları middleware’i. Middleware katmanında salt okunur bir demo modu.'],
            ['TEST', 'NUnit. API paketinde 516 test metodu, ayrıca .NET SDK’sı için ayrı bir paket.'],
            ['ENTEGRASYONLAR VE SDK’LAR', '.NET, Node ve MCP için üç SDK; dört entegrasyon: ikas, WordPress, Zapier ve MCP kayıt defteri. Ödeme için LemonSqueezy ve WeePay, işlemsel e-posta için Resend, MTProto için WTelegramClient.'],
        ],
    },

    /* ---- 11 --------------------------------------------------------------- */
    numbers: {
        intro: 'Hepsi depo üzerinden ölçüldü veya canlı loglardan okundu.',
        rows: [
            ['Yerel katalogdaki firma kaydı', '1.790.000'],
            ['Katalog sorgusu, öncesi', '277 s'],
            ['Katalog sorgusu, sonrası', '15 ms'],
            ['Başarısız akış denemesi', '2,5 GB RAM, 15 dakikada 0 satır'],
            ['Overture il satırı / gerçek il sayısı', '109 / 81'],
            ['region alanı boş olan Overture satırı', 'yaklaşık %92'],
            ['Toplu yükleme parti boyutu', 'COPY başına 20.000 satır'],
            ['Elle yazılmış C#', '211.066 satır, 686 dosya'],
            ['TypeScript ve React', '305.928 satır, 1.069 .tsx dosyası'],
            ['Depoda takip edilen dosya', '3.770'],
            ['Tek DbContext üzerindeki DbSet özelliği', '168'],
            ['REST controller', '100’den fazla'],
            ['Arka plan işçisi', '17'],
            ['SignalR hub’ı', '3, 1.223 satır'],
            ['MCP aracı, kaynağı, prompt’u', '62 / 21 / 15'],
            ['MCP uygulamasının boyutu', 'yaklaşık 8.400 satır'],
            ['NUnit test metodu', '34 dosyada 516'],
            ['Ayrı deploy edilen servis', '5'],
            ['Varsayılan gönderim limiti', 'saatte 20, 10 s arayla'],
            ['Görülen en ağır flood cezası', 'FLOOD_WAIT_80024, yaklaşık 22 saat'],
        ],
    },

    /* ---- 12 --------------------------------------------------------------- */
    links: {
        intro: 'CRM’in kendisi kapalı kaynak. Şu parçaları herkese açık ve MIT lisanslı.',
        notes: {
            dotnet: 'CRMSolid API’si için .NET SDK’sı. Tipli kaynaklar, HMAC ve bearer kimlik bilgileri, yeniden deneyen bir rate limit işleyicisi, kendi NUnit paketi.',
            mcp: 'TypeScript ile yazılmış MCP sunucusu. Yapay zekâ asistanlarının CRM’i kullanmasını sağlıyor.',
            clipper: 'Chrome eklentisi, Chrome Web Mağazası’nda yayında.',
            site: 'Ürünün kendisi.',
        },
        disclaimer:
            'Bu sayfada hiçbir kimlik bilgisi, ürünün herkese açık alan adı dışında bir sunucu adı, müşteri adı veya özel IP yok. Buradaki bir rakam doğrulanamıyorsa bana yazın, sayfadan kalksın.',
        allProjects: 'TÜM PROJELER',
        visitSite: 'CRMSOLID.COM’A GİT',
    },

    /* ---- çalışma zamanı şeması -------------------------------------------- */
    diagram: {
        title: 'CRMSolid çalışma zamanı mimarisi',
        desc:
            'Solda istemciler: Next.js panelini çalıştıran bir tarayıcı, MCP üzerinden bir yapay zekâ ' +
            'asistanı, siteye gömülü bir sohbet bileşeni ve kullanıcının makinesinde çalışan bir ' +
            'masaüstü ajan. Hepsi Traefik’e ulaşıyor; Traefik TLS’i sonlandırıyor ve dört sunucu adını ' +
            'tanıtım sitesine, panel container’ına, sağlık monitörüne ve TelegramSimple API’ye ' +
            'yönlendiriyor. API tek bir .NET 8 süreci; REST controller’ları, MCP sunucusunu, SignalR ' +
            'hub’larını, on yedi arka plan işçisini ve EF Core bağlamını barındırıyor, dolayısıyla MCP ' +
            'sunucusu ile REST API aynı veritabanını okuyor. Sağında S3 üzerindeki Overture Maps ' +
            'parquet dosyaları, Redis ve PostgreSQL 16 duruyor. Sağlık monitörü API’yi container’ın ' +
            'dışından yokluyor. Masaüstü ajan Telegram MTProto ile doğrudan kullanıcının makinesinden ' +
            'konuşuyor, yani o bağlantı sunucudan hiç çıkmıyor.',
        bandClients: 'İSTEMCİLER',
        bandEdge: 'EDGE',
        bandServer: 'SUNUCU',
        browser: 'Tarayıcı',
        browserSub: 'Next.js 15 paneli',
        assistant: 'Yapay zekâ asistanı',
        assistantSub: 'Claude, herhangi bir MCP istemcisi',
        widget: 'Sohbet bileşeni',
        widgetSub: 'müşteri sitelerine gömülü',
        desktop: 'Masaüstü ajan',
        desktopSub: 'Photino + Blazor, kullanıcı makinesi',
        userIp: 'kullanıcının kendi IP’si',
        traefikTls: 'Let’s Encrypt ile TLS',
        traefikRedirect: 'HTTPS’e yönlendirme',
        traefikTlsStacked: 'Let’s Encrypt ile TLS, HTTPS’e yönlendirme',
        landing: 'Tanıtım sitesi',
        landingSub: 'Vite üzerinde React 18, ön render',
        panel: 'Panel',
        panelSub: 'Next.js 15, kendi container’ı',
        health: 'Sağlık monitörü',
        healthSub: 'ayrı container',
        apiSub: '.NET 8, tek süreç, tek veritabanı',
        rest: 'REST controller’lar',
        restSub: 'Controllers/Api altında 100+',
        mcp: 'MCP sunucusu',
        mcpSub: 'Streamable HTTP üzerinde JSON-RPC',
        hubs: 'SignalR hub’ları',
        hubsSub: 'panel sohbeti, bileşen, durum',
        workers: '17 arka plan işçisi',
        workersSub: 'işler, diziler, katalog senkronu',
        context: 'EF Core AppDbContext',
        contextSub: '168 DbSet',
        probes: 'yokluyor',
        overtureSub: 'parquet, DuckDB ile çekiliyor',
        redisSub: 'rate limit sayaçları, kilitler',
        postgresSub: 'kendi container’ı',
        postgresSubStacked: 'EF Core, Npgsql binary COPY',
        liveUpdates: 'SignalR ile canlı güncelleme',
        liveUpdatesShort: 'canlı güncelleme',
    },
};
