
import React from 'react';
import { SimplifiedDebt, User } from '../types';
import { RightArrowIcon } from './ui/Icons';

interface BalanceSummaryProps {
  simplifiedDebts: SimplifiedDebt[];
  users: User[];
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ simplifiedDebts, users }) => {
  const userMap = new Map(users.map(user => [user.id, user.name]));

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Who Owes Whom</h2>
      {simplifiedDebts.length === 0 ? (
        <p className="text-center text-gray-400 py-4">Everyone is settled up!</p>
      ) : (
        <ul className="space-y-3">
          {simplifiedDebts.map((debt, index) => (
            <li key={index} className="flex items-center justify-between bg-base-300/50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-secondary">{userMap.get(debt.from) || 'Unknown'}</span>
                <RightArrowIcon className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-success">{userMap.get(debt.to) || 'Unknown'}</span>
              </div>
              <span className="font-bold text-lg text-white">₹{debt.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BalanceSummary;
