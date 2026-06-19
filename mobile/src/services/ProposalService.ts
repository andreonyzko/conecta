import { api } from "@/lib/api";
import { Proposal } from "@/types/Proposal";
import { toProposal } from "@/lib/mappers";
import { ProposalBackResponse, CreateProposalDTO } from "@/types/Backend";

export type NewProposalInput = {
  callId: string;
  delivery: boolean;
  message?: string;
  itens: {
    product: string;
    amount: number;
    unity: string;
    unitPrice: number;
  }[];
};

class ProposalService {
  async getProposal(id: string): Promise<Proposal> {
    const { data } = await api.get<ProposalBackResponse>(`/propostas/${id}`);
    return toProposal(data);
  }

  async getCallProposals(callId: string): Promise<Proposal[]> {
    const { data } = await api.get<ProposalBackResponse[]>("/propostas", {
      params: { chamadaId: callId },
    });
    return data.map(toProposal);
  }

  async getFarmerProposals(farmerId: string): Promise<Proposal[]> {
    const { data } = await api.get<ProposalBackResponse[]>("/propostas", {
      params: { agricultorId: farmerId },
    });
    return data.map(toProposal);
  }

  async create(input: NewProposalInput): Promise<Proposal> {
    const dto: CreateProposalDTO = {
      chamadaId: input.callId,
      realizaEntrega: input.delivery,
      mensagem: input.message,
      itens: input.itens.map((i) => ({
        produto: i.product,
        quantidade: i.amount,
        unidade: i.unity,
        precoPorUnidade: i.unitPrice,
      })),
    };
    const { data } = await api.post<ProposalBackResponse>("/propostas", dto);
    return toProposal(data);
  }

  // A regra de "produto ja aceito" e validada no backend (responde 400 com a mensagem).
  async accept(id: string): Promise<void> {
    await api.put(`/propostas/${id}/aceitar`);
  }

  async reject(id: string): Promise<void> {
    await api.put(`/propostas/${id}/rejeitar`);
  }

  async cancel(id: string): Promise<void> {
    await api.delete(`/propostas/${id}`);
  }
}

export const proposalService = new ProposalService();
