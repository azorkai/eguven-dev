import type { ProjectKey } from './projects';
import type { ProjectCopy } from './projects.en';

export const projectsTr: Record<ProjectKey, ProjectCopy> = {
    crmsolid: {
        subtitle: 'Çok Kiracılı SaaS CRM, Canlıda',
        impact:
            "Canlıda çalışan bir SaaS CRM’i tek başıma yazdım, hâlâ ben işletiyorum. <span class='ink-strong'>Ayrı ayrı deploy edilen 5 servis</span> hâlinde yayında: REST API, yönetim paneli, masaüstü ajan, sağlık monitörü ve tanıtım sitesi. Mikroservis değil, modüler monolit; arkasında 516 NUnit testi var.",
    },
    neriopanel: {
        subtitle: 'Çok Kiracılı SaaS Platformu',
        impact:
            "Bayiler kendi alan adlarında markalı panel çalıştırabilsin diye white label hosting kurdum. Tek bir paylaşımlı veritabanı, kiracı başına <span class='ink-strong'>row level security</span> ve SSL’i de alan adı yönlendirmesini de kendi halleden bir PowerDNS + Nginx katmanı.",
    },
    evelynn: {
        subtitle: 'Çok Oturumlu Masaüstü Otomasyon Ajanı',
        impact:
            "Tek makinede <span class='ink-strong'>aynı anda 20+ oturumu</span>, bellek kullanımını kontrol altında tutarak çalıştıran çok iş parçacıklı bir çekirdek yazdım. Oturum başına rate limit ve isteklerin zamana yayılması, yükü her servisin ilan ettiği sınırların içinde tutuyor.",
    },
    leadScoring: {
        subtitle: 'Yapay Zekâ ile Lead Niteleme',
        impact:
            "CRM’e düşen mesajları okuyor, niyeti çıkarıyor ve aranmaya değer lead’leri işaretliyor. <span class='ink-strong'>Anthropic ve OpenAI API’leri</span> üzerinde çalışıyor; eskimesin diye hiçbir model sürümünü adıyla sabitlemiyor.",
    },
    commerce: {
        subtitle: 'Yüksek Trafikli Sipariş İşleme',
        impact:
            "Günde yaklaşık <span class='ink-strong'>10.000 API çağrısı</span> alan bir pazarlama ve e-ticaret altyapısı işlettim. Redis sorgu önbelleği ekledim, eksik veritabanı indekslerini tamamladım; sunucu yükü yaklaşık %40 düştü.",
    },
};
