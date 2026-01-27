'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';
import CustomerListWrapper from '@/components/sells/customer-list-wrapper';
import AddCustomerModal from '@/components/sells/add-customer';
import { TCustomer } from '@/types/sells';
import { NoData } from '@/components/ui/no-data';

const SellsPage = () => {
  const router = useRouter();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [refreshCustomerList, setRefreshCustomerList] = useState(0);
  const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState<TCustomer | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenCustomerModal = () => {
    setIsEditMode(false);
    setEditCustomerData(null);
    setOpenAddCustomerModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddCustomerModal(false);
    setEditCustomerData(null);
    setIsEditMode(false);
  };

  const handleRefreshData = () => {
    setRefreshCustomerList((prev) => prev + 1);
    handleCloseModal();
  };

  return (
    <div className="w-full bg-white rounded-lg h-full flex">
      {/* Sidebar (Customer List) */}
      <div className="w-md border-r-1 h-full border-border relative">
        <CustomerListWrapper
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          refreshCustomerList={refreshCustomerList}
          openCustomerModal={handleOpenCustomerModal}
        />
      </div>

      {/* Right Panel */}
      <div className="h-full flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold">Quick Sell</h3>
            <p className="text-gray text-md">Create a new sell order quickly</p>
          </div>
          <div
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:opacity-90 transition"
            onClick={() => router.push('sells/add-sell')}
          >
            <IoMdAdd className="mr-2" />
            New Sell Order
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <NoData
            message="Ready to make a sale?"
            description="Click 'New Sell Order' to start selling medicines to customers"
          />
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <AddCustomerModal
        isOpen={openAddCustomerModal}
        onClose={handleCloseModal}
        onSuccess={handleRefreshData}
        editData={editCustomerData}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default SellsPage;
