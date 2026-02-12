import { useState } from "react";
import { PostCardBank } from "../../api/cards-bank/create-card-bank";
import { NewCardData } from "../../classes/models/cards";

export function useCreateCardBank() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCard = async (
    cardData: NewCardData
  ): Promise<NewCardData | null> => {
    setLoading(true);
    const result = await PostCardBank(cardData);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return null;
    }

    setError(null);
    return result;
  };

  return {
    createCard,
    loading,
    error,
  };
}
