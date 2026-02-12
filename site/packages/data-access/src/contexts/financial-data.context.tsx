import React, { createContext, useContext, useState } from "react";
import { ExtractFilter, ExtractProps, User } from "../classes";
import api from "../helpers/api";
import { Category } from "../classes/models/categories";

export interface FinancialData {
  extract: ExtractProps | null;
  total_value: number;
}

interface FinancialDataContextType extends FinancialData {
  fetchTransactions: (user: User, params?: ExtractFilter) => void;
  updateFinancialData: (financial: FinancialData) => void;
  isLoading: boolean;
  categories?: Category[];
  setIsLoading: (value: boolean) => void;
}

// const fetchTotalIncome = async (userId: string) => {
//   const res = await api.get<ExtractProps>("/transactions", {
//     params: {
//       userId,
//       type: "income",
//       limit: 9999, // força pegar tudo de uma vez (temporário)
//     },
//   });

//   return res.data.reduce((total, transaction) => total + transaction.value, 0);
// };

const FinancialDataContext = createContext<FinancialDataContextType>({
  total_value: 0,
  extract: null,
  categories: [],
  fetchTransactions: () => {
    console.warn("fetchTransactions method is not implemented.");
  },
  updateFinancialData: () => {
    console.warn("updateFinancialData method is not implemented.");
  },
  isLoading: true,
  setIsLoading: () => {
    console.warn("setIsLoading method is not implemented.");
  },
});

export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    total_value: 0,
    extract: null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateFinancialData = (newData: FinancialData) => {
    setFinancialData(newData);
    setIsLoading(false);
  };

  const getCategories = () => {
    if (categories.length > 0) return;
    api
      .get<Category[]>("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        return [];
      });
  };

  const fetchTotalIncome = async (userId: string): Promise<number> => {
    const res = await api.get<ExtractProps>("/transactions", {
      params: {
        userId,
        type: "income",
      },
    });

    return res.data.data
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.value, 0);
  };

  const fetchTransactions = (user: User, params?: ExtractFilter) => {
    const queryParams = {
      limit: params?.limit || 4,
      page: params?.page || 1,
      categoryId: params?.categoryId,
      minValue: params?.minValue,
      maxValue: params?.maxValue,
      startDate: params?.startDate,
      endDate: params?.endDate,
      userId: user._id,
    };
    api
      .get<ExtractProps>("/transactions", { params: queryParams })
      .then((res) => {
        getCategories();
        if (!res.data || !res.data.data) {
          setFinancialData({
            total_value: 0,
            extract: null,
          });
          setIsLoading(false);
          return;
        }
        const extract = res.data;
        

        setFinancialData((prev) => ({
          ...prev,
          extract: extract,
        }));
        if (queryParams.page === 1) {
          fetchTotalIncome(user._id).then((totalIncome) => {
            setFinancialData((prev) => ({
              ...prev,
              total_value: totalIncome,
            }));
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (params) {
          setFinancialData({
            total_value: 0,
            extract: null,
          });
        }
        setIsLoading(false);
      });
  };

  return (
    <FinancialDataContext.Provider
      value={{
        ...financialData,
        fetchTransactions,
        updateFinancialData,
        isLoading,
        setIsLoading,
        categories,
      }}
    >
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => useContext(FinancialDataContext);
