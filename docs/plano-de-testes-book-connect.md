# Plano de Testes - Book Connect

Disciplina: Teste e Manutencao de Software  
Projeto: Book Connect  
Total planejado: 30 casos de teste  
Categorias: 10 unitarios, 10 funcionais automatizados com Selenium e 10 funcionais manuais com prints

## Testes unitarios

| Caso | Objetivo | Pre-condicao | Procedimento | Dados de entrada | Saida esperada | Saida encontrada | Prioridade | Tecnica |
|---|---|---|---|---|---|---|---|---|
| CTU01 | Validar rotulo de conservacao "Novo". | Dependencias instaladas. | Executar `npm run test:unit -- --runInBand`. | `conservacao = 0` | Retornar `Novo`. | Retornou `Novo`. | Media | Automatizada / Jest |
| CTU02 | Validar conservacao desconhecida. | Dependencias instaladas. | Executar teste da funcao `getConservacaoLabel`. | `conservacao = 99` | Retornar texto vazio. | Retornou texto vazio. | Media | Automatizada / Jest |
| CTU03 | Garantir uso de lista valida da API. | Dependencias instaladas. | Executar teste da funcao `safeArray`. | `[{ id: 1, titulo: "Dom Casmurro" }]` | Retornar o mesmo array. | Retornou o mesmo array. | Alta | Automatizada / Jest |
| CTU04 | Proteger telas contra resposta invalida da API. | Dependencias instaladas. | Executar teste da funcao `safeArray`. | `{ erro: "sem conexao" }` | Retornar `[]`. | Retornou `[]`. | Alta | Automatizada / Jest |
| CTU05 | Validar e-mail correto no login. | Dependencias instaladas. | Executar teste da funcao `isValidLoginEmail`. | `aluno.teste+book@example.com` | Retornar `true`. | Retornou `true`. | Media | Automatizada / Jest |
| CTU06 | Bloquear login sem e-mail e senha. | Dependencias instaladas. | Executar teste da funcao `validateLoginCredentials`. | E-mail vazio e senha vazia. | Retornar erro nos dois campos. | Retornou erro nos dois campos. | Alta | Automatizada / Jest |
| CTU07 | Bloquear senha curta. | Dependencias instaladas. | Executar teste da funcao `validateLoginCredentials`. | E-mail valido e senha `12345`. | Retornar erro de senha. | Retornou erro de senha. | Alta | Automatizada / Jest |
| CTU08 | Converter moeda brasileira para numero. | Dependencias instaladas. | Executar teste da funcao `parseCurrencyValue`. | `R$ 1.250,75` | Retornar `1250.75`. | Retornou `1250.75`. | Media | Automatizada / Jest |
| CTU09 | Formatar data para banco MySQL. | Dependencias instaladas. | Executar teste da funcao `formatDateForMySQL`. | `27/05/2026 09:05:07` | Retornar `2026-05-27 09:05:07`. | Retornou `2026-05-27 09:05:07`. | Media | Automatizada / Jest |
| CTU10 | Validar telefone e e-mail de contato. | Dependencias instaladas. | Executar teste de `formatBrazilianPhone`, `isValidBrazilianCellphone` e `isValidContactEmail`. | `31999998888` e `contato@bookconnect.com` | Telefone formatado e dados validos. | Telefone formatado e dados validos. | Media | Automatizada / Jest |

## Testes funcionais automatizados - Selenium

Comando de execucao: `npm run test:selenium`  
Evidencias geradas: `docs/prints/selenium`

