import { mockFarmers } from "@/data/mock";
import { Farmer } from "@/types/Farmer";

class FarmerService {
  getFarmer = (id: number) => mockFarmers.find((f) => f.id === id);

  updateFarmer(updatedFarmer: Farmer) {
    const idx = mockFarmers.findIndex((f) => f.id === updatedFarmer.id);
    mockFarmers[idx] = updatedFarmer;
  }
}

export const farmerService = new FarmerService();