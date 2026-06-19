import { api } from "@/lib/api";
import { Farmer } from "@/types/Farmer";
import { FarmerProduct } from "@/types/FarmerProduct";
import { toFarmer, toProduct } from "@/lib/mappers";
import {
  FarmerBackResponse,
  ProductBackResponse,
  UpdateFarmerDTO,
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/Backend";

class FarmerService {
  async getFarmer(id: string): Promise<Farmer> {
    const { data } = await api.get<FarmerBackResponse>(`/agricultores/${id}`);
    return toFarmer(data);
  }

  async update(id: string, dto: UpdateFarmerDTO): Promise<Farmer> {
    const { data } = await api.put<FarmerBackResponse>(`/agricultores/${id}`, dto);
    return toFarmer(data);
  }

  async addProduct(farmerId: string, dto: CreateProductDTO): Promise<FarmerProduct> {
    const { data } = await api.post<ProductBackResponse>(
      `/agricultores/${farmerId}/produtos`,
      dto
    );
    return toProduct(data);
  }

  async updateProduct(
    farmerId: string,
    productId: string,
    dto: UpdateProductDTO
  ): Promise<FarmerProduct> {
    const { data } = await api.put<ProductBackResponse>(
      `/agricultores/${farmerId}/produtos/${productId}`,
      dto
    );
    return toProduct(data);
  }

  async removeProduct(farmerId: string, productId: string): Promise<void> {
    await api.delete(`/agricultores/${farmerId}/produtos/${productId}`);
  }
}

export const farmerService = new FarmerService();
