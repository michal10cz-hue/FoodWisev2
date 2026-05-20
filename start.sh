#!/usr/bin/env bash
# FoodWise - skrypt uruchomieniowy
# Uzycie:
#   ./start.sh [komenda]
# Komendy:
#   up | prod   - uruchamia client + server + cloudflared (named tunnel, wymaga CLOUDFLARED_TOKEN)
#   quick       - uruchamia client + server + cloudflared-quick (losowy URL trycloudflare.com)
#   local       - tylko client + server, bez tunelu (lokalnie na portach z .env)
#   build       - przebuduwa obrazy bez cache
#   reload [svc]- przebuduwa i restartuje wskazana usluge (domyslnie 'client')
#   down        - zatrzymuje i usuwa kontenery
#   logs [svc]  - logi (domyslnie wszystkie, opcjonalnie nazwa serwisu)
#   status      - status uslug
#   url         - wypisuje URL z quick tunelu (jezeli aktywny)
#   help        - ten ekran

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE="$SCRIPT_DIR/.env"
ENV_EXAMPLE="$SCRIPT_DIR/.env.example"

# --- helpers ---
log()  { printf '\033[1;34m[FoodWise]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[FoodWise]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[1;31m[FoodWise]\033[0m %s\n' "$*" >&2; }

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    err "Nie znaleziono 'docker compose' ani 'docker-compose'. Zainstaluj Docker Engine + Compose plugin."
    exit 1
  fi
}

check_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    err "Brak polecenia 'docker'. Zainstaluj Docker Engine: https://docs.docker.com/engine/install/"
    exit 1
  fi
  if ! docker info >/dev/null 2>&1; then
    err "Demon Docker nie odpowiada (sprobuj 'sudo systemctl start docker' lub dodaj uzytkownika do grupy 'docker')."
    exit 1
  fi
}

ensure_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    if [[ -f "$ENV_EXAMPLE" ]]; then
      cp "$ENV_EXAMPLE" "$ENV_FILE"
      warn "Utworzono $ENV_FILE z .env.example - uzupelnij wartosci (np. CLOUDFLARED_TOKEN)."
    else
      err "Brak $ENV_FILE i $ENV_EXAMPLE - nie mam czego skopiowac."
      exit 1
    fi
  fi
}

require_token() {
  ensure_env
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
  if [[ -z "${CLOUDFLARED_TOKEN:-}" ]]; then
    err "CLOUDFLARED_TOKEN nie jest ustawiony w $ENV_FILE. Skonfiguruj tunel w panelu Cloudflare i wklej token."
    err "Szczegoly: cloudflared/README.md"
    exit 1
  fi
}

# --- komendy ---
cmd_local() {
  check_docker
  ensure_env
  log "Uruchamiam client + server (bez tunelu)..."
  compose up -d --build server client
  log "Gotowe. Client: http://localhost:${CLIENT_HOST_PORT:-3000}  Server: http://localhost:${SERVER_HOST_PORT:-5166}"
}

cmd_prod() {
  check_docker
  require_token
  log "Uruchamiam stack produkcyjny (client + server + cloudflared)..."
  compose --profile tunnel up -d --build
  log "Gotowe. Public hostnames konfiguruj w panelu Cloudflare Zero Trust."
  log "Logi tunelu: ./start.sh logs cloudflared"
}

cmd_quick() {
  check_docker
  ensure_env
  log "Uruchamiam stack z quick-tunelem (losowy URL trycloudflare.com)..."
  compose --profile quick up -d --build
  log "Czekam na URL z cloudflared-quick..."
  sleep 4
  cmd_url || warn "Nie znalazlem URL od razu - sprobuj: ./start.sh url"
}

cmd_url() {
  check_docker
  if docker ps --format '{{.Names}}' | grep -q '^foodwise-cloudflared-quick$'; then
    docker logs foodwise-cloudflared-quick 2>&1 \
      | grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' \
      | tail -1
  else
    err "Quick tunel nie jest uruchomiony. Uzyj: ./start.sh quick"
    return 1
  fi
}

cmd_build() {
  check_docker
  log "Buduje obrazy bez cache..."
  compose build --no-cache
}

cmd_reload() {
  check_docker
  ensure_env
  local svc="${1:-client}"
  log "Przebudowuje i restartuje usluge: $svc"
  compose up -d --build "$svc"
  log "Gotowe. Status:"
  compose ps "$svc"
}

cmd_down() {
  check_docker
  log "Zatrzymuje i usuwam kontenery..."
  compose --profile tunnel --profile quick down --remove-orphans
}

cmd_status() {
  check_docker
  compose ps
}

cmd_logs() {
  check_docker
  if [[ $# -gt 0 ]]; then
    compose logs -f --tail=200 "$@"
  else
    compose logs -f --tail=200
  fi
}

cmd_help() {
  sed -n '2,15p' "$0"
}

# --- dispatcher ---
COMMAND="${1:-help}"
shift || true

case "$COMMAND" in
  up|prod)    cmd_prod "$@" ;;
  quick)      cmd_quick "$@" ;;
  local|dev)  cmd_local "$@" ;;
  build)      cmd_build "$@" ;;
  reload|refresh) cmd_reload "$@" ;;
  down|stop)  cmd_down "$@" ;;
  logs)       cmd_logs "$@" ;;
  status|ps)  cmd_status "$@" ;;
  url)        cmd_url "$@" ;;
  help|-h|--help) cmd_help ;;
  *)
    err "Nieznana komenda: $COMMAND"
    cmd_help
    exit 1
    ;;
esac
