import { api } from "../../helpers/api";

export interface ErrorResponse {
  error: string;
}

export async function DeleteCardBank(
  cardId: string
): Promise<true | ErrorResponse> {
  try {
    await api.delete(`/cards/${cardId}`, {
      data: { id: cardId }
    });

    return true;
  } catch (error: any) {
    const backendError =
      error?.response?.data?.error || error?.response?.data?.message;

    return {
      error: backendError ?? "Erro ao deletar o cartão. Tente novamente.",
    };
  }
}