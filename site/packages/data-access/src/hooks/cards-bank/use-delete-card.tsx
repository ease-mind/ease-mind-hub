import { useState } from "react";
import { DeleteCardBank } from "../../api/cards-bank/delete-card-bank";
import type { ErrorResponse } from "../../api/cards-bank/delete-card-bank";

function isErrorResponse(res: any): res is ErrorResponse {
  return res && typeof res === "object" && "error" in res;
}

export function useDeleteCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (cardId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const result = await DeleteCardBank(cardId);

    if (isErrorResponse(result)) {
      setError(result.error);
      setLoading(false);
      return false;
    }

    setLoading(false);
    return true;
  };

  return { handleDelete, loading, error };
}
