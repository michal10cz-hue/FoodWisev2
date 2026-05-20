# FoodWise

Aplikacja do zarządzania jedzeniem.

## Uruchomienie lokalne (dev)

```bash
# Backend
cd server && dotnet run

# Frontend
cd client && npm start
```

## Uruchomienie przez Docker + Cloudflare Tunnel

Stack składa się z trzech usług:

- `server` – ASP.NET Core API (port wewnętrzny `8080`)
- `client` – React build serwowany przez nginx (port wewnętrzny `8080`),
  proxuje `/api/*` do `server`
- `cloudflared` – tunel Cloudflare wystawiający usługi w internecie bez
  otwierania portów na firewallu

### Wymagania

- Docker Engine 24+ i plugin Compose v2 (`docker compose version`)
- Konto Cloudflare z dodaną domeną (do trybu „named tunnel”)

### Szybki start

```bash
cp .env.example .env
# uzupełnij CLOUDFLARED_TOKEN (instrukcja w cloudflared/README.md)

./start.sh prod      # build + run + tunel
./start.sh logs cloudflared
```

### Tryby `start.sh`

| Komenda            | Opis                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `./start.sh local` | tylko `client` + `server`, bez tunelu (porty z `.env`)              |
| `./start.sh prod`  | `client` + `server` + `cloudflared` (named tunnel, wymaga tokenu)   |
| `./start.sh quick` | `client` + `server` + `cloudflared-quick` – losowy `*.trycloudflare.com` |
| `./start.sh build` | przebudowuje obrazy bez cache                                       |
| `./start.sh down`  | zatrzymuje i usuwa kontenery                                        |
| `./start.sh logs [serwis]` | logi (np. `./start.sh logs server`)                         |
| `./start.sh status`| status kontenerów                                                   |
| `./start.sh url`   | wypisuje publiczny URL z `quick` tunelu                             |

### Cloudflare Tunnel – konfiguracja

Pełna instrukcja w [`cloudflared/README.md`](cloudflared/README.md). W skrócie:

1. <https://one.dash.cloudflare.com> → `Networks` → `Tunnels` → `Create a tunnel` → `Cloudflared`
2. Skopiuj token z polecenia `docker run … --token eyJ…` i wklej do `.env` (`CLOUDFLARED_TOKEN=`)
3. W zakładce **Public Hostnames** dopnij domeny do usług:
   - `app.twoja-domena.pl` → `http://client:8080`
   - `api.twoja-domena.pl` → `http://server:8080` *(opcjonalnie – API i tak jest proxowane przez `/api/` w nginxie)*
4. `./start.sh prod`

### Sprawdzenie zdrowia

```bash
curl http://localhost:3000/healthz          # nginx ok
curl http://localhost:3000/api/weatherforecast  # proxy do API
curl http://localhost:5166/weatherforecast  # API bezpośrednio
```

### Struktura

```
.
├── client/             # React (CRA)
│   ├── Dockerfile      # multi-stage: node build -> nginx
│   └── nginx.conf      # SPA + /api/ proxy
├── server/             # ASP.NET Core (net10.0)
│   └── Dockerfile      # multi-stage: dotnet sdk -> aspnet
├── cloudflared/
│   └── README.md       # instrukcja konfiguracji tunelu
├── docker-compose.yml  # client + server + cloudflared (profile: tunnel / quick)
├── .env.example
└── start.sh            # wrapper na docker compose
```
