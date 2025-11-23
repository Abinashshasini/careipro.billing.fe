import { useState, useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import debounce from 'debounce';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import {
  CHECK_DUPLICATE_INVOICE,
  CREATE_PURCHASE_ORDER,
} from '@/utils/api-endpoints';
import {
  TDistributor,
  TMedicine,
  DuplicateInvoiceCheckParams,
  DuplicateInvoiceResponse,
  PurchaseData,
  SavePurchaseResponse,
  ApiError,
  TPurchaseInfo,
  UseAddPurchaseReturn,
  PurchaseTotals,
} from '@/types/purchases';
import { isRowComplete } from '@/lib/medicineValidation';

const useAddPurchase = (): UseAddPurchaseReturn => {
  const [purchaseInfo, setPurchaseInfo] = useState<TPurchaseInfo>({
    selectedDistributor: '',
    distributorName: '',
    invoiceNo: '',
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
  });
  const [medicines, setMedicines] = useState<TMedicine[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const handleFetchDistributors = async (): Promise<TDistributor[]> => {
    const { data } = await apiClient.get<{
      data: { distributors: TDistributor[] };
    }>('/billing-dashboard/get-distributors');
    return data.data.distributors;
  };

  const handleSaveMedicinesPurchase = async (
    purchaseData: PurchaseData,
  ): Promise<SavePurchaseResponse> => {
    const response = await apiClient.post(CREATE_PURCHASE_ORDER, purchaseData);
    return response.data;
  };

  const { data: distributorsData, isLoading: distributorsLoading } = useQuery<
    TDistributor[]
  >({
    queryKey: ['distributors'],
    queryFn: handleFetchDistributors,
    staleTime: 1000 * 60 * 5,
  });

  // Save purchase mutation
  const savePurchaseMutation = useMutation({
    mutationFn: handleSaveMedicinesPurchase,
    onSuccess: (data) => {
      toast.success(data.message || 'Purchase saved successfully!');
      // Reset form after successful save
      setPurchaseInfo({
        selectedDistributor: '',
        distributorName: '',
        invoiceNo: '',
        invoiceDate: new Date(),
        paymentDueDate: new Date(),
      });
      setMedicines([]);
      setInvoiceError(null);
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message ||
          'Failed to save purchase. Please try again.',
      );
    },
  });

  const checkMutation = useMutation({
    mutationFn: async (
      params: DuplicateInvoiceCheckParams,
    ): Promise<DuplicateInvoiceResponse> => {
      const response = await apiClient.post(CHECK_DUPLICATE_INVOICE, params);
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.data.isInvoiceAvailable) {
        setInvoiceError(data.message);
      } else {
        setInvoiceError(null);
      }
    },
    onError: () => {
      setInvoiceError('Invoice number not available');
    },
  });

  const mutationRef = useRef(checkMutation.mutate);
  mutationRef.current = checkMutation.mutate;

  const debouncedCheckInvoice = useMemo(() => {
    const checkInvoice = (params: DuplicateInvoiceCheckParams) => {
      mutationRef.current(params);
    };
    return debounce(checkInvoice, 500);
  }, []);

  useEffect(() => {
    if (purchaseInfo.invoiceNo && purchaseInfo.selectedDistributor) {
      setInvoiceError(null);
      debouncedCheckInvoice({
        invoice_no: purchaseInfo.invoiceNo,
        distributor_id: purchaseInfo.selectedDistributor,
      });
    } else {
      setInvoiceError(null);
    }
  }, [
    purchaseInfo.invoiceNo,
    purchaseInfo.selectedDistributor,
    debouncedCheckInvoice,
  ]);

  useEffect(() => {
    return () => {
      debouncedCheckInvoice.clear();
    };
  }, [debouncedCheckInvoice]);

  const handleMedicinesChange = (updatedMedicines: TMedicine[]) => {
    setMedicines(updatedMedicines);
  };

  const handleImportMedicines = (importedMedicines: TMedicine[]) => {
    setMedicines((prev) => {
      const hasOnlyEmptyRow =
        prev.length === 1 && !prev[0].productName && !prev[0].batch;
      const newMedicines = hasOnlyEmptyRow
        ? importedMedicines
        : [...prev, ...importedMedicines];
      return newMedicines;
    });
  };

  const validateDateOrder = (
    invoiceDate: Date | null,
    dueDate: Date | null,
  ) => {
    if (invoiceDate && dueDate && dueDate < invoiceDate) {
      toast.error('Payment due date cannot be before invoice date.');
      return false;
    }
    return true;
  };

  const calculateTotals = (medicineList: TMedicine[]): PurchaseTotals => {
    return medicineList.reduce(
      (acc, medicine) => {
        const packParts = medicine.pack.split('×').map((p) => parseInt(p, 10));
        const unitsPerStrip =
          packParts.length === 2 && !isNaN(packParts[0]) && !isNaN(packParts[1])
            ? packParts[0] * packParts[1]
            : 1;

        const totalStrips =
          Number(medicine.qty || 0) + Number(medicine.free || 0);
        const totalUnits = totalStrips * unitsPerStrip;
        const totalRate = totalUnits * Number(medicine.rate || 0);

        const discountAmount = totalRate * (Number(medicine.disc || 0) / 100);
        const afterDiscount = totalRate - discountAmount;
        const gst = afterDiscount * 0.05;
        const finalAmount = afterDiscount + gst;

        acc.totalAmount += finalAmount;
        acc.totalItems += totalUnits;
        acc.totalQuantity += Number(medicine.qty || 0);

        return acc;
      },
      {
        totalAmount: 0,
        totalItems: 0,
        totalQuantity: 0,
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!purchaseInfo.distributorName.trim()) {
      toast.error('Please select a distributor.');
      return;
    }
    if (!purchaseInfo.invoiceNo.trim()) {
      toast.error('Please enter an invoice number.');
      return;
    }
    if (invoiceError) {
      toast.error('Please resolve invoice number issue before submitting.');
      return;
    }
    if (!purchaseInfo.invoiceDate) {
      toast.error('Please select an invoice date.');
      return;
    }
    if (!purchaseInfo.paymentDueDate) {
      toast.error('Please select a payment due date.');
      return;
    }

    const validMedicines = medicines.filter((medicine) =>
      isRowComplete(medicine),
    );
    const invalidMedicines = medicines.filter(
      (medicine) =>
        !isRowComplete(medicine) &&
        (medicine.productName.trim() !== '' ||
          medicine.batch.trim() !== '' ||
          (medicine.qty !== '' && Number(medicine.qty) > 0) ||
          (medicine.mrp !== '' && Number(medicine.mrp) > 0) ||
          (medicine.rate !== '' && Number(medicine.rate) > 0)),
    );

    if (invalidMedicines.length > 0) {
      toast.error(
        `Please complete all required fields for ${invalidMedicines.length} medicine row(s) before submitting.`,
      );
      return;
    }

    if (validMedicines.length === 0) {
      toast.error(
        'Please add at least one complete medicine entry before submitting.',
      );
      return;
    }

    // Calculate totals
    const totals = calculateTotals(validMedicines);

    // Transform medicines to match API format
    const transformedMedicines = validMedicines.map((medicine) => {
      const packParts = medicine.pack.split('×').map((p) => parseInt(p, 10));
      const unitsPerStrip =
        packParts.length === 2 && !isNaN(packParts[0]) && !isNaN(packParts[1])
          ? packParts[0] * packParts[1]
          : 1;

      const totalStrips =
        Number(medicine.qty || 0) + Number(medicine.free || 0);
      const totalUnits = totalStrips * unitsPerStrip;
      const totalRate = totalUnits * Number(medicine.rate || 0);
      const discountAmount = totalRate * (Number(medicine.disc || 0) / 100);
      const afterDiscount = totalRate - discountAmount;
      const amount = afterDiscount;

      // Calculate margin (assuming it's the difference between MRP and rate per unit)
      const margin = Number(medicine.mrp || 0) - Number(medicine.rate || 0);

      return {
        med_name: medicine.productName,
        batch: medicine.batch,
        pack: medicine.pack,
        expiry: `20${medicine.expiryYY}-${medicine.expiryMM.padStart(
          2,
          '0',
        )}-01`, // Format: YYYY-MM-DD (first day of month)
        qty: Number(medicine.qty || 0),
        free: Number(medicine.free || 0),
        rate: Number(medicine.rate || 0),
        mrp: Number(medicine.mrp || 0),
        disc: Number(medicine.disc || 0),
        margin: margin,
        amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      };
    });

    const purchaseData = {
      distributor_id: purchaseInfo.selectedDistributor,
      payment_due_date:
        purchaseInfo.paymentDueDate?.toISOString().split('T')[0] || '',
      invoice_no: purchaseInfo.invoiceNo,
      invoice_date: purchaseInfo.invoiceDate?.toISOString().split('T')[0] || '',
      total_amount: Math.round(totals.totalAmount * 100) / 100,
      total_item_count: totals.totalItems,
      medicines: transformedMedicines,
    };

    // Call the API to save purchase
    savePurchaseMutation.mutate(purchaseData);
  };

  return {
    purchaseInfo,
    setPurchaseInfo,
    medicines,
    setMedicines,
    showImportModal,
    setShowImportModal,
    distributors: distributorsData || [],
    distributorsLoading,
    isCheckingInvoice: checkMutation.isPending,
    isSubmitting: savePurchaseMutation.isPending,
    invoiceError,
    handleMedicinesChange,
    handleImportMedicines,
    handleSubmit,
    validateDateOrder,
    calculateTotals,
  };
};

export default useAddPurchase;
