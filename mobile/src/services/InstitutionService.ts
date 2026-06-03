import { mockInstitutions } from "@/data/mock";
import { Institution } from "@/types/Institution";

export const getInstitution = (id: number) => mockInstitutions.find(i => i.id === id);

export function updateInstitution(updatedInstitution: Institution){
    const idx = mockInstitutions.findIndex(i => i.id === updatedInstitution.id);
    mockInstitutions[idx] = updatedInstitution;
}