import { mockProposals } from "@/data/mock";
import { Proposal } from "@/types/Proposal";
import { ProposalStatus } from "@/types/Common";
import { callService } from "./CallService";

class ProposalService {
  getProposal = (callId: number, proposalId: number) =>
    mockProposals.find((p) => p.callId === callId && p.id === proposalId);

  getCallProposals = (callId: number) =>
    mockProposals.filter((p) => p.callId === callId);

  getFarmerProposals = (farmerId: number) =>
    mockProposals.filter((p) => p.farmerId === farmerId);

  addProposal(proposal: Omit<Proposal, "id" | "createdAt">) {
    const newProposal = {
      ...proposal,
      id: Date.now(),
      createdAt: new Date(),
    };

    mockProposals.push(newProposal);
  }

  cancelProposal(id: number) {
    const idx = mockProposals.findIndex((p) => p.id === id);
    mockProposals.slice(idx, 1);
  }

  updateProposalStatus(id: number, status: ProposalStatus) {
    const proposal = mockProposals.find((p) => p.id === id);
    if (!proposal) throw new Error("Proposta não encontrada");
    proposal.status = status;
  }

  canAcceptProposal(proposalId: number) {
    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposta não encontrada.");
    const acceptedsProducts = new Set(
      callService.getAcceptedCallItems(proposal.callId)
    );
    const blockedProducts = proposal.itens
      .map((i) => i.product)
      .filter((i) => acceptedsProducts.has(i));
    return { canAccept: blockedProducts.length === 0, blockedProducts };
  }
}

export const proposalService = new ProposalService();
