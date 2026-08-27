# eguven.dev Deploy

Site tek container: Express hem `dist/` statiklerini hem `/api` rotalarini
**ayni porttan (8080)** serve ediyor. Frontend relative `/api` cagirdigi icin
same-origin. CORS ayari, ikinci container, path routing gerekmiyor.

Yerelde dogrulandi: imaj kuruluyor, container 8080'de dinliyor, `/`, `/contact`,
`/articles`, `/api/posts` ve statik asset'ler 200 donuyor, `.env` imaja girmiyor.

---

## Neden ayri compose dosyasi

`docker-compose.eguven.yml` **ayri bir compose projesi**. Production
`/root/docker-compose.yml` dosyasina dokunmaz. Traefik zaten Docker socket'ini
dinledigi icin bu container'i label'larindan otomatik alir.

Kazanc: bu servis coksede, build'i bozulsa da **crmsolid yigini etkilenmez**.

---

## 1. DNS (once bu: domain cozulmeden sitede is yok)

Su an `eguven.dev` **SERVFAIL** donuyor (NXDOMAIN degil). Yani domain kayitli ve
delege edilmis, ama atandigi nameserver'lar cevap vermiyor.

```
eguven.dev   NS/A/SOA  ->  Status=2 SERVFAIL
crmsolid.com A         ->  Status=0  188.114.97.7  (Cloudflare)
```

Onerilen: Yoncu panelinden nameserver'lari **Cloudflare**'e cevir (ucretsiz,
crmsolid.com zaten orada). Sonra Cloudflare'de:

| Tip | Ad          | Deger            | Proxy |
|-----|-------------|------------------|-------|
| A   | `eguven.dev`| `46.225.21.115`  | **gri (DNS only)** |
| A   | `www`       | `46.225.21.115`  | **gri (DNS only)** |

> Ilk sertifika cikarken **gri bulut** sart, Let's Encrypt HTTP-01 challenge
> temiz gecsin. Sertifika geldikten sonra turuncuya cevirebilirsin, ama SSL
> modunu **Full (strict)** yap. "Flexible" birakirsan yonlendirme dongusune girer.

Dogrula (yayilma birkac dakika surebilir):
```bash
dig +short eguven.dev            # 46.225.21.115 donmeli
```

---

## 2. Sunucuya kodu al

```bash
ssh root@46.225.21.115
git clone <repo-url> /root/eguven-dev
cd /root/eguven-dev
```

---

## 3. Sirlari sunucuya yaz (repoya DEGIL)

```bash
cp /root/eguven-dev/eguven-secrets.env.example /root/eguven-secrets.env
nano /root/eguven-secrets.env      # SMTP + Turnstile degerlerini gir
chmod 600 /root/eguven-secrets.env
```

> **PORT yazma.** `env_file`, Dockerfile'daki `ENV PORT=8080`'i ezer. Port
> degisirse Traefik'in `loadbalancer.server.port=8080` hedefi tutmaz -> 502.

---

## 4. Traefik agi (dogrulandi)

Sunucuda kontrol edildi: ag adi duz **`web`** (compose'un uretecegi `root_web`
degil) ve `traefik` container'i bu aga bagli. `docker-compose.eguven.yml` bunu
`external: true, name: web` olarak kullaniyor, ekstra ayar gerekmiyor.

Teyit icin:
```bash
docker network ls | grep web
docker inspect traefik --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}'
```

## 5. Ayaga kaldir

```bash
cd /root/eguven-dev
docker compose -f docker-compose.eguven.yml up -d --build
```

Production yigini calisirken bu komut ona **dokunmaz**: ayri proje, ayri
container, ayri volume.

---

## 6. Dogrula

```bash
docker compose -f docker-compose.eguven.yml logs -f eguven   # "Server is running on port 8080"
docker ps --filter name=eguven

curl -I https://eguven.dev                 # 200 + gecerli sertifika
curl -I http://eguven.dev                  # 301 -> https
curl -s https://eguven.dev/api/posts       # []
curl -I https://eguven.dev/contact         # 200 (SPA fallback)
```

Sertifika birkac saniye gecikebilir. Gelmezse:
```bash
docker logs traefik --tail 50 | grep -i acme
```

Production'in hala saglam oldugunu da teyit et:
```bash
curl -I https://crmsolid.com https://app.crmsolid.com https://api.crmsolid.com
```

---

## 7. Geri alma

Tek komut, production'a sifir etki:
```bash
docker compose -f docker-compose.eguven.yml down
```
Blog verisini de silmek icin `down -v` (volume gider, dikkat).

---

## Guncelleme

```bash
cd /root/eguven-dev && git pull
docker compose -f docker-compose.eguven.yml up -d --build
```

---

## Notlar

- **Blog verisi** `eguven_data` volume'unda (`/app/server/data/posts.db`).
  Volume olmadan her deploy'da sifirlanir. Su an blog bos (`/api/posts` -> `[]`).
- **Imaj 413MB.** `react`, `framer-motion`, `lucide-react` gibi paketler sadece
  build'de gerekli ama `dependencies` altinda oldugu icin runtime imajina da
  giriyor. Onlari `devDependencies`'e tasirsan imaj ~180MB'a duser. Zorunlu degil.
- **Ayni kutu.** Portfoy, prod SaaS ile ayni Docker host'unu paylasiyor. Kucuk
  bir site icin risk dusuk; ayirmak istersen ikinci bir VPS de olur.
