# Imagem do Grafana do Família Connect: Grafana OSS + plugin Infinity + provisionamento e dashboards embutidos.
# Contexto de build: a própria pasta grafana/  (docker build -t familia-connect-grafana ./grafana)
ARG GRAFANA_VERSION=12.3.3
FROM grafana/grafana-oss:${GRAFANA_VERSION}

# Vazio = última versão do plugin. Informe (ex.: 3.4.1) para fixar.
ARG INFINITY_PLUGIN_VERSION=""

USER root

# O plugin fica fora de /var/lib/grafana para não ser escondido pelo volume "grafana-data" do docker-compose.
ENV GF_PATHS_PLUGINS=/usr/share/grafana-plugins
RUN mkdir -p "${GF_PATHS_PLUGINS}" \
 && grafana cli --pluginsDir "${GF_PATHS_PLUGINS}" plugins install yesoreyeram-infinity-datasource ${INFINITY_PLUGIN_VERSION} \
 && chown -R 472:0 "${GF_PATHS_PLUGINS}"

# Datasource (usa GRAFANA_API_TOKEN e GRAFANA_BACKEND_URL em runtime) e dashboards.
COPY --chown=472:0 provisioning /etc/grafana/provisioning
COPY --chown=472:0 dashboards   /etc/grafana/dashboards

USER 472
