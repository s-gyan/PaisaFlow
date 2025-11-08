
import React, { useState } from 'react';
import { LogoIcon } from './ui/Icons';

interface WelcomeScreenProps {
  onCreateGroup: (groupName: string, adminName: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [yourName, setYourName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && yourName.trim()) {
      onCreateGroup(groupName.trim(), yourName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center mb-8 gap-4">
            <LogoIcon className="h-12 w-12 text-primary"/>
            <h1 className="text-5xl font-bold text-white tracking-tight">PaisaFlow</h1>
        </div>
        <p className="text-lg text-gray-400 mb-10">Split bills with friends, the simple way.</p>

        <div className="bg-base-200 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6">Create a New Group</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Goa Trip, Apartment Bills"
              className="w-full bg-base-300 text-white placeholder-gray-500 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-base-300 text-white placeholder-gray-500 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 px-4 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-primary transition-transform transform hover:scale-105"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
