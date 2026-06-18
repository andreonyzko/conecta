import { mockCalls, mockFarmers, mockProposals } from "@/data/mock";
import { Call } from "@/types/Call";
import { ClosingReview } from "@/types/ClosingReview";

class CallService {
  getCall = (id: number) => mockCalls.find((c) => c.id === id);

  getAll = () => mockCalls;

  getInstitutionCalls = (institutionId: number) =>
    mockCalls.filter((c) => c.institutionId === institutionId);

  addCall(call: Omit<Call, "id">) {
    const id = Date.now();
    mockCalls.push({ id, ...call });
  }

  getAcceptedCallItems(callId: number) {
    const normalized = new Set<string>();

    mockProposals
      .filter((p) => p.callId === callId && p.status === "accepted")
      .forEach((p) => p.itens.forEach((i) => normalized.add(i.product)));

    return Array.from(normalized);
  }

  getAvailableCallItems(callId: number) {
    const call = mockCalls.find((c) => c.id === callId);
    if (!call) return [];

    const accepteds = new Set(this.getAcceptedCallItems(callId));
    return call.itens.filter((i) => !accepteds.has(i.product));
  }

  cancelCall(id: number) {
    const call = mockCalls.find((c) => c.id === id);
    if (!call) throw new Error("Chamada não encontrada.");
    call.status = "canceled";
    mockProposals
      .filter((p) => p.callId === id)
      .forEach((p) => (p.status = "canceled"));
  }

  closeCall(id: number, reviews: ClosingReview[]) {
    const call = mockCalls.find((c) => c.id === id);
    if (!call) throw new Error("Chamada não encontrada");

    call.status = "closed";
    const acceptedProposals = mockProposals.filter(
      (p) => p.callId === id && p.status === "accepted"
    );

    acceptedProposals.forEach((p) => {
      const farmer = mockFarmers.find((f) => f.id === p.farmerId);
      if (!farmer) return;

      farmer.bidswon.push({
        id: Date.now(),
        callId: id,
        institutionId: call.institutionId,
        conclusionDate: new Date(),
        value: p.totalValue,
      });
    });

    reviews.forEach((r) => {
      const farmer = mockFarmers.find((f) => f.id === r.farmerId);
      if (!farmer) return;

      farmer.reviews.push({
        id: Date.now(),
        institutionId: call.institutionId,
        date: new Date(),
        grade: r.grade,
        comment: r.comment,
      });
    });
  }
}

export const callService = new CallService();
