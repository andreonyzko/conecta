import { CallStatus, ProposalStatus, Months } from "@/types/Common";
import { Call } from "@/types/Call";
import { CallItem } from "@/types/CallItem";
import { Proposal } from "@/types/Proposal";
import { ProposalItem } from "@/types/ProposalItem";
import { Farmer } from "@/types/Farmer";
import { FarmerProduct } from "@/types/FarmerProduct";
import { FarmerReview } from "@/types/FarmerReview";
import { BidWon } from "@/types/BidWon";
import { Institution } from "@/types/Institution";
import {
  CallBackResponse,
  CallItemBackResponse,
  ProposalBackResponse,
  ProposalItemBackResponse,
  FarmerBackResponse,
  ProductBackResponse,
  ReviewBackResponse,
  BidWonBackResponse,
  InstitutionBackResponse,
} from "@/types/Backend";

// ===== Status (backend pt -> dominio en) =====
const CALL_STATUS: Record<string, CallStatus> = {
  ativa: "active",
  encerrada: "closed",
  cancelada: "canceled",
};

const PROPOSAL_STATUS: Record<string, ProposalStatus> = {
  pendente: "pending",
  aceita: "accepted",
  rejeitada: "rejected",
  chamada_cancelada: "canceled",
};

// ===== Call =====
export function toCallItem(i: CallItemBackResponse): CallItem {
  return {
    product: i.produto,
    category: i.categoria,
    amount: i.quantidade,
    unity: i.unidade,
    frequency: i.frequencia,
    referencePrice: i.precoReferencia,
  };
}

export function toCall(c: CallBackResponse): Call {
  return {
    id: c.id,
    title: c.titulo,
    institutionId: c.instituicaoId,
    institutionName: c.instituicao?.nome,
    description: c.descricao,
    startDate: new Date(c.dataInicio),
    endDate: new Date(c.dataFim),
    status: CALL_STATUS[c.status] ?? "active",
    itens: (c.itens ?? []).map(toCallItem),
  };
}

// ===== Proposal =====
export function toProposalItem(i: ProposalItemBackResponse): ProposalItem {
  return {
    id: i.id,
    product: i.produto,
    amount: i.quantidade,
    unity: i.unidade,
    unitPrice: i.precoPorUnidade,
    total: i.total,
  };
}

export function toProposal(p: ProposalBackResponse): Proposal {
  return {
    id: p.id,
    callId: p.chamadaId,
    farmerId: p.agricultorId,
    farmerName: p.agricultor?.nome,
    delivery: p.realizaEntrega,
    message: p.mensagem,
    totalValue: p.valorTotal,
    status: PROPOSAL_STATUS[p.status] ?? "pending",
    createdAt: new Date(p.dataCriacao),
    itens: (p.itens ?? []).map(toProposalItem),
  };
}

// ===== Farmer =====
export function toProduct(p: ProductBackResponse): FarmerProduct {
  return {
    id: p.id,
    name: p.nome,
    category: p.categoria,
    monthlyCapacity: p.capacidadeMensal,
    unity: p.unidade,
    monthsAvaliable: (p.mesesDisponiveis ?? []) as Months[],
    organic: p.organico,
    suggestedPrice: p.precoSugerido,
  };
}

export function toReview(r: ReviewBackResponse): FarmerReview {
  return {
    id: r.id,
    institutionId: r.instituicaoId,
    grade: r.nota,
    comment: r.comentario,
    date: new Date(r.data),
  };
}

export function toBidWon(b: BidWonBackResponse): BidWon {
  return {
    id: b.id,
    callId: b.chamadaId,
    institutionId: b.instituicaoId,
    value: b.valor,
    conclusionDate: new Date(b.dataConclusao),
  };
}

export function toFarmer(f: FarmerBackResponse): Farmer {
  return {
    id: f.id,
    name: f.nome,
    cpf: f.cpf,
    caf: f.caf,
    phone: f.telefone,
    email: f.email,
    delivery: f.realizaEntrega,
    products: (f.produtos ?? []).map(toProduct),
    reviews: (f.avaliacoes ?? []).map(toReview),
    bidswon: (f.licitacoesGanhas ?? []).map(toBidWon),
  };
}

// ===== Institution =====
export function toInstitution(i: InstitutionBackResponse): Institution {
  return {
    id: i.id,
    name: i.nome,
    cnpj: i.cnpj,
    phone: i.telefone,
    email: i.email,
    studentsAmount: i.numeroAlunos,
  };
}
