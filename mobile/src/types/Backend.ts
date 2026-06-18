export type JWTPayLoad = {
    id: string,
    email: string,
    role: 'agricultor' | 'instituicao',
    perfilId: string
}

export type RegisterUserDTO = {
    role: "agricultor" | "instituicao",
    nome: string,
    email: string,
    senha: string,
    telefone: string,
    cpfCnpj: string,
    caf?: string
    numeroAlunos?: number
}

export type LoginDTO = {
    email: string,
    senha: string
}

export type UpdateFarmerDTO = {
    nome?: string,
    caf?: string,
    telefone?: string,
    email?: string,
    realizaEntrega?: boolean
}

export type CreateProductDTO = {
    nome: string,
    categoria: string,
    capacidadeMensal: number,
    unidade: string,
    mesesDisponiveis: string[],
    organico: boolean,
    precoSugerido: number
}

export type UpdateProductDTO = Partial<CreateProductDTO>

export type UpdateInstitutionDTO = {
    nome?: string,
    telefone?: string,
    email?: string,
    numeroAlunos?: number
}

export type CreateCallItemDTO = {
    produto: string,
    categoria: string,
    quantidade: number,
    unidade: string,
    frequencia: string,
    precoReferencia: number
}

export type CreateCallDTO = {
    titulo: string,
    descricao: string,
    dataInicio: string,
    dataFim: string,
    itens: CreateCallItemDTO[]
}

export type EndReviewDTO = {
    agricultorId: string,
    nota: number,
    comentario?: string
}

export type EndCallDTO = {
    avaliacoes: EndReviewDTO[]
}

export type CreateProposalItemDTO = {
    produto: string,
    quantidade: number,
    unidade: string,
    precoPorUnidade: number
}

export type CreateProposalDTO = {
    chamadaId: string,
    realizaEntrega?: boolean,
    mensagem?: string,
    itens: CreateProposalItemDTO[]
}

export type FarmerBackResponse = {
    id: string,
    nome: string,
    cpf: string,
    caf: string,
    telefone: string,
    email: string,
    realizaEntrega: boolean,
    produtos: [],
    avaliacoes: [],
    licitacoesGanhas: [],
    propostas: [],
    createdAt: Date,
    updatedAt: Date
}

export type InstitutionBackResponse = {
    id: string,
    nome: string,
    cnpj: string,
    telefone: string,
    email: string,
    numeroAlunos: number,
    chamadas: [],
    createdAt: Date,
    updatedAt: Date
}

export type ReviewBackResponse = {
    id: string,
    agricultorId: string,
    agricultor: FarmerBackResponse,
    instituicaoId: string,
    instituicao: InstitutionBackResponse,
    nota: number,
    comentario: string,
    data: string,
    createdAt: Date
}

export type CallBackResponse = {
    id: string,
    titulo: string,
    instituicaoId: string,
    instituicao: InstitutionBackResponse,
    descricao: string,
    dataInicio: string,
    dataFim: string,
    status: 'ativa' | 'encerrada' | 'cancelada',
    itens: CallItemBackResponse[],
    propostas: [],
    createdAt: Date,
    updatedAt: Date
}

export type CallItemBackResponse = {
    id: string,
    chamadaId: string,
    chamada: CallBackResponse,
    produto: string,
    categoria: string,
    quantidade: number,
    unidade: string,
    frequencia: string,
    precoReferencia: number
}

export type ProposalItemBackResponse = {
    id: string,
    propostaId: string,
    proposta: {},
    produto: string,
    quantidade: number,
    unidade: string,
    precoPorUnidade: number,
    total: number
}

export type BidWonBackResponse = {
    id: string,
    agricultorId: string,
    agricultor: FarmerBackResponse,
    chamadaId: string,
    instituicaoId: string,
    valor: number,
    dataConclusao: string,
    createdAt: string
}

export type ProductBackResponse = {
    id: string,
    agricultorId: string,
    agricultor: FarmerBackResponse,
    nome: string,
    categoria: string,
    capacidadeMensal: number,
    unidade: string,
    mesesDisponiveis: string[],
    organico: boolean,
    precoSugerido: number,
    createdAt: Date,
    updatedAt: Date
}

export type ProposalBackResponse = {
    id: string,
    chamadaId: string,
    chamada: CallBackResponse,
    agricultorId: string,
    agricultor: FarmerBackResponse,
    realizaEntrega: boolean,
    mensagem: string,
    valorTotal: number,
    status: 'pendente' | 'aceita' | 'rejeitada' | 'chamada_cancelada',
    dataCriacao: string,
    itens: ProposalItemBackResponse[],
    createdAt: Date,
    updatedAt: Date
}

export type UserBackResponse = {
    id: number,
    email: string,
    senha: string,
    role: 'agricultor' | 'instituicao',
    isActive: boolean,
    agricultorId?: string | null,
    agricultor?: FarmerBackResponse,
    instituicaoId?: string | null,
    instituicao?: InstitutionBackResponse,
    createdAt: Date,
    updatedAt: Date
}