| Caso | Objetivo | Pre-condicao | Procedimento | Dados de entrada | Saida esperada | Saida encontrada | Prioridade | Tecnica |
|---|---|---|---|---|---|---|---|---|
| CTA01 | Validar redirecionamento inicial para login. | Aplicacao iniciada pelo script Selenium. | Acessar `/` e aguardar redirecionamento. | URL raiz. | Navegador abrir `/login`. | Teste passou. | Alta | Selenium |
| CTA02 | Validar login vazio. | Tela de login aberta. | Clicar em `Entrar` sem preencher campos. | E-mail e senha vazios. | Exibir dois erros de obrigatoriedade. | Teste passou. | Alta | Selenium |
| CTA03 | Validar senha curta. | Tela de login aberta. | Informar e-mail valido e senha com 3 caracteres. | `aluno@bookconnect.com`, `123` | Exibir erro de senha. | Teste passou. | Alta | Selenium |
| CTA04 | Validar login com dados aceitos. | Tela de login aberta. | Informar e-mail e senha validos e enviar. | `aluno@bookconnect.com`, `123456` | Redirecionar para `/home`. | Teste passou. | Alta | Selenium |
| CTA05 | Validar busca no menu superior. | Menu superior renderizado. | Acessar cadastro de livro, preencher busca e clicar no icone. | `Clean Code` | URL conter `/home?text=Clean%20Code`. | Teste passou. | Media | Selenium |
| CTA06 | Validar formulario de cadastro de livro. | Aplicacao iniciada. | Acessar `/livros/cadastro` e localizar campos principais. | Sem dados. | Exibir titulo, autor e radios de conservacao. | Teste passou. | Alta | Selenium |
| CTA07 | Validar abertura de endereco na venda online. | Tela de venda aberta. | Selecionar modo de venda `Sim`. | Radio `Sim`. | Abrir modal de endereco. | Teste passou. | Alta | Selenium |
| CTA08 | Validar preenchimento do modal de endereco. | Modal de endereco aberto. | Preencher rua, numero e CEP; fechar modal. | Rua dos Livros, 123, 32000000. | Modal aceitar preenchimento e fechar. | Teste passou. | Media | Selenium |
| CTA09 | Validar cadastro de contato. | Tela de contato aberta. | Informar e-mail invalido e telefone valido. | `email-invalido`, `31999998888` | Exibir erro de e-mail e formatar telefone. | Teste passou. | Media | Selenium |
| CTA10 | Validar listagens sem backend. | Aplicacao iniciada sem depender da API. | Acessar `/livros/vendas` e `/livros/trocas`. | Sem dados de API. | Tabelas renderizarem sem crash. | Teste passou. | Alta | Selenium |

## Testes funcionais manuais

Evidencias geradas: `docs/prints/manuais`

| Caso | Objetivo | Pre-condicao | Procedimento | Dados de entrada | Saida esperada | Saida encontrada | Prioridade | Tecnica |
|---|---|---|---|---|---|---|---|---|
| CTM01 | Conferir tela inicial de login. | Aplicacao em execucao. | Acessar `/login`. | URL `/login`. | Exibir logo, campos e botao Entrar. | Conforme print `CTM01-login-inicial.png`. | Alta | Manual |
| CTM02 | Conferir mensagens de login vazio. | Tela de login aberta. | Clicar em Entrar sem preencher. | Campos vazios. | Exibir erros de e-mail e senha. | Conforme print `CTM02-login-vazio.png`. | Alta | Manual |
| CTM03 | Conferir cadastro de livro vazio. | Aplicacao em execucao. | Acessar `/livros/cadastro`. | URL da tela. | Exibir formulario de livro. | Conforme print `CTM03-cadastro-livro.png`. | Alta | Manual |
| CTM04 | Conferir preenchimento de livro. | Tela de cadastro aberta. | Preencher titulo, autor e sinopse. | Dom Casmurro, Machado de Assis. | Campos aceitarem preenchimento. | Conforme print `CTM04-cadastro-livro-preenchido.png`. | Media | Manual |
| CTM05 | Conferir tela de venda. | Aplicacao em execucao. | Acessar `/livros/vendas/cadastro`. | URL da tela. | Exibir formulario Registrar Venda. | Conforme print `CTM05-cadastro-venda.png`. | Alta | Manual |
| CTM06 | Conferir modal de endereco de venda. | Tela de venda aberta. | Selecionar venda online `Sim`. | Radio `Sim`. | Abrir modal de endereco. | Conforme print `CTM06-modal-endereco-venda.png`. | Alta | Manual |
| CTM07 | Conferir listagem de contatos. | Aplicacao em execucao. | Acessar `/contatos`. | URL da tela. | Exibir tabela de contatos. | Conforme print `CTM07-lista-contatos.png`. | Baixa | Manual |
| CTM08 | Conferir validacao de contato. | Tela de contato aberta. | Informar e-mail invalido e telefone parcial. | `email-invalido`, `31999`. | Exibir mensagens de validacao. | Conforme print `CTM08-cadastro-contato-validacao.png`. | Media | Manual |
| CTM09 | Conferir listagem de vendas. | Aplicacao em execucao. | Acessar `/livros/vendas`. | URL da tela. | Exibir tabela de vendas sem quebrar. | Conforme print `CTM09-lista-vendas.png`. | Alta | Manual |
| CTM10 | Conferir listagem de trocas. | Aplicacao em execucao. | Acessar `/livros/trocas`. | URL da tela. | Exibir tabela de trocas sem quebrar. | Conforme print `CTM10-lista-trocas.png`. | Alta | Manual |
