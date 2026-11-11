from playwright.sync_api import sync_playwright, expect
import os
import traceback

URL_BASE = os.getenv('URL_BASE', 'http://localhost:5173').rstrip('/')
CPF = os.getenv('TESTE_CPF', '')
SENHA = os.getenv('TESTE_SENHA', '')


def testar_login(pagina):
    print('Testando tela de login...')

    pagina.goto(URL_BASE + '/', wait_until='domcontentloaded', timeout=60000)

    expect(pagina.get_by_role('heading', name='Bem-vindo ao CIFA.')).to_be_visible()

    campo_cpf = pagina.get_by_placeholder('000.000.000-00')

    campo_senha = pagina.get_by_placeholder('********')

    botao_entrar = pagina.get_by_role('button', name='Entrar')

    expect(campo_cpf).to_be_visible()

    expect(campo_senha).to_be_visible()

    expect(botao_entrar).to_be_enabled()

    botao_entrar.click()

    expect(pagina.get_by_text('Bem-vindo ao CIFA.')).to_be_visible()

    expect(pagina).to_have_url(URL_BASE + '/')

    campo_cpf.fill(CPF)

    campo_senha.fill(SENHA)

    botao_entrar.click()

    expect(pagina).to_have_url(URL_BASE + '/pagina-inicial', timeout=20000)

    print('Login: OK')


def testar_pagina_inicial(pagina):
    print('\nTestando página inicial...')

    expect(pagina).to_have_url(URL_BASE + '/pagina-inicial')

    expect(pagina.get_by_text('Página inicial', exact=True).first).to_be_visible()

    expect(pagina.get_by_role('heading', name='Bem-vindo ao CIFA.')).to_be_visible()

    botao_familias = pagina.get_by_role('link', name='Ver famílias', exact=True)

    expect(botao_familias).to_be_visible()

    expect(botao_familias).to_be_enabled()

    botao_familias.click()

    expect(pagina).to_have_url(URL_BASE + '/familias', timeout=15000)

    print('Botão de ver familias OK')

    pagina.goto(URL_BASE + '/pagina-inicial')

    botao_historico = pagina.get_by_role('main').get_by_role('link', name='Histórico de Entregas', exact=True)

    expect(botao_historico).to_be_visible()

    expect(botao_historico).to_be_enabled()
    
    botao_historico.click()

    expect(pagina).to_have_url(URL_BASE + '/historico-entrega', timeout=15000)

    print('Botão de historico de entregas OK')
    
    pagina.goto(URL_BASE + '/pagina-inicial')

    expect(pagina.get_by_role('heading', name='Acesso rápido')).to_be_visible()

    expect(pagina.get_by_text('Áreas do sistema')).to_be_visible()

    print('Elementos da página inicial: OK')

    botoes = [
    'Famílias',
    'Entregas',
    'Produtos',
    'Funcionários',
    'Cargos',
    'Categorias',
    'Histórico de Estoque',
    'Histórico de Entregas',
    'Dashboard'
    ]

    print('Iniciando teste de navegação da pagina inicial...')

    for nome in botoes:

        pagina.goto(URL_BASE + '/pagina-inicial')

        botao = pagina.locator('a.group').filter(has=pagina.get_by_text(nome, exact=True))
        
        expect(botao).to_be_visible()

        destino = botao.get_attribute('href')

        botao.click()

        expect(pagina).to_have_url(URL_BASE + destino, timeout=15000)

        print(f'[OK] Botão {nome}: navegação funcionando!')

    print('Teste da página inicial concluído!')

    print('\nIniciando teste de navegação do menu lateral...')

    for nome in botoes:
        pagina.goto(URL_BASE + '/pagina-inicial')

        menu = pagina.get_by_role('complementary', name='Menu principal')

        botao = menu.get_by_role('link', name=nome, exact=True)

        expect(botao).to_be_visible()

        expect(botao).to_be_enabled()

        destino = botao.get_attribute('href')

        botao.click()

        expect(pagina).to_have_url(URL_BASE + destino, timeout=15000)

        print(f'[OK] Menu {nome}: navegação funcionando!')

    pagina.goto(URL_BASE + '/pagina-inicial')

    menu = pagina.get_by_role('complementary', name='Menu principal')

    botao_sair = menu.get_by_role('button', name='Sair', exact=True)

    expect(botao_sair).to_be_visible()

    expect(botao_sair).to_be_enabled()

    botao_sair.click()

    expect(pagina).to_have_url(URL_BASE + '/', timeout=15000)

    print(f'[OK] Menu Sair: navegação funcionando!')
    print('\nTeste do menu lateral concluído!')

with sync_playwright() as p:
    navegador = p.firefox.launch(headless=False)

    pagina = navegador.new_page(viewport={'width': 1300, 'height': 900})

    try:
        testar_login(pagina)

        testar_pagina_inicial(pagina)

        print('Todos os testes passaram!')

    except Exception as erro:
        print(f'Teste falhou: {erro}')

    finally:
        navegador.close()
