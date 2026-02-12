import { CardData } from "../../classes/models/cards";
import { api } from "../../helpers/api";

export interface ErrorResponse {
  error: string;
}

export async function GetCardsBank(
  userId: string
): Promise<CardData[] | ErrorResponse> {
  try {
    const response = await api.get<CardData[]>("/cards", {
      params: { userId },
    });

    return response.data ?? [];
  } catch (error: any) {
    const backendError =
      error?.response?.data?.error || error?.response?.data?.message;

    return {
      error: backendError ?? "Erro ao buscar os cartões. Tente novamente.",
    };
  }
}
