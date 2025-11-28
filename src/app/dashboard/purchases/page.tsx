'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

/** components */
import InvoiceDetailsWrapper from '@/components/purchases/invoice-details-wrapper';
import DistibutorListWraper from '@/components/purchases/distributor-list-wraper';
import AddDistributorModal from '@/components/purchases/add-distributor';
import { TDistributor } from '@/types/purchases';

const PurchaseContainer = () => {
  const router = useRouter();
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    string | null
  >(null);
  const [openAddDistributorModal, setOpenAddDistributorModal] =
    useState<boolean>(false);
  const [refreshDistributorList, setRefreshDistributorList] =
    useState<number>(0);
  const [refreshDistributorDetails, setRefreshDistributorDetails] =
    useState<number>(0);
  const [editDistributorData, setEditDistributorData] =
    useState<TDistributor | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  /** Handle open distributor modal for adding */
  const handleOpenDistributorModal = () => {
    setIsEditMode(false);
    setEditDistributorData(null);
    setOpenAddDistributorModal(true);
  };

  /** Handle open distributor modal for editing */
  const handleEditDistributor = (_params: TDistributor) => {
    setIsEditMode(true);
    setEditDistributorData(_params);
    setOpenAddDistributorModal(true);
  };

  /** Handle delete success */
  const handleDeleteSuccess = () => {
    setRefreshDistributorList(Date.now());
    setSelectedDistributorId(null);
    router.replace('/dashboard/purchases');
  };

  /** Handle modal close */
  const handleCloseModal = () => {
    setOpenAddDistributorModal(false);
    setIsEditMode(false);
    setEditDistributorData(null);
  };

  /** Function to handle Refresh distributos API */
  const handleRefreshData = () => {
    setRefreshDistributorDetails(Date.now());
    setRefreshDistributorList(Date.now());
  };

  return (
    <div className="w-full bg-white rounded-lg h-full flex">
      {/* Sidebar (Distributor & Invoice List) */}
      <div className="w-md border-r-1 h-full border-border relative">
        <DistibutorListWraper
          selectedDistributorId={selectedDistributorId}
          setSelectedDistributorId={setSelectedDistributorId}
          refreshDistributorList={refreshDistributorList}
          openDistributorModal={handleOpenDistributorModal}
        />
      </div>

      {/* Right Panel */}
      <div className="h-full flex-1">
        <InvoiceDetailsWrapper
          selectedDistributorId={selectedDistributorId}
          refreshDistributorDetails={refreshDistributorDetails}
          onEditDistributor={handleEditDistributor}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>

      {/* Add/Edit distributor modal  */}
      <AddDistributorModal
        isOpen={openAddDistributorModal}
        onClose={handleCloseModal}
        onSuccess={handleRefreshData}
        editData={editDistributorData}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default PurchaseContainer;
