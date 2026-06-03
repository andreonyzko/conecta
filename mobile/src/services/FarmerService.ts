import { mockFarmers } from "@/data/mock";
import { Farmer } from "@/types/Farmer";

export const getFarmer = (id: number) => mockFarmers.find(f => f.id === id);

export function updateFarmer(updatedFarmer: Farmer){
    const idx = mockFarmers.findIndex(f => f.id === updatedFarmer.id);
    mockFarmers[idx] = updatedFarmer;
}