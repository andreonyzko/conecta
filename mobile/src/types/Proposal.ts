import { ProposalStatus } from "./Common";
import { ProposalItem } from "./ProposalItem";

export interface Proposal {
  id: number;
  callId: number;
  farmerId: number;
  itens: ProposalItem[];
  delivery: boolean;
  message: string;
  totalValue: number;
  status: ProposalStatus;
  createdAt: Date;
}
