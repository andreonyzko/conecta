import { ProposalStatus } from "./Common";
import { ProposalItem } from "./ProposalItem";

export interface Proposal {
  id: string;
  callId: string;
  farmerId: string;
  farmerName?: string;
  itens: ProposalItem[];
  delivery: boolean;
  message: string;
  totalValue: number;
  status: ProposalStatus;
  createdAt: Date;
}
