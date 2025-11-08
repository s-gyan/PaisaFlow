import React, { useState, useEffect } from 'react';
import { Group, User, SplitType, Expense, SplitDetail } from '../../types';
import Modal from '../ui/Modal';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  users: User[];
  onAddExpense: (expense: Expense) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, group, users, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paidBy, setPaidBy] = useState<string>(users[0]?.id || '');
  const [splitType, setSplitType] = useState<SplitType>(SplitType.Equally);
  const [involvedMembers, setInvolvedMembers] = useState<string[]>(users.map(u => u.id));
  const [customSplits, setCustomSplits] = useState<Record<string, number | ''>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setPaidBy(users[0]?.id || '');
      setSplitType(SplitType.Equally);
      setInvolvedMembers(users.map(u => u.id));
      setCustomSplits({});
      setError(null);
    }
  }, [isOpen, users]);
  
  const handleMemberToggle = (userId: string) => {
    setInvolvedMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const handleCustomSplitChange = (userId: string, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value);
    if (numValue === '' || (!isNaN(numValue) && numValue >= 0)) {
      setCustomSplits(prev => ({...prev, [userId]: numValue}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || amount <= 0 || involvedMembers.length === 0) {
      setError("Amount must be positive and at least one member must be involved.");
      return;
    }
    
    let splitDetails: SplitDetail[] = [];

    if (splitType === SplitType.Equally) {
      const splitAmount = amount / involvedMembers.length;
      splitDetails = involvedMembers.map(userId => ({ userId, amount: splitAmount }));
    } else if (splitType === SplitType.Custom) {
      // FIX: Explicitly convert value to a number before adding to prevent type errors. The original code `sum + (Number(val) || 0)` was causing a type issue.
      const totalCustom = Object.values(customSplits).reduce((sum, val) => sum + Number(val), 0);
      if (Math.abs(totalCustom - amount) > 0.01) {
        setError(`Custom amounts must add up to ₹${amount.toFixed(2)}. Current total: ₹${totalCustom.toFixed(2)}`);
        return;
      }
      splitDetails = involvedMembers.map(userId => ({ userId, amount: Number(customSplits[userId]) || 0 }));
    } else if (splitType === SplitType.Percentage) {
      // FIX: Explicitly convert value to a number before adding to prevent type errors. The original code `sum + (Number(val) || 0)` was causing a type issue.
      const totalPercent = Object.values(customSplits).reduce((sum, val) => sum + Number(val), 0);
       if (Math.abs(totalPercent - 100) > 0.1) {
        setError(`Percentages must add up to 100%. Current total: ${totalPercent}%`);
        return;
      }
      splitDetails = involvedMembers.map(userId => ({
        userId,
        amount: (amount * (Number(customSplits[userId]) || 0)) / 100,
        percentage: Number(customSplits[userId]) || 0
      }));
    }
    
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      groupId: group.id,
      description: description || 'Unspecified Expense',
      amount: amount,
      paidBy,
      splitType,
      splitDetails,
      date: new Date().toISOString()
    };
    
    onAddExpense(newExpense);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">Description</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Dinner, Rent" className="mt-1 w-full bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none"/>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400">Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="0.00" className="mt-1 w-full bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none"/>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400">Paid by</label>
            <select value={paidBy} onChange={e => setPaidBy(e.target.value)} className="mt-1 w-full bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none">
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Split among</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {users.map(user => (
                    <button type="button" key={user.id} onClick={() => handleMemberToggle(user.id)} className={`p-2 text-sm rounded-md transition ${involvedMembers.includes(user.id) ? 'bg-primary text-white font-bold' : 'bg-base-300 hover:bg-base-200'}`}>
                        {user.name}
                    </button>
                ))}
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Split type</label>
          <div className="flex gap-2 rounded-md bg-base-300 p-1">
            {Object.values(SplitType).map(type => (
              <button type="button" key={type} onClick={() => setSplitType(type)} className={`flex-1 p-2 text-sm rounded-md transition ${splitType === type ? 'bg-primary text-white font-semibold' : 'hover:bg-base-200'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>
        {splitType !== SplitType.Equally && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-gray-400">Enter {splitType === SplitType.Custom ? 'amounts (₹)' : 'percentages (%)'}:</p>
            {involvedMembers.map(userId => {
                const user = users.find(u => u.id === userId);
                return (
                    <div key={userId} className="flex items-center gap-2">
                        <label className="w-1/3 text-gray-300">{user?.name}</label>
                        <input type="number" value={customSplits[userId] || ''} onChange={(e) => handleCustomSplitChange(userId, e.target.value)} className="w-2/3 bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none" />
                    </div>
                );
            })}
          </div>
        )}
        {error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md">{error}</p>}
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-base-300 py-2 px-4 rounded-md hover:bg-base-200">Cancel</button>
          <button type="submit" className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-focus">Add Expense</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;