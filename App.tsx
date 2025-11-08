
import React, { useState, useMemo } from 'react';
import { Group, Expense, Settlement, User } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import GroupDashboard from './components/GroupDashboard';
import { calculateBalances, simplifyDebts } from './utils/balanceCalculator';

const App: React.FC = () => {
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleCreateGroup = (groupName: string, adminName: string) => {
    const admin: User = { id: `user-${Date.now()}`, name: adminName };
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: groupName,
      members: [admin],
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    setUsers([admin]);
    setGroup(newGroup);
  };

  const handleAddMember = (name: string): User | null => {
    if (!group) return null;
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        alert("A member with this name already exists.");
        return null;
    }
    const newUser: User = { id: `user-${Date.now()}`, name };
    setUsers(prev => [...prev, newUser]);
    setGroup(prev => prev ? { ...prev, members: [...prev.members, newUser] } : null);
    return newUser;
  };
  
  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleAddSettlement = (settlement: Settlement) => {
    setSettlements(prev => [...prev, settlement].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const { balances, simplifiedDebtsList } = useMemo(() => {
    if (!group) return { balances: new Map(), simplifiedDebtsList: [] };
    const currentBalances = calculateBalances(group.members, expenses, settlements);
    const simplified = simplifyDebts(currentBalances);
    return { balances: currentBalances, simplifiedDebtsList: simplified };
  }, [group, expenses, settlements]);

  if (!group) {
    return <WelcomeScreen onCreateGroup={handleCreateGroup} />;
  }

  return (
    <GroupDashboard
      group={group}
      users={users}
      expenses={expenses}
      settlements={settlements}
      balances={balances}
      simplifiedDebts={simplifiedDebtsList}
      onAddMember={handleAddMember}
      onAddExpense={handleAddExpense}
      onAddSettlement={handleAddSettlement}
    />
  );
};

export default App;
