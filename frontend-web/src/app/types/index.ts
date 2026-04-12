export type UserRole = 'agricultor' | 'instituicao';
export type PropostaStatus = 'pendente' | 'aceita' | 'rejeitada' | 'chamada_cancelada';
export type ChamadaStatus = 'ativa' | 'encerrada' | 'cancelada';

export interface AvaliacaoAgricultor {
  id: string;
  instituicaoId: string;
  nota: number;
  comentario: string;
  data: string;
}

export interface LicitacaoGanha {
  id: string;
  chamadaId: string;
  instituicaoId: string;
  valor: number;
  dataConclusao: string;
}

export interface ProdutoAgricultor {
  id: string;
  nome: string;
  categoria: string;
  capacidadeMensal: number;
  unidade: string;
  mesesDisponiveis: string[];
  organico: boolean;
  precoSugerido: number;
}

export interface Agricultor {
  id: string;
  nome: string;
  cpf: string;
  caf: string;
  telefone: string;
  email: string;
  realizaEntrega: boolean;
  produtos: ProdutoAgricultor[];
  avaliacoes: AvaliacaoAgricultor[];
  licitacoesGanhas: LicitacaoGanha[];
}

export interface Instituicao {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  numeroAlunos: number;
}

export interface ItemChamada {
  id: string;
  produto: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  frequencia: string;
  precoReferencia: number;
}

export interface Chamada {
  id: string;
  titulo: string;
  instituicaoId: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  itens: ItemChamada[];
  status: ChamadaStatus;
}

export interface ItemProposta {
  id: string;
  produto: string;
  quantidade: number;
  unidade: string;
  precoPorUnidade: number;
  total: number;
}

export interface Proposta {
  id: string;
  chamadaId: string;
  agricultorId: string;
  itens: ItemProposta[];
  realizaEntrega: boolean;
  mensagem: string;
  valorTotal: number;
  status: PropostaStatus;
  dataCriacao: string;
}

export interface AvaliacaoEncerramento {
  agricultorId: string;
  nota: number;
  comentario: string;
}
