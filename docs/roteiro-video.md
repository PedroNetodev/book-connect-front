# Roteiro para video narrado - ate 10 minutos

## 0:00 a 0:40 - Apresentacao

Apresentar o projeto Book Connect e explicar que o trabalho cobre 30 testes: 10 unitarios, 10 funcionais automatizados com Selenium e 10 funcionais manuais com prints.

## 0:40 a 2:20 - Codigo e refatoracoes

Mostrar rapidamente:

- `src/utils/book.js`
- `src/utils/date.js`
- `src/utils/currency.js`
- `src/utils/loginValidation.js`
- `src/components/BookCard/index.js`
- `src/pages/livros/vendas/cadastro/index.js`

Explicar que duas refatoracoes principais foram feitas: extracao do rotulo de conservacao e extracao de data/valores da venda.

## 2:20 a 3:40 - Testes unitarios

Rodar:

```bash
npm run test:unit -- --runInBand
```

Mostrar que os 10 testes passaram.

## 3:40 a 6:20 - Testes Selenium

Rodar:

```bash
npm run test:selenium
```

Narrar os fluxos principais: login, busca, cadastro de livro, venda online, contato e listagens de vendas/trocas.

## 6:20 a 7:20 - Prints dos testes manuais

Abrir a pasta:

```text
docs/prints/manuais
```

Mostrar os 10 prints `CTM01` a `CTM10`.

## 7:20 a 8:40 - Relatorio de defeitos

Abrir:

```text
docs/relatorio-defeitos-e-solucoes-book-connect.md
```

Comentar os defeitos corrigidos: quebra em vendas/trocas, loading infinito na Home e warning de JSX em contatos.

## 8:40 a 10:00 - Encerramento

Mostrar o plano de testes:

```text
docs/plano-de-testes-book-connect.md
```

Finalizar dizendo que o repositorio contem codigo, suite de testes, prints e documentacao.
