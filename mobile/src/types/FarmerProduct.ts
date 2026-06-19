import { Months } from "./Common";

export interface FarmerProduct {
  id: string;
  name: string;
  category: string;
  monthlyCapacity: number;
  unity: string;
  monthsAvaliable: Months[];
  organic: boolean;
  suggestedPrice: number;
}
