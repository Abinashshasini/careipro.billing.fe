'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiSaveAs } from 'react-icons/hi';
import { MdArrowBack } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SellMedicineListManager from '@/components/sells/sell-medicine-list-manager';
import PaymentModal from '@/components/sells/payment-modal';
import { SellMedicine, TSellInfo, SellData } from '@/types/sells';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { GET_CUSTOMERS, CREATE_SELL_ORDER } from '@/utils/api-endpoints';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomerOption {
  value: string;
  label: string;
}

const AddSellPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sellOrderId = searchParams?.get('id');

  const [sellInfo, setSellInfo] = useState<TSellInfo>({
    customer_id: null,
    customer_name: '',
    customer_mobile: '',
    invoiceNo: '',
    invoiceDate: new Date(),
    paymentMethod: 'cash',
    discountAmount: 0,
    amountPaid: 0,
  });

  const [medicines, setMedicines] = useState<SellMedicine[]>([
    {
      id: Date.now().toString(),
      medicine_id: '',
      med_name: '',
      batch: '',
      expiry_mm: '',
      expiry_yy: '',
      pack: '',
      qty: '',
      free: '',
      mrp: '',
      rate: '',
      disc: '',
      amount: 0,
      margin: 0,
      available_qty: 0,
    },
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isWalkInCustomer, setIsWalkInCustomer] = useState(true);

  // Fetch customers
  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await apiClient.get(GET_CUSTOMERS);
      return response.data.data;
    },
  });

  const customerOptions: CustomerOption[] =
    customersData?.map((customer: any) => ({
      value: customer._id,
      label: `${customer.customer_name} - ${customer.mobile_number}`,
    })) || [];

  const calculateTotals = () => {
    const completeMedicines = medicines.filter(
      (med) => med.med_name && med.qty && Number(med.qty) > 0,
    );

    const totalAmount = completeMedicines.reduce(
      (sum, med) => sum + (med.amount || 0),
      0,
    );
    const totalItems = completeMedicines.length;
    const totalQuantity = completeMedicines.reduce(
      (sum, med) => sum + (Number(med.qty) || 0),
      0,
    );

    return {
      totalAmount,
      totalItems,
      totalQuantity,
      discountAmount: sellInfo.discountAmount || 0,
      finalAmount: totalAmount - (sellInfo.discountAmount || 0),
    };
  };

  const saveSellMutation = useMutation({
    mutationFn: async (sellData: SellData) => {
      const response = await apiClient.post(CREATE_SELL_ORDER, sellData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Sell order created successfully!');
      router.push('/dashboard/sells');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to create sell order',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totals = calculateTotals();

    if (!sellInfo.invoiceNo) {
      toast.error('Please enter invoice number');
      return;
    }

    if (totals.totalItems === 0) {
      toast.error('Please add at least one medicine');
      return;
    }

    if (!isWalkInCustomer && !sellInfo.customer_id) {
      toast.error('Please select a customer');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (paymentData: any) => {
    const totals = calculateTotals();

    const transformedMedicines = medicines
      .filter((med) => med.med_name && med.qty && Number(med.qty) > 0)
      .map((med) => ({
        medicine_id: med.medicine_id,
        med_name: med.med_name,
        batch: med.batch,
        pack: med.pack,
        expiry_mm: med.expiry_mm,
        expiry_yy: med.expiry_yy,
        qty: Number(med.qty) || 0,
        free: Number(med.free) || 0,
        rate: Number(med.rate) || 0,
        mrp: Number(med.mrp) || 0,
        disc: Number(med.disc) || 0,
        margin: med.margin,
        amount: med.amount,
      }));

    const sellData: SellData = {
      customer_id: isWalkInCustomer ? null : sellInfo.customer_id,
      customer_name: isWalkInCustomer
        ? 'Walk-in Customer'
        : sellInfo.customer_name,
      customer_mobile: isWalkInCustomer ? null : sellInfo.customer_mobile,
      invoice_no: sellInfo.invoiceNo,
      invoice_date:
        sellInfo.invoiceDate?.toISOString() || new Date().toISOString(),
      payment_method: paymentData.payment_method,
      amount_paid: paymentData.amount,
      discount_amount: sellInfo.discountAmount || 0,
      total_amount: totals.finalAmount,
      total_item_count: totals.totalItems,
      medicines: transformedMedicines,
    };

    saveSellMutation.mutate(sellData);
    setShowPaymentModal(false);
  };

  const handleCustomerSelect = (option: CustomerOption | null) => {
    if (option) {
      const customer = customersData?.find((c: any) => c._id === option.value);
      setSellInfo({
        ...sellInfo,
        customer_id: option.value,
        customer_name: customer?.customer_name || '',
        customer_mobile: customer?.mobile_number || '',
      });
    } else {
      setSellInfo({
        ...sellInfo,
        customer_id: null,
        customer_name: '',
        customer_mobile: '',
      });
    }
  };

  const totals = calculateTotals();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MdArrowBack size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sellOrderId ? 'Edit Sell Order' : 'New Sell Order'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {sellOrderId
                  ? 'Update the medicine details for this sell order'
                  : 'Add medicines and collect payment from customer'}
              </p>
            </div>
          </div>
          <Button
            type="submit"
            variant="default"
            className="font-semibold"
            onClick={handleSubmit}
            disabled={saveSellMutation.isPending}
          >
            {saveSellMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <HiSaveAs className="mr-2" size={20} />
                Save & Print
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-full space-y-6">
          {/* Customer & Invoice Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Customer & Invoice Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Customer Type Toggle */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isWalkInCustomer}
                      onChange={() => setIsWalkInCustomer(true)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">
                      Walk-in Customer
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isWalkInCustomer}
                      onChange={() => setIsWalkInCustomer(false)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">
                      Registered Customer
                    </span>
                  </label>
                </div>

                {!isWalkInCustomer && (
                  <Select
                    value={
                      sellInfo.customer_id
                        ? customerOptions.find(
                            (opt) => opt.value === sellInfo.customer_id,
                          )
                        : null
                    }
                    onChange={handleCustomerSelect}
                    options={customerOptions}
                    placeholder="Select customer..."
                    isClearable
                    className="text-sm"
                  />
                )}
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  INVOICE NUMBER
                  <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="Invoice Number"
                  value={sellInfo.invoiceNo}
                  onChange={(e) =>
                    setSellInfo({ ...sellInfo, invoiceNo: e.target.value })
                  }
                  required
                />
              </div>

              {/* Invoice Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  INVOICE DATE
                </label>
                <DatePicker
                  selected={sellInfo.invoiceDate}
                  onChange={(date) =>
                    setSellInfo({ ...sellInfo, invoiceDate: date })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Discount */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  DISCOUNT AMOUNT
                </label>
                <Input
                  type="number"
                  placeholder="₹ 0"
                  value={sellInfo.discountAmount || ''}
                  onChange={(e) =>
                    setSellInfo({
                      ...sellInfo,
                      discountAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Medicine List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Medicine Details
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Search and add medicines from available stock
              </p>
            </div>
            <div className="h-[500px]">
              <SellMedicineListManager
                onMedicinesChange={setMedicines}
                initialMedicines={medicines}
                isEditMode={false}
              />
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium mb-1">Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.totalItems}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium mb-1">
                  Quantity
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.totalQuantity}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium mb-1">
                  Subtotal
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totals.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium mb-1">
                  Discount
                </p>
                <p className="text-2xl font-bold text-red-600">
                  -₹{totals.discountAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium mb-1">
                  Final Amount
                </p>
                <p className="text-3xl font-bold text-success">
                  ₹{totals.finalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        totalAmount={totals.finalAmount}
        isLoading={saveSellMutation.isPending}
      />
    </div>
  );
};

export default AddSellPage;
