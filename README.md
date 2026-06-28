# Book Connect - Trabalho Final de Testes

Projeto utilizado para o trabalho final da disciplina Teste e Manutencao de Software.

## Entregas preparadas

- 10 testes unitarios com Jest.
- 10 testes funcionais automatizados com Selenium.
- 10 testes funcionais manuais documentados com prints.
- Relatorio de defeitos e solucoes.
- Documento de refatoracoes.
- Roteiro sugerido para video narrado de ate 10 minutos.

## Instalar dependencias

```bash
npm install
```

## Rodar o projeto

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

## Rodar os testes unitarios

```bash
npm run test:unit -- --runInBand
```

## Rodar os testes funcionais automatizados

```bash
npm run test:selenium
```

O script inicia o Next.js, abre o Chrome pelo Selenium, executa os 10 casos e salva prints em:

```text
docs/prints/selenium
```

## Gerar prints dos testes manuais

```bash
npm run prints:manual
```

Os prints ficam em:

```text
docs/prints/manuais
```

## Documentos

- `docs/plano-de-testes-book-connect.md`
- `docs/relatorio-defeitos-e-solucoes-book-connect.md`
- `docs/refatoracoes.md`
