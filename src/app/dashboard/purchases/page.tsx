'use client';
import React, { useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { LuCalendarArrowUp } from 'react-icons/lu';
import { FaRegAddressBook } from 'react-icons/fa';
import { TbSortAscending } from 'react-icons/tb';
import { IoChevronBackOutline } from 'react-icons/io5';

type selectedDistributorType = {
  selcted: boolean;
  distributerId: number | null;
  distributorInvoiceData: string[];
};

/** components */
import { SearchBar } from '@/components/ui/searchbar';
import DistributorOrInvoiceList from './component/distributor-or-invoice-list';

const PurchaseContainer = () => {
  /** Required states */
  const [query, setQuery] = useState('');
  const [selectedDistributor, setSelectedDistributor] =
    useState<selectedDistributorType>({
      selcted: false,
      distributerId: null,
      distributorInvoiceData: [],
    });

  return (
    <div className="w-full bg-white rounded-lg h-full flex">
      <div className="w-md border-r-1 h-full border-border">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            {selectedDistributor.selcted && <IoChevronBackOutline size={25} />}
            <div>
              <h3 className="text-xl font-bold">Purchases</h3>
              <p className="text-gray text-md">View or Edit Purchases</p>
            </div>
          </div>
          <div className="flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:opacity-90 transition">
            <FaRegAddressBook className="mr-2" />
            Add Distributors
          </div>
        </div>

        <div className="flex items-center gap-4 border-b border-border pb-6 p-4">
          <SearchBar
            placeholder="Search by Name or GSTIN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-semibold"
            icon={<IoMdSearch size={20} className="text-black" />}
          />
          <div className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary">
            <LuCalendarArrowUp
              size={23}
              className="text-black cursor-pointer"
            />
          </div>
          <div className="border border-border rounded-lg p-2 hover:bg-grayLight transition bg-bg-secondary">
            <TbSortAscending size={23} className="text-black cursor-pointer" />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-sm px-4 py-2 pl-4 border-b border-border bg-shade-yellow">
            {!selectedDistributor.selcted ? (
              <>
                Select a distributor to view there&nbsp;
                <span className="underline font-semibold">Invoices</span>
              </>
            ) : (
              <>
                Select a invoice to get&nbsp;
                <span className="underline font-semibold">
                  Purchase Details
                </span>
              </>
            )}
          </h3>
        </div>

        <DistributorOrInvoiceList
          title="Sample Distributor (B1-32564)"
          date="Last Txn: 12/11/25"
          amount={25000}
          distributorId={1}
          seleceted={selectedDistributor.distributerId === 1}
          onClick={(id) =>
            setSelectedDistributor({
              selcted: true,
              distributerId: id,
              distributorInvoiceData: [],
            })
          }
        />
      </div>

      <div className="h-full flex-1 p-4">
        <p>Lodu lallit</p>
      </div>
    </div>
  );
};

export default PurchaseContainer;
