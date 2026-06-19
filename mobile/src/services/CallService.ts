import { api } from "@/lib/api";
import { Call } from "@/types/Call";
import { CallItem } from "@/types/CallItem";
import { ClosingReview } from "@/types/ClosingReview";
import { toCall, toCallItem } from "@/lib/mappers";
import {
  CallBackResponse,
  CallItemBackResponse,
  CreateCallDTO,
  EndCallDTO,
  ItemChamadaComStatus,
} from "@/types/Backend";
import { unitLabel, frequencyLabel } from "@/utils/options";

export type NewCallInput = {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  itens: CallItem[];
};

class CallService {
  async getAll(): Promise<Call[]> {
    const { data } = await api.get<CallBackResponse[]>("/chamadas");
    return data.map(toCall);
  }

  async getCall(id: string): Promise<Call> {
    const { data } = await api.get<CallBackResponse>(`/chamadas/${id}`);
    return toCall(data);
  }

  async getInstitutionCalls(institutionId: string): Promise<Call[]> {
    const { data } = await api.get<CallBackResponse[]>("/chamadas", {
      params: { instituicaoId: institutionId },
    });
    return data.map(toCall);
  }

  async addCall(input: NewCallInput): Promise<Call> {
    const dto: CreateCallDTO = {
      titulo: input.title,
      descricao: input.description ?? "",
      dataInicio: input.startDate.toISOString().split("T")[0],
      dataFim: input.endDate.toISOString().split("T")[0],
      itens: input.itens.map((i) => ({
        produto: i.product,
        categoria: i.category,
        quantidade: i.amount,
        unidade: unitLabel(i.unity),
        frequencia: frequencyLabel(i.frequency),
        precoReferencia: i.referencePrice,
      })),
    };
    const { data } = await api.post<CallBackResponse>("/chamadas", dto);
    return toCall(data);
  }

  async cancelCall(id: string): Promise<void> {
    await api.put(`/chamadas/${id}/cancelar`);
  }

  async closeCall(id: string, reviews: ClosingReview[]): Promise<void> {
    const dto: EndCallDTO = {
      avaliacoes: reviews.map((r) => ({
        agricultorId: r.farmerId,
        nota: r.grade,
        comentario: r.comment,
      })),
    };
    await api.put(`/chamadas/${id}/encerrar`, dto);
  }

  async getItensStatus(id: string): Promise<ItemChamadaComStatus[]> {
    const { data } = await api.get<ItemChamadaComStatus[]>(
      `/chamadas/${id}/itens-status`
    );
    return data;
  }

  async getAvailableCallItems(id: string): Promise<CallItem[]> {
    const { data } = await api.get<CallItemBackResponse[]>(
      `/chamadas/${id}/itens-disponiveis`
    );
    return data.map(toCallItem);
  }
}

export const callService = new CallService();
