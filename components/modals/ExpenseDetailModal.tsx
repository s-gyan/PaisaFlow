
import React from 'react';
import { Expense, User } from '../../types';
import Modal from '../ui/Modal';

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense;
  users: User[];
}

const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ isOpen, onClose, expense, users }) => {
  const userMap = new Map(users.map(u => [u.id, u.name]));
  const payerName = userMap.get(expense.paidBy) || 'Unknown User';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Expense Details">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{expense.description}</h3>
          <p className="text-sm text-gray-400">
            Paid on {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="bg-base-300/50 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Total Amount</p>
            <p className="text-3xl font-bold text-white">₹{expense.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 text-right">Paid by</p>
            <p className="text-lg font-semibold text-primary">{payerName}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Split Breakdown ({expense.splitType})</h4>
          <ul className="space-y-2">
            {expense.splitDetails.map(split => (
              <li key={split.userId} className="flex justify-between items-center bg-base-300 p-3 rounded-md">
                <span className="text-gray-200">{userMap.get(split.userId) || 'Unknown User'}</span>
                <span className="font-mono text-white">₹{split.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 flex justify-end">
          <button onClick={onClose} className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-focus">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExpenseDetailModal;
