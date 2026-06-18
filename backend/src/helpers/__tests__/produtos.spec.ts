import { normalizeProduto, produtosBloqueados } from '../produtos';

describe('normalizeProduto', () => {
  it('remove espacos e deixa minusculo', () => {
    expect(normalizeProduto('  Alface ')).toBe('alface');
    expect(normalizeProduto('TOMATE')).toBe('tomate');
  });
});

describe('produtosBloqueados (regra de proposta)', () => {
  it('retorna vazio quando nenhum produto foi aceito ainda', () => {
    const itens = [{ produto: 'Alface' }, { produto: 'Tomate' }];
    expect(produtosBloqueados(itens, [])).toEqual([]);
  });

  it('bloqueia produtos ja aceitos em outra proposta (ignorando caixa/espacos)', () => {
    const itens = [{ produto: 'Alface' }, { produto: 'Tomate' }];
    const jaAceitos = ['alface', 'Cenoura'];
    expect(produtosBloqueados(itens, jaAceitos)).toEqual(['Alface']);
  });

  it('bloqueia todos quando todos ja foram aceitos', () => {
    const itens = [{ produto: 'Feijao' }, { produto: 'Mandioca' }];
    const jaAceitos = ['FEIJAO', ' mandioca '];
    expect(produtosBloqueados(itens, jaAceitos)).toEqual(['Feijao', 'Mandioca']);
  });
});
