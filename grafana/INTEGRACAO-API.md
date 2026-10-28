# Integração Grafana → API → MySQL

O Grafana usa o plugin Infinity (backend parser), não possui credenciais de banco. Cada painel usa uma consulta SQL fixa no `GrafanaMetricasController`, executada pelo Spring Boot usando o datasource da aplicação.

1. Configure `GRAFANA_API_TOKEN` com o **mesmo valor secreto** no backend e no serviço Grafana. Nunca coloque esse token em `VITE_*` ou no navegador.
2. Inicie o backend com acesso ao MySQL; o endereço da API nos targets está definido como `http://host.docker.internal:8080`; altere-o no JSON se o backend estiver em outro host.
3. `docker compose up -d` no frontend. O container Grafana instala o plugin Infinity; é necessário acesso à internet no primeiro início.
4. Acesse `http://localhost/dashboard` (Nginx). Para usar `http://localhost:5173/dashboard`, rode o Vite e disponibilize o Grafana em `localhost:3000` apenas no ambiente de desenvolvimento; defina `GRAFANA_DEV_URL` se necessário.
5. Em desenvolvimento, o Grafana precisa servir o subpath `/grafana/` com `GF_SERVER_ROOT_URL=http://localhost:5173/grafana/` quando acessado via Vite; para a porta 80 use `http://localhost/grafana/`. Uma instância Grafana pode exigir URLs diferentes para cada ambiente.

**Atenção:** o backend usa JWT stateless. O proxy Nginx anterior faz `auth_request` para `/api/funcionarios/me`, mas esse mecanismo depende de como o token JWT é transportado e pode não autenticar corretamente. Valide a proteção do iframe antes de expor em produção. O Grafana anônimo não deve ser exposto publicamente. O token protege apenas a API de métricas, não a interface Grafana.

O plugin Infinity pode exigir ajuste do mapeamento de campos por painel, sobretudo os painéis `timeseries`. As consultas e estruturas foram migradas, mas não validadas em um Grafana real.

## Autenticação automática (sem solicitar token ao usuário)

- O usuário entra apenas no Família Connect. O iframe do Grafana está configurado para Viewer anônimo, portanto não apresenta login próprio.
- O Grafana envia `X-Grafana-Token` **automaticamente no servidor** via `secureJsonData` do datasource Infinity. O segredo nunca é enviado pelo React.
- Defina o mesmo `GRAFANA_API_TOKEN` no processo do Spring Boot e no `.env` do Compose do frontend. Não use prefixo `VITE_` nesse segredo.
- Todas as consultas são executadas no Spring Boot por `JdbcTemplate` com SQL fixo e dados reais do MySQL.
- Para acessar o frontend Vite na porta 5173, execute também o Compose do frontend na porta 80: o Vite encaminha `/grafana` para `http://localhost:80` por padrão. Assim ambas as portas utilizam o mesmo Grafana e a mesma URL relativa.
- **Segurança:** o `auth_request` do Nginx original usa `/api/funcionarios/me` e precisa ser validado com a autenticação JWT do projeto. Um iframe não envia automaticamente o JWT guardado em localStorage. Não publique o Grafana anônimo na internet sem um gateway de autenticação compatível com a sessão do frontend.
- O plugin Infinity e a renderização de painéis precisam ser testados com Grafana real; não foram usados mocks.
