import { api } from "@/lib/api";
import { Institution } from "@/types/Institution";
import { toInstitution } from "@/lib/mappers";
import { InstitutionBackResponse, UpdateInstitutionDTO } from "@/types/Backend";

class InstitutionService {
  async getInstitution(id: string): Promise<Institution> {
    const { data } = await api.get<InstitutionBackResponse>(
      `/instituicoes/${id}`
    );
    return toInstitution(data);
  }

  async update(id: string, dto: UpdateInstitutionDTO): Promise<Institution> {
    const { data } = await api.put<InstitutionBackResponse>(
      `/instituicoes/${id}`,
      dto
    );
    return toInstitution(data);
  }
}

export const institutionService = new InstitutionService();
