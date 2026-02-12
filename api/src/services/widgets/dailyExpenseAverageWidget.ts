import Transaction from '../../models/transactionModel';

export const dailyAverageWidget = async (userId: string) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const result = await Transaction.aggregate([
        {
            $match: {
                userId,
                type: 'expense',
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$value' }
            }
        }
    ]);

    const totalExpenses = result[0]?.total || 0;
    const daysUntilToday = now.getDate();

    return {
        value: totalExpenses / daysUntilToday
    };
};