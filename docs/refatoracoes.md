# Refatoracoes realizadas

## Refatoracao 01 - Rotulo de conservacao do livro

Arquivo antes: `src/components/BookCard/index.js`  
Arquivo depois: `src/components/BookCard/index.js` e `src/utils/book.js`

Antes, a funcao `getConservacaoLabel` ficava dentro do componente `BookCard`, misturando regra de exibicao com a estrutura visual do card.

```js
const getConservacaoLabel = (conservacao) => {
  switch (conservacao) {
    case 0:
      return 'Novo';
    case 1:
      return 'Semi-novo';
    case 2:
      return 'Com marcas de uso';
    case 3:
      return 'Desgastado';
    default:
      return '';
  }
};
```

Depois, a regra foi movida para `src/utils/book.js`, ficando reutilizavel e coberta por testes unitarios.

```js
export function getConservacaoLabel(conservacao) {
  const labels = {
    0: 'Novo',
    1: 'Semi-novo',
    2: 'Com marcas de uso',
    3: 'Desgastado',
  };

  return labels[Number(conservacao)] || '';
}
```

Beneficio: melhora a legibilidade do componente e permite testar a regra sem renderizar React.

## Refatoracao 02 - Formatacao de data e valores da venda

Arquivo antes: `src/pages/livros/vendas/cadastro/index.js`  
Arquivos depois: `src/pages/livros/vendas/cadastro/index.js`, `src/utils/date.js` e `src/utils/currency.js`

Antes, a funcao `formatDateForMySQL` ficava declarada dentro da tela de cadastro de venda. A conversao de valores monetarios tambem era feita diretamente no submit.

```js
const formatDateForMySQL = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  const hours = (`0${d.getHours()}`).slice(-2);
  const minutes = (`0${d.getMinutes()}`).slice(-2);
  const seconds = (`0${d.getSeconds()}`).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
```

Depois, a formatacao de data foi movida para `src/utils/date.js`, e a conversao monetaria para `src/utils/currency.js`.

```js
import { formatDateForMySQL } from '../../../../utils/date';
import { parseCurrencyValue } from '../../../../utils/currency';

const formData = {
  valor: parseCurrencyValue(preco),
  data_venda: formatDateForMySQL(new Date()),
  valor_frete: vendaOnline ? parseCurrencyValue(valorFrete) : 0.00,
};
```

Beneficio: evita duplicacao, reduz risco de erro em datas/valores e permite cobertura por testes unitarios.

## Refatoracao adicional - Validacao de login

Arquivo depois: `src/utils/loginValidation.js`

A validacao de e-mail e senha foi extraida do componente de login para `validateLoginCredentials`, deixando o componente responsavel apenas por controlar tela e navegacao. Essa refatoracao tambem foi coberta por testes unitarios.
