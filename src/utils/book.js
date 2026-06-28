export function getConservacaoLabel(conservacao) {
  const labels = {
    0: 'Novo',
    1: 'Semi-novo',
    2: 'Com marcas de uso',
    3: 'Desgastado',
  };

  return labels[Number(conservacao)] || '';
}

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}
