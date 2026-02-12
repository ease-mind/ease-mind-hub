import mongoose from "mongoose";
import Transaction from "../../models/transactionModel";

export const financialStatusWidget = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const transactions = await Transaction.find({
    userId: new mongoose.Types.ObjectId(userId),
    createdAt: { $gte: startOfMonth, $lte: now },
  }).lean();

  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    if (t.type === "income") income += t.value;
    else if (t.type === "expense") expense += t.value;
  }

  const isPositive = income > expense;

  return income || expense
    ? {
        status: isPositive ? "positivo" : "negativo",
        description: isPositive
          ? "Parabéns! Sua situação financeira está positiva, com receitas superiores às suas despesas. Isso mostra que você está no caminho certo para manter a saúde financeira. Continue investindo em boas práticas de gerenciamento e planejamento!"
          : "Sua situação financeira está negativa. É preciso tomar cuidados imediatos, controlar gastos e replanejar suas finanças para recuperar o equilíbrio.",
      }
    : null;
};
