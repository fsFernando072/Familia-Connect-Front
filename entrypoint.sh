#!/bin/sh
set -e

# Gera o env-config.js em runtime para o React.
ENV_CONFIG_PATH=/usr/share/nginx/html/env-config.js
cat <<EOF2 > "$ENV_CONFIG_PATH"
window.__ENV__ = {
  API_BASE_URL: "${API_BASE_URL:-/api}",
  GRAFANA_DASHBOARD_URL: "${GRAFANA_DASHBOARD_URL:-}",
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

# Proxy opcional do Grafana em /grafana/ (mesma origem do Front, o que evita problemas de cookie/iframe).
# Ex.: GRAFANA_URL=http://grafana:3000  (sem barra no final e sem caminho)
# Só responde para quem está logado no sistema: antes de cada requisição o Nginx pergunta ao Backend
# (GET /api/funcionarios/me, com o cookie do usuário) e bloqueia com 401 se não houver sessão válida.
# Sem GRAFANA_URL o arquivo fica vazio e o Nginx simplesmente não expõe /grafana/.
GRAFANA_PROXY_CONF=/etc/nginx/grafana-proxy.conf
if [ -n "${GRAFANA_URL:-}" ]; then
    GRAFANA_UPSTREAM="${GRAFANA_URL%/}"
    cat <<EOF3 > "$GRAFANA_PROXY_CONF"
location = /_auth_grafana {
    internal;
    proxy_pass ${BACKEND_URL%/}/api/funcionarios/me;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Host \$host;
}

location /grafana/ {
    auth_request /_auth_grafana;

    proxy_pass ${GRAFANA_UPSTREAM};
    proxy_http_version 1.1;

    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
}

# Grafana Live (WebSocket)
location /grafana/api/live/ {
    auth_request /_auth_grafana;

    proxy_pass ${GRAFANA_UPSTREAM};
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host \$host;
}
EOF3
else
    : > "$GRAFANA_PROXY_CONF"
fi

exec "$@"
