'use client';
import React, { useState } from 'react';

/** components */
import InvoiceDetailsWrapper from '@/components/purchases/invoice-details-wrapper';
import DistibutorListWraper from '@/components/purchases/distributor-list-wraper';
import AddDistributorModal from '@/components/purchases/add-distributor';
import { TDistributor } from '@/types/purchases';

const PurchaseContainer = () => {
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    string | null
  >(null);
  const [openAddDistributorModal, setOpenAddDistributorModal] =
    useState<boolean>(false);
  const [refreshDistributorList, setRefreshDistributorList] =
    useState<number>(0);
  const [editDistributorData, setEditDistributorData] =
    useState<TDistributor | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  /** Handle open distributor modal for adding */
  const handleOpenDistributorModal = () => {
    setIsEditMode(false);
    setEditDistributorData(null);
    setOpenAddDistributorModal(true);
    setRefreshDistributorList(0);
  };

  /** Handle open distributor modal for editing */
  const handleEditDistributor = (_params: TDistributor) => {
    setIsEditMode(true);
    setEditDistributorData(_params);
    setOpenAddDistributorModal(true);
    setRefreshDistributorList(0);
  };

  /** Handle modal close */
  const handleCloseModal = () => {
    setOpenAddDistributorModal(false);
    setIsEditMode(false);
    setEditDistributorData(null);
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
          refreshDistributorList={refreshDistributorList}
          onEditDistributor={handleEditDistributor}
        />
      </div>

      {/* Add/Edit distributor modal  */}
      <AddDistributorModal
        isOpen={openAddDistributorModal}
        onClose={handleCloseModal}
        onSuccess={() => setRefreshDistributorList(Date.now())}
        editData={editDistributorData}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default PurchaseContainer;
