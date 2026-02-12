export enum CardFlag {
  Visa = "Visa",
  MasterCard = "MasterCard",
  Elo = "Elo",
}

export interface CardData {
  _id: string;
  userId: string;
  cardNumber: number;
  name: string;
  functions: string[]; // ex: ["credit"]
  variant: string;     // ex: "Black" (não é array)
  expirationDate: string;
  cvv: number;
  flag: CardFlag;
  blocked: boolean;
  limit: number;
  expend?: string;
}

export interface NewCardData {
  userId: string;
  name: string;
  functions: string[];
  variant: string;
}