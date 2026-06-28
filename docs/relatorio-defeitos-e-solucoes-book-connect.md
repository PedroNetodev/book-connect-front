# Relatorio de Defeitos e Solucoes - Book Connect

## Defeito 01 - Quebra nas telas de vendas e trocas

Localizacao: `src/pages/livros/vendas/index.js` e `src/pages/livros/trocas/index.js`

Problema: ao abrir as telas sem retorno valido da API, o sistema podia executar `.map()` em um valor que nao era array. Isso gerava erro do tipo `TypeError: vendas.map is not a function` ou comportamento equivalente em trocas.

Causa tecnica: as paginas assumiam que a resposta da API sempre viria como lista. Quando o backend estava indisponivel ou retornava objeto de erro, a renderizacao quebrava.

Solucao aplicada: uso de validacao defensiva com `safeArray`, centralizada em `src/utils/book.js`. Assim, se a API nao retornar array, a tela renderiza lista vazia em vez de quebrar.

Status: corrigido e coberto por `CTA10`.

## Defeito 02 - Loading infinito na Home

Localizacao: `src/pages/home/index.js`

Problema: ao acessar a Home sem comunicacao correta com a API, a tela podia permanecer com o indicador de carregamento indefinidamente.

Causa tecnica: a requisicao assincroma ativava o estado `loading`, mas em caso de erro a liberacao da tela precisava acontecer independentemente do sucesso da API.

Solucao aplicada: uso de bloco `finally` com `setLoading(false)`, garantindo que a interface seja liberada tanto no sucesso quanto na falha da requisicao. Tambem foi adicionada protecao com `safeArray(data)` antes de percorrer os livros.

Status: corrigido.

## Defeito 03 - Warning de JSX na tela de contatos

Localizacao: `src/pages/contatos/index.js`

Problema: o console do Next exibiu o aviso `Invalid DOM property class. Did you mean className?` durante a geracao dos prints manuais.

Causa tecnica: JSX usa `className`, mas a tela de contatos possuia atributos `class` em alguns elementos.

Solucao aplicada: substituicao de `class` por `className` nos elementos da listagem de contatos.

Status: corrigido.

## Propostas gerais de melhoria

- Manter funcoes de regra de negocio em `src/utils` para facilitar teste unitario.
- Evitar que componentes dependam diretamente de respostas perfeitas da API.
- Adicionar mensagens de estado vazio nas listagens de vendas, trocas e livros.
- Padronizar textos com acentuacao correta em todo o projeto.
- Manter a suite `npm run test:unit` e `npm run test:selenium` no repositorio para futuras manutencoes.
