'use client';
import React from 'react';
import { FiMenu } from 'react-icons/fi';

type HeaderProps = {
  onMenuClick: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className=" bg-gray-800 flex h-16 items-center px-4 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md hover:text-gray-300 text-white"
      >
        <FiMenu size={24} />
      </button>

      <div className="flex items-center gap-3 rounded-sm px-4 py-2 cursor-pointer">
        <div className="h-10 w-10 rounded-sm flex items-center justify-center bg-primary text-white font-bold">
          AB
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            Abinash Medical Store
          </h3>
          <p className="text-xs text-gray-400">Mareigaon, Andapur - 758083</p>
        </div>
      </div>

      {/* Desktop actions */}
      <div className="hidden lg:flex ml-auto items-center gap-4 text-sm font-medium text-gray-600">
        <button className="px-3 py-2 rounded-md text-white hover:text-gray-400">
          Purchases
        </button>
        <button className="px-3 py-2 rounded-md text-white hover:text-gray-400">
          Stock
        </button>
        <button className="px-3 py-2 rounded-md text-white hover:text-gray-400">
          Sells
        </button>

        <button className="px-2 py-1 text-xs bg-bg-primary rounded-md hover:bg-white">
          ⌘K Search
        </button>
        <button className="px-2 py-1 text-xs bg-bg-primary rounded-md hover:bg-white">
          ⌘H Help
        </button>

        <img
          src="https://avatars.githubusercontent.com/u/48725176?v=4"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
