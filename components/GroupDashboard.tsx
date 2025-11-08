
import React, { useState } from 'react';
import { Group, Expense, Settlement, SimplifiedDebt, User } from '../types';
import BalanceSummary from './BalanceSummary';
import AddExpenseModal from './modals/AddExpenseModal';
import SettleUpModal from './modals/SettleUpModal';
import { AddIcon, SettleIcon, UserIcon, CopyIcon, LogoIcon } from './ui/Icons';
import ActivityFeed from './ActivityFeed';
import AddMemberForm from './AddMemberForm';


interface GroupDashboardProps {
  group: Group;
  users: User[];
  expenses: Expense[];
  settlements: Settlement[];
  balances: Map<string, number>;
  simplifiedDebts: SimplifiedDebt[];
  onAddMember: (name: string) => User | null;
  onAddExpense: (expense: Expense) => void;
  onAddSettlement: (settlement: Settlement) => void;
}

const GroupDashboard: React.FC<GroupDashboardProps> = ({
  group,
  users,
  expenses,
  settlements,
  balances,
  simplifiedDebts,
  onAddMember,
  onAddExpense,
  onAddSettlement,
}) => {
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isSettleModalOpen, setSettleModalOpen] = useState(false);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    alert('Invite code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-base-200 pb-28">
      <header className="bg-base-100 shadow-lg p-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-primary"/>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h1>
          </div>
          <div className="flex items-center gap-2">
             <div className="hidden sm:flex items-center gap-2 bg-base-300 px-3 py-1.5 rounded-lg">
                <span className="text-sm font-mono text-gray-400">INVITE:</span>
                <span className="text-sm font-bold text-secondary">{group.inviteCode}</span>
                <button onClick={copyInviteCode} className="text-gray-400 hover:text-white transition">
                    <CopyIcon className="h-4 w-4" />
                </button>
             </div>
             <div className="flex -space-x-2 overflow-hidden">
                {users.map(u => 
                    <div key={u.id} title={u.name} className="inline-block h-8 w-8 rounded-full ring-2 ring-base-100 bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                    </div>
                )}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <BalanceSummary simplifiedDebts={simplifiedDebts} users={users} />
        <AddMemberForm onAddMember={onAddMember} />
        <ActivityFeed expenses={expenses} settlements={settlements} users={users} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent flex justify-center z-10">
          <div className="flex gap-4 bg-base-100/80 backdrop-blur-sm p-3 rounded-full shadow-2xl">
              <button
                onClick={() => setExpenseModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-focus transition-transform transform hover:scale-105"
              >
                <AddIcon className="h-6 w-6" />
                Add Expense
              </button>
              <button
                onClick={() => setSettleModalOpen(true)}
                className="flex items-center gap-2 bg-secondary text-black font-semibold py-3 px-6 rounded-full hover:bg-secondary-focus transition-transform transform hover:scale-105"
              >
                <SettleIcon className="h-6 w-6" />
                Settle Up
              </button>
          </div>
      </div>


      {isExpenseModalOpen && (
        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setExpenseModalOpen(false)}
          group={group}
          users={users}
          onAddExpense={onAddExpense}
        />
      )}

      {isSettleModalOpen && (
        <SettleUpModal
          isOpen={isSettleModalOpen}
          onClose={() => setSettleModalOpen(false)}
          group={group}
          users={users}
          onAddSettlement={onAddSettlement}
        />
      )}
    </div>
  );
};

export default GroupDashboard;
