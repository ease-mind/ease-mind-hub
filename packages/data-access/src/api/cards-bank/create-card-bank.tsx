import { NewCardData } from "../../classes/models/cards";
import { api } from "../../helpers/api";

export interface ErrorResponse {
  error: string;
}

export async function PostCardBank({
  userId,
  name,
  functions,
  variant,
}: NewCardData): Promise<NewCardData | ErrorResponse> {
  try {
    const response = await api.post<NewCardData>(
      `/cards`,
      {
        userId,
        name,
        functions,
        variant,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const backendError =
      error?.response?.data?.error || error?.response?.data?.message;

    return {
      error:
        backendError ?? "Erro ao criar cartão. Tente novamente mais tarde.",
    };
  }
}
