'use client';
import { FaCartPlus } from 'react-icons/fa';
import { MdOutlineContentPasteSearch } from 'react-icons/md';
import { TbSortAscending } from 'react-icons/tb';

import React, { useState } from 'react';
import { SearchBar } from '@/components/ui/searchbar';

const PurchaseContainer = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="w-full bg-white rounded-lg h-full flex">
      <div className="w-96 border-r-1 h-full border-border">
        <div className="flex justify-between items-center p-4">
          <div>
            <h3 className="text-xl font-bold">Purchases</h3>
            <p className="text-gray text-md">View or edit purchases</p>
          </div>
          <div className="flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:opacity-90 transition">
            <FaCartPlus className="mr-2" />
            Add Purchases
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-border pb-6 p-4">
          <SearchBar
            placeholder="Search Purchases..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={
              <MdOutlineContentPasteSearch size={20} className="text-black" />
            }
          />
          <div className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary">
            <TbSortAscending size={23} className="text-black cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-gray-200">
          <div>
            <h3 className="text-sm font-semibold">
              Sample Distributor (B1-32564)
            </h3>
            <p className="text-sm text-gray">Last Txn: 12/11/25</p>
          </div>
          <div className="font-bold text-black">₹9000</div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-gray-200">
          <div>
            <h3 className="text-sm font-semibold">
              Abinash Distributor (B1-32564)
            </h3>
            <p className="text-sm text-gray">Last Txn: 21/02/25</p>
          </div>
          <div className="font-bold text-black">₹5400</div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-gray-200">
          <div>
            <h3 className="text-sm font-semibold">
              Keonjhar Distributor (B1-32564)
            </h3>
            <p className="text-sm text-gray">Last Txn: 14/02/25</p>
          </div>
          <div className="font-bold text-black">₹3800</div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-gray-200">
          <div>
            <h3 className="text-sm font-semibold">
              Sample Distributor (B1-32564)
            </h3>
            <p className="text-sm text-gray">Last Txn: 12/11/25</p>
          </div>
          <div className="font-bold text-black">₹9000</div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-gray-200">
          <div>
            <h3 className="text-sm font-semibold">
              Abinash Distributor (B1-32564)
            </h3>
            <p className="text-sm text-gray">Last Txn: 21/02/25</p>
          </div>
          <div className="font-bold text-black">₹5400</div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border cursor-pointer hover:bg-grayLight transition border-l-4 border-l-primary hover:bg-gray-200">
          <div>
            <h3 className="text-sm font-semibold">
              Keonjhar Distributor (B1-32564)
            </h3>
            <p className="text-sm text-gray">Last Txn: 14/02/25</p>
          </div>
          <div className="font-bold text-black">₹3800</div>
        </div>
      </div>

      <div className="h-full flex-1 p-4 ">
        <p>bakchodi</p>
      </div>
    </div>
  );
};

export default PurchaseContainer;
