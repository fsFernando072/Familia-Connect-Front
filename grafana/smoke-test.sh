#!/usr/bin/env bash
# Sobe a imagem do Grafana e confere saúde, plugin, datasource e dashboards.
# Uso: ./grafana/smoke-test.sh familia-connect-grafana:test
set -euo pipefail

IMAGE="${1:?Informe a imagem. Ex.: ./smoke-test.sh familia-connect-grafana:test}"
DIR="$(cd "$(dirname "$0")" && pwd)"
API=http://localhost:3000/grafana/api
AUTH="-u admin:admin"

trap 'docker logs grafana-test 2>&1 | tail -50 || true; docker rm -f grafana-test >/dev/null 2>&1 || true' EXIT

# Mesma configuração do docker-compose.yml
docker run -d --name grafana-test -p 3000:3000 \
  -e GF_SERVER_ROOT_URL=http://localhost:3000/grafana/ \
  -e GF_SERVER_SERVE_FROM_SUB_PATH=true \
  -e GF_SECURITY_ADMIN_USER=admin \
  -e GF_SECURITY_ADMIN_PASSWORD=admin \
  -e GF_AUTH_ANONYMOUS_ENABLED=true \
  -e GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer \
  -e GRAFANA_API_TOKEN=token-de-teste \
  -e GRAFANA_BACKEND_URL=http://host.docker.internal:8080 \
  "$IMAGE" >/dev/null

echo "-> Aguardando o Grafana ficar saudável"
for i in $(seq 1 45); do
  curl -fsS $API/health 2>/dev/null | jq -e '.database == "ok"' >/dev/null 2>&1 && break
  [ "$i" = 45 ] && { echo "Grafana não ficou saudável a tempo"; exit 1; }
  sleep 2
done

echo "-> Plugin Infinity"
curl -fsS $AUTH $API/plugins/yesoreyeram-infinity-datasource/settings | jq -e '.id' >/dev/null

echo "-> Datasource"
curl -fsS $AUTH $API/datasources/uid/familia-connect-api | jq -e '.type == "yesoreyeram-infinity-datasource"' >/dev/null

echo "-> Dashboards"
for f in "$DIR"/dashboards/*.json; do
  uid=$(jq -r '.uid' "$f")
  for i in $(seq 1 30); do
    curl -fsS $AUTH $API/dashboards/uid/"$uid" >/dev/null 2>&1 && { echo "OK  $uid"; continue 2; }
    sleep 2
  done
  echo "Dashboard '$uid' não foi carregado"; exit 1
done

echo "-> Acesso anônimo (como no iframe do front)"
curl -fsS $API/dashboards/uid/familia-connect >/dev/null

echo "Tudo certo."