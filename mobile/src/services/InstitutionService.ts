import { mockInstitutions } from "@/data/mock";
import { Institution } from "@/types/Institution";

class InstitutionService {
  getInstitution = (id: number) => mockInstitutions.find((i) => i.id === id);

  updateInstitution(updatedInstitution: Institution) {
    const idx = mockInstitutions.findIndex(
      (i) => i.id === updatedInstitution.id
    );
    mockInstitutions[idx] = updatedInstitution;
  }
}

export const institutionService = new InstitutionService();