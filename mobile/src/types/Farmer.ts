import { FarmerReview } from "./FarmerReview";
import { BidWon } from "./BidWon";
import { FarmerProduct } from "./FarmerProduct";

export interface Farmer {
  id: number;
  name: string;
  cpf: string;
  caf: string;
  phone: string;
  email: string;
  products: FarmerProduct[];
  reviews: FarmerReview[];
  bidswon: BidWon[];
}
