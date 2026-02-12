import React, { useState } from "react";
import { BlockCardBank } from "../../api/cards-bank/block-card-bank";
import type { ErrorResponse } from "../../api/cards-bank/block-card-bank";

function isErrorResponse(res: any): res is ErrorResponse {
  return res && typeof res === "object" && "error" in res;
}

export function useBlockCard(initialBlocked: boolean) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(initialBlocked);

  React.useEffect(() => {
    setBlocked(initialBlocked);
  }, [initialBlocked]);

  const handleBlock = async (cardId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const result = await BlockCardBank(cardId);

    if (isErrorResponse(result)) {
      setError(result.error);
      setLoading(false);
      return false;
    }

    setBlocked(result.blocked);
    setLoading(false);
    return true;
  };

  return { handleBlock, loading, error, blocked };
}
