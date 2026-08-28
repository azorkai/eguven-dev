import type { Dictionary } from './en';

/* ---------------------------------------------------------------------------
 *  UI dictionary, Turkish.
 *
 *  Typed as `Dictionary`, so a missing or misspelled key does not compile.
 *
 *  House rules for this file:
 *    - Full diacritics. Never ASCII: geliştirici, not gelistirici.
 *    - No em dash, no en dash. Plain hyphens only.
 *    - Settled sector vocabulary wins over forced translation: backend stays
 *      backend, deploy stays deploy, lead stays lead. Product and technology
 *      names are never translated.
 *    - Headlines are rewritten as Turkish headlines, not carried over word for
 *      word. "The Log" is a ship's log, so it is "Seyir Defteri".
 *    - Anything shown inside an uppercase container is stored uppercased here,
 *      so the dotted capitals are correct with or without Turkish casing.
 * ------------------------------------------------------------------------- */

export const tr: Dictionary = {
    nav: {
        home: 'Ana sayfa',
        projects: 'PROJELER',
        articles: 'YAZILAR',
        contact: 'İLETİŞİM',
        sectionIndex: 'İÇİNDEKİLER',
        openMenu: 'Menüyü aç',
        closeMenu: 'Menüyü kapat',
        github: 'GITHUB',
        linkedin: 'LINKEDIN',
    },

    lang: {
        switchTo: 'İngilizceye geç',
        title: 'English',
    },

    rail: {
        scroll: 'KAYDIR',
        connect: 'İLETİŞİM',
        openTerminal: 'Terminali aç',
    },

    machineBar: {
        region: 'Makine okuyuculara duyuru',
        badge: 'AJANS',
        pitchLong: 'YAPAY ZEKÂ MISINIZ? SİZE GÖRE DİZİLMİŞ BİR BASKI VAR.',
        pitchShort: 'YAPAY ZEKÂ MI?',
        linkLong: 'MAKİNE BASKISINI OKU',
        linkShort: 'MAKİNE BASKISI',
        dismiss: 'Duyuruyu kapat',
    },

    footer: {
        bio: 'İstanbul’da full stack geliştirici. .NET ve React ile canlıda çalışan sistemler kuruyor ve işletiyorum; veritabanı tasarımından deploya kadar.',
        navigation: 'SAYFALAR',
        linkProjects: 'Projeler',
        linkArticles: 'Yazılar',
        linkContact: 'İletişim',
        linkMachine: 'Makine Baskısı',
        emailAria: 'E-posta',
        localTime: 'YEREL SAAT',
        available: 'Yeni projelere açığım',
        top: 'BAŞA',
        rights: '© 2026 EMİRHAN GÜVEN. TÜM HAKLARI SAKLIDIR.',
        madeIn: 'İSTANBUL’DA TASARLANDI VE YAZILDI',
        locale: 'tr-TR',
    },

    nothingHere: 'BURADA BİR ŞEY YOK',

    hero: {
        kicker: 'NOTLAR VE GÖRÜŞLER',
        titleLead: 'Seyir',
        titleAccent: 'Defteri',
        standfirst:
            '.NET ve React üzerinde canlıda çalışan yazılım geliştirirken ve işletirken tuttuğum notlar. Sorgu iyileştirme, deploy, masaüstü ajanı ve ==çalışmadan önce bozulan kısımlar==.',
    },

    sidebar: {
        topics: 'KONULAR',
        topicAll: 'Tüm yazılar',
        topicBackend: 'Backend mühendisliği',
        topicFrontend: 'Frontend performansı',
        topicAi: 'Yapay zekâ',
        topicDevops: 'DevOps',
        subscribe: 'ABONE OL',
        subscribeCopy: 'Yeni yazılar ayda bir doğrudan gelen kutunuza düşsün.',
        emailLabel: 'E-posta adresi',
        emailPlaceholder: 'E-posta adresi',
        subscribeCta: 'ABONE OL',
    },

    articles: {
        empty: 'ARŞİV BOŞ',
        emptyCopy: 'Henüz dizine eklenmiş teknik yazı yok.',
        loadOlder: 'DAHA ESKİ YAZILAR',
        readArticle: 'YAZIYI OKU',
    },

    projects: {
        kicker: 'CANLIDAKİ SİSTEMLER',
        titleLead: 'Yaptığım',
        titleAccent: 'İşler',
        standfirst:
            'Tasarladığım, yazdığım ve hâlâ işlettiğim sistemler. .NET ve PostgreSQL üzerinde canlı bir SaaS CRM, çok kiracılı bir hosting platformu ve 15 milisaniyede cevap veren ==1,79 milyon satırlık bir firma kataloğu==.',
        sortedBy: 'SIRALAMA: ETKİ',
        totalLabel: 'TOPLAM:',
        totalUnit: 'SİSTEM',
        filterAll: 'TÜMÜ',
        filterInfrastructure: 'ALTYAPI',
        filterBackend: 'BACKEND',
        filterPlatform: 'PLATFORM',
        filterAi: 'YAPAY ZEKÂ',
        colSystem: 'SİSTEM',
        colStack: 'STACK',
        colImpact: 'ETKİ VE TEKNİK SONUÇ',
        colDeployment: 'ERİŞİM',
        readCase: 'Vaka incelemesini oku',
        liveSite: 'Canlı site',
        repository: 'GitHub deposu',
        requestPortfolio: 'TAM TEKNİK PORTFÖY İSTE',
    },

    contact: {
        kicker: 'DURUM: TEKLİFLERE AÇIK',
        titleLead: 'Hadi',
        titleAccent: 'Tanışalım.',
        sendDirect: 'DOĞRUDAN MESAJ GÖNDER',
        formKicker: 'TEKLİF',
        formTitleOutline: 'İletişim',
        formTitleSolid: 'Formu',
        nameLabel: 'ADINIZ',
        namePlaceholder: 'Ad Soyad',
        emailLabel: 'E-POSTA ADRESİ',
        emailPlaceholder: 'ad@sirket.com',
        messageLabel: 'MESAJ',
        messagePlaceholder: 'Projenizden kısaca bahsedin...',
        sending: 'GÖNDERİLİYOR...',
        sent: 'GÖNDERİLDİ!',
        send: 'MESAJI GÖNDER',
        back: 'GERİ',
        channels: 'İLETİŞİM KANALLARI',
        availability:
            'İstanbul’da tam zamanlı pozisyonlara (ofis, hibrit veya uzaktan) ve sözleşmeli işlere açığım.',
        bookCall: 'GÖRÜŞME AYARLA',
    },

    terminal: {
        console: 'SİSTEM KONSOLU v1.0.4',
        dockBottom: 'Alta sabitle',
        makeFloating: 'Serbest bırak',
        close: 'Terminali kapat',
        welcome:
            'İnteraktif portföy terminaline hoş geldiniz. Komutları görmek için ‘help’ yazın.',
        notFoundPrefix: 'Komut bulunamadı:',
        notFoundSuffix: 'Komut listesi için ‘help’ yazın.',
        help: 'Kullanılabilir komutlar: [help, whoami, skills, projects, ai, snake, 2048, mines, clear, exit]',
        whoami: 'Emirhan Güven - Full Stack Geliştirici, .NET ve React. 2018’den beri profesyonel olarak yazılım yazıyorum. Şu anda canlıda çalışan bir SaaS CRM olan CRMSolid’i geliştirip işletiyorum: 5 deploy edilmiş servis, PostgreSQL, 516 NUnit testi, bir Linux sunucuda Docker.',
        skills: 'Backend: [C#, .NET 8/9, ASP.NET Core, EF Core, Python, PHP] | Frontend: [React, Next.js, TypeScript, Tailwind, Blazor] | Veritabanı: [PostgreSQL, DuckDB, Redis, MySQL] | Masaüstü: [Photino.NET, Electron] | DevOps: [Docker, Traefik, GitHub Actions, Nginx, Linux] | Yapay zekâ: [Anthropic API, OpenAI API, MCP]',
        projects: '/projects sayfasına yönlendirme yakında... (Üstteki menüyü kullanın)',
        ai: 'Bu sitenin makine okuyucular için yazılmış bir baskısı var: /ai . Düz metin kopyası: /llms.txt',
        snake: 'SNAKE_PROTOCOL başlatılıyor...',
        g2048: 'PROTOCOL_2048 başlatılıyor...',
        mines: 'MINES_SCAN_PROTOCOL başlatılıyor...',
    },

    games: {
        score: 'PUAN',
        exit: 'ÇIK',
        snakeOver: 'BAĞLANTI KOPTU: OYUN BİTTİ',
        snakeFinal: 'SON PUAN:',
        snakeRestart: 'YENİDEN BAŞLAT',
        snakePaused: 'PROTOKOL DURAKLATILDI - DEVAM İÇİN ‘P’',
        snakeMove: 'YÖN TUŞLARI',
        snakePause: '‘P’ DURAKLAT',
        snakeExit: '‘ESC’ ÇIKIŞ',
        g2048Over: 'BELLEK TAŞTI: OYUN BİTTİ',
        g2048Harvested: 'TOPLANAN VERİ:',
        g2048Restart: 'YENİDEN KUR',
        g2048Move: 'YÖN TUŞLARIYLA OYNA',
        g2048Exit: '‘ESC’ ÇIKIŞ',
        g2048Goal: 'HEDEF 2048',
        minesLabel: 'MAYIN',
        minesLost: 'TARAMA BAŞARISIZ: MAYIN PATLADI',
        minesWon: 'SEKTÖR TEMİZ: TARAMA TAMAM',
        minesRestart: 'YENİDEN TARA',
        minesAbort: 'İPTAL',
        minesFlagMode: 'BAYRAK MODU',
        minesDigMode: 'KAZMA MODU',
        minesReveal: 'SOL TIK: AÇ',
        minesFlag: 'SAĞ TIK: BAYRAK',
        minesExit: '‘ESC’ ÇIKIŞ',
    },

    meta: {
        homeTitle: 'Emirhan Güven | Full Stack Geliştirici, .NET ve React',
        homeDesc:
            'Emirhan Güven, İstanbul’da full stack geliştirici. .NET ve React ile canlıda çalışan sistemler kuruyor ve işletiyorum; bunlardan biri tek başıma yazıp hâlâ işlettiğim canlı SaaS CRM CRMSolid.',
        articlesTitle: 'Seyir Defteri | Emirhan Güven',
        articlesDesc:
            '.NET ve React üzerinde canlıda çalışan yazılım geliştirirken ve işletirken tuttuğum notlar: sorgu iyileştirme, deploy, masaüstü ajanı ve çalışmadan önce bozulan kısımlar.',
        contactTitle: 'İletişim | Emirhan Güven',
        contactDesc:
            'İstanbul’da full stack geliştirici Emirhan Güven ile iletişime geçin. Ofis, hibrit veya uzaktan tam zamanlı pozisyonlara ve sözleşmeli işlere açığım.',
    },
};
