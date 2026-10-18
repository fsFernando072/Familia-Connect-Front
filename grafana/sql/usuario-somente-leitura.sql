-- Usuário de leitura usado pelo Grafana. Rode no MySQL do Família Connect como administrador.
-- Troque NOME_DO_BANCO (o mesmo do DB_URL do back) e a senha antes de executar.
--
-- O acesso é restrito às colunas que os painéis usam: o Grafana NÃO enxerga CPF, RG, telefone,
-- nome das pessoas atendidas nem as senhas dos funcionários.

CREATE USER 'grafana_ro'@'%' IDENTIFIED BY 'TROQUE_ESTA_SENHA';

GRANT SELECT (id, data_cadastro, possui_prioridade, endereco_id)                 ON NOME_DO_BANCO.familia           TO 'grafana_ro'@'%';
GRANT SELECT (id, familia_id, dt_nascimento, is_responsavel, sexo, profissao_id) ON NOME_DO_BANCO.pessoa            TO 'grafana_ro'@'%';
GRANT SELECT (id, bairro)                                                        ON NOME_DO_BANCO.endereco          TO 'grafana_ro'@'%';
GRANT SELECT (id, data_entrega, funcionario_id, pessoa_id, produto_id)           ON NOME_DO_BANCO.entrega           TO 'grafana_ro'@'%';
GRANT SELECT (id, quantidade, data_estoque, produto_id)                          ON NOME_DO_BANCO.historico_estoque TO 'grafana_ro'@'%';
GRANT SELECT (id, nome, ativo, categoria_id)                                     ON NOME_DO_BANCO.produto           TO 'grafana_ro'@'%';
GRANT SELECT (id, nome)                                                          ON NOME_DO_BANCO.categoria         TO 'grafana_ro'@'%';
GRANT SELECT (id, nome)                                                          ON NOME_DO_BANCO.funcionario       TO 'grafana_ro'@'%';
GRANT SELECT (id, nome)                                                          ON NOME_DO_BANCO.profissao         TO 'grafana_ro'@'%';

FLUSH PRIVILEGES;
