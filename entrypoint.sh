#!/bin/sh
set -e

# Gera o env-config.js em runtime para o React.
ENV_CONFIG_PATH=/usr/share/nginx/html/env-config.js
cat <<EOF2 > "$ENV_CONFIG_PATH"
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-/api}",
};
EOF2

# Gera a configuração do Nginx com o endereço do ALB interno do Backend.
# Ex.: BACKEND_URL=http://lb-back-xxxxxxxx.us-east-1.elb.amazonaws.com:8080
if [ -z "${BACKEND_URL:-}" ]; then
    echo "ERRO: BACKEND_URL não foi definido."
    exit 1
fi

export BACKEND_URL
envsubst '${BACKEND_URL}' \
    < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

exec "$@"
