import { useCallback, useEffect, useState } from "react";
import { GetCardsBank } from "../../api/cards-bank/get-cards-bank";
import { CardData } from "../../classes/models/cards";

export function useCards(userId: string) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCards = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    const result = await GetCardsBank(userId);

    if ("error" in result) {
      setError(result.error);
      setCards([]);
    } else {
      setCards(result);
      setError(null);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    error,
    loading,
    refetchCards: fetchCards,
  };
}
