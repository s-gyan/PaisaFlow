
import React, { useState } from 'react';
import { Expense, Settlement, User } from '../types';
import ExpenseDetailModal from './modals/ExpenseDetailModal';
import { ExpenseIcon, SettleIcon } from './ui/Icons';

interface ActivityFeedProps {
    expenses: Expense[];
    settlements: Settlement[];
    users: User[];
}

type ActivityItem = (Expense & { type: 'expense' }) | (Settlement & { type: 'settlement' });

const ActivityFeed: React.FC<ActivityFeedProps> = ({ expenses, settlements, users }) => {
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const userMap = new Map(users.map(u => [u.id, u.name]));

    const combinedFeed: ActivityItem[] = [
        ...expenses.map(e => ({ ...e, type: 'expense' as const })),
        ...settlements.map(s => ({ ...s, type: 'settlement' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-4 mt-8">Activity Feed</h2>
            {combinedFeed.length === 0 ? (
                 <div className="text-center py-10 bg-base-100 rounded-2xl">
                    <p className="text-gray-400">No expenses or settlements yet.</p>
                    <p className="text-gray-500 text-sm">Click 'Add Expense' to get started!</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {combinedFeed.map((item) => (
                        <li key={item.id}>
                            {item.type === 'expense' ? (
                                <div onClick={() => setSelectedExpense(item)} className="bg-base-100 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-base-300 transition group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/20 text-primary p-3 rounded-full">
                                                <ExpenseIcon className="h-6 w-6"/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg">{item.description}</p>
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-semibold">{userMap.get(item.paidBy)}</span> paid
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-white">₹{item.amount.toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-base-100 p-4 rounded-xl shadow-lg">
                                     <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-secondary/20 text-secondary p-3 rounded-full">
                                                <SettleIcon className="h-6 w-6"/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg">Settlement</p>
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-semibold">{userMap.get(item.payerId)}</span> paid <span className="font-semibold">{userMap.get(item.receiverId)}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-success">+₹{item.amount.toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
             {selectedExpense && (
                <ExpenseDetailModal
                    isOpen={!!selectedExpense}
                    onClose={() => setSelectedExpense(null)}
                    expense={selectedExpense}
                    users={users}
                />
            )}
        </div>
    );
};

export default ActivityFeed;
