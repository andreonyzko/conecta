import { CallStatus } from "./Common";
import { CallItem } from "./CallItem";

export interface Call {
  id: number;
  title: string;
  institutionId: number;
  description: string;
  startDate: Date;
  endDate: Date;
  itens: CallItem[];
  status: CallStatus;
}
