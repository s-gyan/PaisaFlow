
import React, { useState } from 'react';
import { UserIcon, AddIcon } from './ui/Icons';

interface AddMemberFormProps {
    onAddMember: (name: string) => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onAddMember }) => {
    const [name, setName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddMember(name.trim());
            setName('');
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <button onClick={() => setIsAdding(true)} className="w-full text-left flex items-center gap-2 p-3 text-primary hover:bg-primary/10 rounded-lg transition mb-6">
                <UserIcon className="h-5 w-5" />
                <span className="font-semibold">Add a member</span>
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mb-6 p-4 bg-base-300/50 rounded-lg">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New member's name"
                className="flex-grow bg-base-100 text-white placeholder-gray-500 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
            />
            <button type="submit" className="bg-primary text-white p-2 rounded-md hover:bg-primary-focus transition">
                <AddIcon className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-base-300 text-gray-300 p-2 rounded-md hover:bg-base-200 transition">
                Cancel
            </button>
        </form>
    );
}

export default AddMemberForm;
