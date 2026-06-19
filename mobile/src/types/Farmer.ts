import { FarmerReview } from "./FarmerReview";
import { BidWon } from "./BidWon";
import { FarmerProduct } from "./FarmerProduct";

export interface Farmer {
  id: string;
  name: string;
  cpf: string;
  caf: string;
  phone: string;
  email: string;
  delivery: boolean;
  products: FarmerProduct[];
  reviews: FarmerReview[];
  bidswon: BidWon[];
}
