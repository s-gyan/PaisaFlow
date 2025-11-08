
import React, { useState, useEffect } from 'react';
import { Group, User, Settlement } from '../../types';
import Modal from '../ui/Modal';
import { RightArrowIcon } from '../ui/Icons';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  users: User[];
  onAddSettlement: (settlement: Settlement) => void;
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({ isOpen, onClose, group, users, onAddSettlement }) => {
  const [payerId, setPayerId] = useState<string>('');
  const [receiverId, setReceiverId] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPayerId(users[0]?.id || '');
      setReceiverId(users[1]?.id || '');
      setAmount('');
      setError(null);
    }
  }, [isOpen, users]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!payerId || !receiverId) {
        setError("Both a payer and a receiver must be selected.");
        return;
    }
    if (payerId === receiverId) {
      setError("Payer and receiver cannot be the same person.");
      return;
    }

    const newSettlement: Settlement = {
      id: `settle-${Date.now()}`,
      groupId: group.id,
      payerId,
      receiverId,
      amount,
      date: new Date().toISOString()
    };
    
    onAddSettlement(newSettlement);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settle Up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400">Payer</label>
                <select value={payerId} onChange={e => setPayerId(e.target.value)} className="mt-1 w-full bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none">
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
            </div>
            <div className="pt-6">
                <RightArrowIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400">Receiver</label>
                <select value={receiverId} onChange={e => setReceiverId(e.target.value)} className="mt-1 w-full bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none">
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))} placeholder="0.00" className="mt-1 w-full bg-base-300 p-2 rounded-md focus:ring-primary focus:outline-none"/>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        
        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-base-300 py-2 px-4 rounded-md hover:bg-base-200">Cancel</button>
          <button type="submit" className="bg-secondary text-black font-semibold py-2 px-6 rounded-md hover:bg-secondary-focus">Record Payment</button>
        </div>
      </form>
    </Modal>
  );
};

export default SettleUpModal;
