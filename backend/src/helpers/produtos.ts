/** Normaliza nome de produto para comparacao (igual ao frontend). */
export function normalizeProduto(nome: string): string {
  return nome.trim().toLowerCase();
}

/**
 * Regra de negocio: dado os itens de uma proposta e os produtos ja aceitos em
 * outras propostas da mesma chamada, retorna os produtos que estao bloqueados
 * (ou seja, ja foram aceitos em outra proposta).
 */
export function produtosBloqueados(
  itens: { produto: string }[],
  produtosJaAceitos: string[],
): string[] {
  const aceitos = new Set(produtosJaAceitos.map(normalizeProduto));
  return itens
    .map((item) => item.produto)
    .filter((produto) => aceitos.has(normalizeProduto(produto)));
}

/**
 * Soma a quantidade ja atendida por produto (normalizado) a partir das propostas aceitas.
 * Usado para a regra de fornecimento parcial (quantidade, nao apenas presenca do produto).
 */
export function quantidadeAtendidaPorProduto(
  propostasAceitas: { itens: { produto: string; quantidade: number }[] }[],
): Map<string, number> {
  const mapa = new Map<string, number>();
  for (const proposta of propostasAceitas) {
    for (const item of proposta.itens) {
      const key = normalizeProduto(item.produto);
      mapa.set(key, (mapa.get(key) ?? 0) + item.quantidade);
    }
  }
  return mapa;
}
