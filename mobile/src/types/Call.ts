import { CallStatus } from "./Common";
import { CallItem } from "./CallItem";

export interface Call {
  id: string;
  title: string;
  institutionId: string;
  institutionName?: string;
  description: string;
  startDate: Date;
  endDate: Date;
  itens: CallItem[];
  status: CallStatus;
}
