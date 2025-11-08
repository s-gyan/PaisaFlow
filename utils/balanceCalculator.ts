
import { User, Expense, Settlement, SimplifiedDebt } from '../types';

export const calculateBalances = (users: User[], expenses: Expense[], settlements: Settlement[]): Map<string, number> => {
    const balances = new Map<string, number>();
    users.forEach(user => balances.set(user.id, 0));

    expenses.forEach(expense => {
        const paidByAmount = balances.get(expense.paidBy) || 0;
        balances.set(expense.paidBy, paidByAmount + expense.amount);

        expense.splitDetails.forEach(split => {
            const owedByAmount = balances.get(split.userId) || 0;
            balances.set(split.userId, owedByAmount - split.amount);
        });
    });

    settlements.forEach(settlement => {
        const payerAmount = balances.get(settlement.payerId) || 0;
        balances.set(settlement.payerId, payerAmount + settlement.amount);

        const receiverAmount = balances.get(settlement.receiverId) || 0;
        balances.set(settlement.receiverId, receiverAmount - settlement.amount);
    });

    return balances;
};

export const simplifyDebts = (balances: Map<string, number>): SimplifiedDebt[] => {
    const transactions: SimplifiedDebt[] = [];
    const debtors = Array.from(balances.entries())
        .filter(([, amount]) => amount < -0.01)
        .map(([id, amount]) => ({ id, amount }));

    const creditors = Array.from(balances.entries())
        .filter(([, amount]) => amount > 0.01)
        .map(([id, amount]) => ({ id, amount }));
    
    debtors.sort((a,b) => a.amount - b.amount);
    creditors.sort((a,b) => b.amount - a.amount);

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amountToSettle = Math.min(-debtor.amount, creditor.amount);

        if (amountToSettle > 0.01) {
            transactions.push({
                from: debtor.id,
                to: creditor.id,
                amount: amountToSettle
            });
    
            debtor.amount += amountToSettle;
            creditor.amount -= amountToSettle;
        }

        if (Math.abs(debtor.amount) < 0.01) {
            i++;
        }

        if (Math.abs(creditor.amount) < 0.01) {
            j++;
        }
    }

    return transactions;
};
