import { mockProposals } from "@/data/mock";
import { getAcceptedCallItems } from "./CallService";
import { Proposal } from "@/types/Proposal";
import { ProposalStatus } from "@/types/Common";

export const getCallProposals = (callId: number) => mockProposals.filter(p => p.callId === callId);
export const getFarmerProposals = (farmerId: number) => mockProposals.filter(p => p.farmerId === farmerId);

export function addProposal(proposal: Omit<Proposal, 'id' | 'createdAt'>){
    const newProposal = {
        ...proposal,
        id: Date.now(),
        createdAt: new Date()
    }

    mockProposals.push(newProposal);
}

export function cancelProposal(id: number){
    const idx = mockProposals.findIndex(p => p.id === id);
    mockProposals.slice(idx, 1);
}

export function updateProposalStatus(id: number, status: ProposalStatus){
    const proposal = mockProposals.find(p => p.id === id);
    if(!proposal) throw new Error("Proposta não encontrada");
    proposal.status = status;
}

export function canAcceptProposal(proposalId: number) {
    const proposal = mockProposals.find(p => p.id === proposalId);
    if(!proposal) throw new Error("Proposta não encontrada.");
    const acceptedsProducts = new Set(getAcceptedCallItems(proposal.callId));
    const blockedProducts = proposal.itens.map(i => i.product).filter(i => acceptedsProducts.has(i));
    return {canAccept: blockedProducts.length === 0, blockedProducts};
}