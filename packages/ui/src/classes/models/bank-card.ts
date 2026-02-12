export type BankCardFunction = "Crédito" | "Débito";
export type BankCardVariant = "Platinum" | "Black";

export interface BankCard {
    id: string;
    userId: string;
    name: string;
    cardNumber: string;
    limit: number;
    expirationDate: string;
    functions?: BankCardFunction[];
    variant: BankCardVariant;
}