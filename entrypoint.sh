#!/bin/sh
set -e

# Gera o env-config.js em runtime, a partir da variável de ambiente
# API_BASE_URL do container. Isso permite trocar a URL da API sem
# precisar rebuildar a imagem — basta reiniciar o container com outro
# valor de env var (ex.: em docker-compose.yml ou docker run -e ...).
ENV_CONFIG_PATH=/usr/share/nginx/html/env-config.js

cat <<EOF > "$ENV_CONFIG_PATH"
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-}",
};
EOF

exec "$@"
