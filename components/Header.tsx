
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ user, title }) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
      <div className="flex items-center">
        <div className="relative">
          <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        <div className="flex items-center ml-4">
          <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt={user.name} />
          <span className="ml-3 font-semibold text-gray-200">{user.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
