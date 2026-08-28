/* ---------------------------------------------------------------------------
 *  UI dictionary, English. The reference edition.
 *
 *  This file holds SHORT interface copy only: navigation, buttons, form
 *  labels, empty states, the games, the terminal. Long form page copy lives in
 *  src/content/*, because a four thousand word case study inside a UI
 *  dictionary is a file nobody can maintain.
 *
 *  The shape of this object IS the contract: `Dictionary` is derived from it
 *  and src/i18n/tr.ts is typed against that, so a key missing from Turkish is
 *  a compile error rather than an English word leaking onto a Turkish page.
 *
 *  Casing rule: any string that lands inside a container with
 *  `text-transform: uppercase` is stored ALREADY uppercased, in both files.
 *  Uppercasing an uppercase string is a no-op, so Turkish dotted capitals
 *  never depend on the browser applying Turkish casing rules.
 * ------------------------------------------------------------------------- */

export const en = {
    /* ---- chrome ---------------------------------------------------------- */
    nav: {
        home: 'Home',
        projects: 'PROJECTS',
        articles: 'ARTICLES',
        contact: 'CONTACT',
        sectionIndex: 'SECTION INDEX',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        github: 'GITHUB',
        linkedin: 'LINKEDIN',
    },

    lang: {
        /* Reads as the action, in the language currently on screen. */
        switchTo: 'Switch to Turkish',
        title: 'Türkçe',
    },

    rail: {
        scroll: 'SCROLL',
        connect: 'CONNECT',
        openTerminal: 'Open Terminal',
    },

    machineBar: {
        region: 'Notice to machine readers',
        badge: 'WIRE',
        pitchLong: 'ARE YOU AN AI? THERE IS AN EDITION SET FOR YOU.',
        pitchShort: 'AI READER?',
        linkLong: 'READ THE MACHINE EDITION',
        linkShort: 'MACHINE EDITION',
        dismiss: 'Dismiss notice',
    },

    footer: {
        bio: 'Full stack developer in Istanbul. I build and run production systems on .NET and React, from database design to deployment.',
        navigation: 'NAVIGATION',
        linkProjects: 'Projects',
        linkArticles: 'Articles',
        linkContact: 'Contact',
        linkMachine: 'Machine Edition',
        emailAria: 'Email',
        localTime: 'LOCAL TIME',
        available: 'Available for new projects',
        top: 'TOP',
        rights: '© 2026 EMIRHAN GÜVEN. ALL RIGHTS RESERVED.',
        madeIn: 'DESIGNED & BUILT IN ISTANBUL',
        /* Feeds toLocaleTimeString for the footer clock. */
        locale: 'en-US',
    },

    nothingHere: 'THERE IS NOTHING HERE',

    /* ---- articles ( /articles ) ------------------------------------------ */
    hero: {
        kicker: 'INSIGHTS & THOUGHTS',
        titleLead: 'The',
        titleAccent: 'Log',
        standfirst:
            'Notes from building and running production software on .NET and React. Query tuning, deployment, the desktop agent, and ==the parts that broke before they worked==.',
    },

    sidebar: {
        topics: 'TOPICS',
        topicAll: 'All Posts',
        topicBackend: 'Backend Engineering',
        topicFrontend: 'Frontend Performance',
        topicAi: 'Artificial Intelligence',
        topicDevops: 'DevOps',
        subscribe: 'SUBSCRIBE',
        subscribeCopy: 'Get the latest articles delivered directly to your inbox once a month.',
        emailLabel: 'Email address',
        emailPlaceholder: 'Email Address',
        subscribeCta: 'SUBSCRIBE',
    },

    articles: {
        empty: 'REGISTRY EMPTY',
        emptyCopy: 'No technical articles have been indexed yet.',
        loadOlder: 'LOAD OLDER POSTS',
        readArticle: 'READ ARTICLE',
    },

    /* ---- projects ( / ) -------------------------------------------------- */
    projects: {
        kicker: 'SYSTEMS IN PRODUCTION',
        titleLead: 'The',
        titleAccent: 'Works',
        standfirst:
            'Systems I designed, wrote and still run. A live SaaS CRM on .NET and PostgreSQL, a multi-tenant hosting platform, and ==a 1.79 million row business catalog== that answers in 15 milliseconds.',
        sortedBy: 'SORTED BY: IMPACT',
        totalLabel: 'TOTAL:',
        totalUnit: 'SYSTEMS',
        filterAll: 'ALL',
        filterInfrastructure: 'INFRASTRUCTURE',
        filterBackend: 'BACKEND',
        filterPlatform: 'PLATFORM',
        filterAi: 'ARTIFICIAL INTELLIGENCE',
        colSystem: 'PROJECT SYSTEM',
        colStack: 'STACK',
        colImpact: 'KEY IMPACT & TECHNICAL OUTCOME',
        colDeployment: 'DEPLOYMENT',
        readCase: 'Read the case study',
        liveSite: 'Live site',
        repository: 'GitHub repository',
        requestPortfolio: 'REQUEST FULL TECHNICAL PORTFOLIO',
    },

    /* ---- contact ( /contact ) -------------------------------------------- */
    contact: {
        kicker: 'AVAILABILITY: OPEN FOR INQUIRY',
        titleLead: 'Let’s',
        titleAccent: 'Connect.',
        sendDirect: 'SEND A DIRECT MESSAGE',
        formKicker: 'INQUIRY',
        formTitleOutline: 'The',
        formTitleSolid: 'Contact',
        nameLabel: 'YOUR NAME',
        namePlaceholder: 'John Doe',
        emailLabel: 'EMAIL ADDRESS',
        emailPlaceholder: 'john@company.com',
        messageLabel: 'MESSAGE',
        messagePlaceholder: 'Describe your project or vision...',
        sending: 'SENDING...',
        sent: 'SENT!',
        send: 'SEND MESSAGE',
        back: 'BACK',
        channels: 'INQUIRIES',
        availability:
            'Open to full time roles in Istanbul, on site, hybrid or remote, and to contract work.',
        bookCall: 'BOOK A CALL',
    },

    /* ---- terminal -------------------------------------------------------- */
    terminal: {
        console: 'SYSTEM CONSOLE v1.0.4',
        dockBottom: 'Dock to Bottom',
        makeFloating: 'Make Floating',
        close: 'Close terminal',
        welcome:
            'Welcome to the interactive portfolio terminal. Type ‘help’ to see available commands.',
        notFoundPrefix: 'Command not found:',
        notFoundSuffix: 'Type ‘help’ for available commands.',
        help: 'Available commands: [help, whoami, skills, projects, ai, snake, 2048, mines, clear, exit]',
        whoami: 'Emirhan Güven - Full Stack Developer, .NET and React. Writing software professionally since 2018. Currently building and running CRMSolid, a live SaaS CRM: 5 deployed services, PostgreSQL, 516 NUnit tests, Docker on a Linux server.',
        skills: 'Backend: [C#, .NET 8/9, ASP.NET Core, EF Core, Python, PHP] | Frontend: [React, Next.js, TypeScript, Tailwind, Blazor] | Database: [PostgreSQL, DuckDB, Redis, MySQL] | Desktop: [Photino.NET, Electron] | DevOps: [Docker, Traefik, GitHub Actions, Nginx, Linux] | AI: [Anthropic API, OpenAI API, MCP]',
        projects: 'Directing to /projects page soon... (Check the navigation bar)',
        ai: 'There is an edition of this site written for machine readers: /ai . Plain text copy: /llms.txt',
        snake: 'Initializing SNAKE_PROTOCOL...',
        g2048: 'Initializing PROTOCOL_2048...',
        mines: 'Initializing MINES_SCAN_PROTOCOL...',
    },

    /* ---- games ( every string here is displayed uppercase ) --------------- */
    games: {
        score: 'SCORE',
        exit: 'EXIT',
        snakeOver: 'CONNECTION LOST: GAME OVER',
        snakeFinal: 'FINAL SCORE:',
        snakeRestart: 'RESTART',
        snakePaused: 'PROTOCOL PAUSED - PRESS ‘P’ TO RESUME',
        snakeMove: 'ARROWS TO MOVE',
        snakePause: '‘P’ TO PAUSE',
        snakeExit: '‘ESC’ TO EXIT',
        g2048Over: 'MEMORY OVERFLOW: GAME OVER',
        g2048Harvested: 'DATA HARVESTED:',
        g2048Restart: 'RE-INIT',
        g2048Move: 'NAVIGATE WITH ARROWS',
        g2048Exit: '‘ESC’ TO BREAK',
        g2048Goal: 'REACH 2048',
        minesLabel: 'MINES',
        minesLost: 'SCAN FAILED: MINE DETONATED',
        minesWon: 'SECTOR SECURED: SCAN COMPLETE',
        minesRestart: 'RESTART SCAN',
        minesAbort: 'ABORT',
        minesFlagMode: 'FLAG MODE',
        minesDigMode: 'DIG MODE',
        minesReveal: 'L-CLICK: REVEAL',
        minesFlag: 'R-CLICK: FLAG',
        minesExit: '‘ESC’ TO ABORT',
    },

    /* ---- document head, per route ---------------------------------------- */
    meta: {
        homeTitle: 'Emirhan Güven | Full Stack Developer, .NET and React',
        homeDesc:
            'Emirhan Güven, full stack developer in Istanbul. I build and run production systems on .NET and React, including CRMSolid, a live SaaS CRM I wrote and still operate on my own.',
        articlesTitle: 'The Log | Emirhan Güven',
        articlesDesc:
            'Notes from building and running production software on .NET and React: query tuning, deployment, the desktop agent, and the parts that broke before they worked.',
        contactTitle: 'Contact | Emirhan Güven',
        contactDesc:
            'Get in touch with Emirhan Güven, full stack developer in Istanbul. Open to full time roles, on site, hybrid or remote, and to contract work.',
    },
};

/* Derived from the English object, with string literals widened, so tr.ts must
   provide exactly these keys and nothing else. */
export type Dictionary = typeof en;
