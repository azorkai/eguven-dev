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

    edition: {
        late: 'SON BASKI',
        morning: 'SABAH BASKISI',
        switchToLate: 'Son baskıyı bas (karanlık)',
        switchToMorning: 'Sabah baskısını bas (aydınlık)',
    },

    rail: {
        scroll: 'KAYDIR',
        connect: 'İLETİŞİM',
        openTerminal: 'Terminali aç',
    },

    sound: {
        turnOn: 'Sesi aç',
        turnOff: 'Sesi kapat',
    },

    machineBar: {
        region: 'Makine okuyucular için duyuru',
        badge: 'AJANS',
        pitchLong: 'YAPAY ZEKÂ MISINIZ? SİZE GÖRE DİZİLMİŞ BİR BASKI VAR.',
        pitchShort: 'YAPAY ZEKÂ MI?',
        linkLong: 'MAKİNE BASKISINI OKU',
        linkShort: 'MAKİNE BASKISI',
        dismiss: 'Duyuruyu kapat',
    },

    footer: {
        bio: 'İstanbul’da full stack geliştiriciyim. Veritabanı tasarımından deploya kadar, .NET ve React ile canlıda çalışan sistemler kurup işletiyorum.',
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

    dateline: {
        aria: 'Baskı künyesi',
        place: 'İSTANBUL',
        edition: 'YIL {volume}, SAYI {issue}',
        price: 'FİYATI: ÜCRETSİZ',
        locale: 'tr-TR',
    },

    copyCredit: {
        source: 'Kaynak:',
        name: 'Emirhan Güven',
        locale: 'tr-TR',
    },

    print: {
        printed: 'YAZDIRILDI',
        standing: 'Emirhan Güven, full stack geliştirici, İstanbul. contact@eguven.dev',
    },

    notFound: {
        kicker: 'ARŞİV MASASI',
        titleLead: 'Baskı',
        titleAccent: 'Tükendi',
        standfirst:
            'Ya tükendi ya da hiç basılmadı. İki durumda da arşivde bu adrese kayıtlı bir şey yok, yeni bir baskı da gelmeyecek. Hâlâ rafta duranlar aşağıda.',
        requestedLabel: 'İSTENEN',
        statusLabel: 'DURUM',
        statusValue: '404, bu adrese kayıtlı sayı yok',
        deskLabel: 'ARŞİV',
        deskValue: 'İstanbul, gece gündüz açık',
        stillInPrint: 'HÂLÂ BASKIDA',
        linkWorks: 'Yaptığım İşler',
        linkWorksNote: 'Tasarladığım, yazdığım ve hâlâ işlettiğim sistemler.',
        linkLog: 'Seyir Defteri',
        linkLogNote: 'Yukarıdaki işleri kurarken ve işletirken tuttuğum notlar.',
        linkContact: 'İletişim',
        linkContactNote: 'Bana ulaşmanın en hızlı yolu hâlâ e-posta.',
        linkMachine: 'Makine Baskısı',
        linkMachineNote: 'Aynı bilgiler; sizin yerinize okuyan şey için dizilmiş.',
        back: 'İLK SAYFAYA DÖN',
    },

    hero: {
        kicker: 'NOTLAR VE GÖRÜŞLER',
        titleLead: 'Seyir',
        titleAccent: 'Defteri',
        standfirst:
            '.NET ve React ile canlıda çalışan yazılım yazarken ve işletirken tuttuğum notlar. Sorgu optimizasyonu, deploy, masaüstü ajan ve ==çalışmaya başlamadan önce bozulan kısımlar==.',
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
            'Tasarladığım, yazdığım ve hâlâ işlettiğim sistemler. .NET ve PostgreSQL üzerinde çalışan canlı bir SaaS CRM, çok kiracılı bir hosting platformu ve 15 milisaniyede cevap veren ==1,79 milyon satırlık firma kataloğu==.',
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
        requestPortfolio: 'TAM TEKNİK PORTFÖYÜ İSTE',
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
            'İstanbul’da tam zamanlı pozisyonlara (ofis, hibrit veya uzaktan) ve proje bazlı işlere açığım.',
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
        help: 'Kullanılabilir komutlar: [help, whoami, skills, projects, ai, sound, snake, 2048, mines, clear, exit]',
        whoami: 'Emirhan Güven - Full Stack Geliştirici, .NET ve React. 2018’den beri profesyonel olarak yazılım yazıyorum. Şu anda canlıda çalışan SaaS CRM’im CRMSolid’i geliştirip işletiyorum: deploy edilmiş 5 servis, PostgreSQL, 516 NUnit testi, Linux sunucuda Docker.',
        skills: 'Backend: [C#, .NET 8/9, ASP.NET Core, EF Core, Python, PHP] | Frontend: [React, Next.js, TypeScript, Tailwind, Blazor] | Veritabanı: [PostgreSQL, DuckDB, Redis, MySQL] | Masaüstü: [Photino.NET, Electron] | DevOps: [Docker, Traefik, GitHub Actions, Nginx, Linux] | Yapay zekâ: [Anthropic API, OpenAI API, MCP]',
        projects: '/projects sayfasına yönlendirme yakında... (Üstteki menüyü kullanın)',
        ai: 'Bu sitenin makine okuyucular için yazılmış bir baskısı var: /ai . Düz metin kopyası: /llms.txt',
        soundHintOff: 'Ses kapalı. Açmak için ‘sound’ yazın.',
        soundHintOn: 'Ses açık. Kapatmak için ‘sound’ yazın.',
        soundOn: 'Ses açıldı. Tuşlar, /ai sayfasındaki teleks ve üç oyun artık ses çıkarıyor. Başka hiçbir yerde ses yok.',
        soundOff: 'Ses kapatıldı. Ofis yine sessiz.',
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
            'Emirhan Güven, İstanbul’da full stack geliştirici. .NET ve React ile canlıda çalışan sistemler kurup işletiyorum; bunlardan biri de tek başıma yazdığım ve hâlâ işlettiğim canlı SaaS CRM CRMSolid.',
        articlesTitle: 'Seyir Defteri | Emirhan Güven',
        articlesDesc:
            '.NET ve React ile canlıda çalışan yazılım yazarken ve işletirken tuttuğum notlar: sorgu optimizasyonu, deploy, masaüstü ajan ve çalışmaya başlamadan önce bozulan kısımlar.',
        contactTitle: 'İletişim | Emirhan Güven',
        contactDesc:
            'İstanbul’da full stack geliştirici Emirhan Güven ile iletişime geçin. Ofis, hibrit veya uzaktan tam zamanlı pozisyonlara ve proje bazlı işlere açığım.',
        notFoundTitle: 'Sayfa Bulunamadı | Emirhan Güven',
        notFoundDesc:
            'Bu adres sitenin bir parçası değil. Projelere, seyir defterine, makine baskısına ve iletişim sayfasına giden bağlantılar burada.',
    },

    desk: {
        title: 'YAZI İŞLERİ',
        subtitle: 'KLAVYE',
        goHead: 'GİT',
        pageHead: 'SAYFADA',
        then: 'sonra',
        goProjects: 'Yaptığım İşler',
        goLog: 'Seyir Defteri',
        goContact: 'İletişim',
        goMachine: 'Makine Baskısı',
        console: 'Konsolu aç',
        edition: 'Son baskıyı aç ve kapat',
        print: 'Sayfayı gazete formunda yazdır',
        card: 'Bu kartı aç ve kapat',
        dismiss: 'Kapat',
        close: 'Klavye kartını kapat',
        note: 'Gerisi konsolda duruyor. t ile açın, sonra help yazın.',
        hint: 'Klavye kartı için sayfanın herhangi bir yerinde ? tuşuna basın.',
    },

    /* Türk gazeteleri yazıyı sütun santimiyle ölçer, İngilizler sütun inciyle.
       wordsPerUnit, bir sütun santimini dolduran kelime sayısı. */
    castOff: {
        label: 'DİZGİ HESABI',
        words: 'KELİME',
        unit: 'SÜTUN SANTİMİ',
        wordsPerUnit: 14,
    },

    endMark: {
        reveal: '-30- ne demek',
        note: 'Telgraf hattından kalma bitiş işareti. Muhabir son satırın altına yazardı, masa da haberin bittiğini böyle anlardı.',
    },

    stand: {
        away: 'Baskı bayide bekliyor',
    },
};
