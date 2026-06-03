import { Months } from "./Common";

export interface FarmerProduct {
  id: number;
  name: string;
  category: string;
  monthlyCapacity: number;
  unity: string;
  monthsAvaliable: Months[];
  organic: boolean;
  suggestedPrice: number;
}
