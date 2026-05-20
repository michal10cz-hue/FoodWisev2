# Cloudflare Tunnel - konfiguracja

W repozytorium s\u0105 obs\u0142ugiwane dwa tryby uruchomienia tunelu.

## 1. Named tunnel (produkcyjny, w\u0142asna domena)

Najprostszy wariant - **token connector**. Nie potrzebujesz tu plik\u00f3w
`config.yml` ani `*.json` z poziomu repo, ca\u0142o\u015b\u0107 routingu konfigurujesz
w panelu Cloudflare Zero Trust.

1. Zaloguj si\u0119 do <https://one.dash.cloudflare.com>
2. `Networks` -> `Tunnels` -> `Create a tunnel` -> `Cloudflared`
3. Nadaj nazw\u0119 (np. `foodwise`), zapisz.
4. W kroku **Install and run a connector** Cloudflare poka\u017ce komend\u0119
   `docker run cloudflare/cloudflared ... --token eyJhI...`. Skopiuj sam
   token i wklej do `.env`:

   ```env
   CLOUDFLARED_TOKEN=eyJhI...
   ```

5. Przejd\u017a do zak\u0142adki **Public Hostnames** i dodaj wpisy:

   | Subdomain | Domain            | Service               |
   |-----------|-------------------|-----------------------|
   | `app`     | `twoja-domena.pl` | `http://client:8080`  |
   | `api`     | `twoja-domena.pl` | `http://server:8080`  |

   Adresy `client` i `server` to nazwy serwis\u00f3w z `docker-compose.yml`
   (sie\u0107 `foodwise-net`).

6. Uruchom stack:

   ```bash
   ./start.sh prod
   ```

## 2. Quick tunnel (test, losowy URL `*.trycloudflare.com`)

Nie wymaga konta ani konfiguracji DNS. Idealny do szybkiego pokazania
prototypu.

```bash
./start.sh quick
docker logs -f foodwise-cloudflared-quick   # podejrzyj wygenerowany URL
```

## Diagnostyka

- Logi tunelu: `docker logs -f foodwise-cloudflared`
- Metryki tunelu: `docker exec foodwise-cloudflared wget -qO- http://127.0.0.1:2000/metrics | head`
- Health klienta: `curl http://localhost:3000/healthz`
- Health backendu: `curl http://localhost:5166/weatherforecast`
