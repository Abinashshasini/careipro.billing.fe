import { useState, useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'debounce';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import {
  CHECK_DUPLICATE_INVOICE,
  CREATE_PURCHASE_ORDER,
  GET_DISTRIBUTORS,
  GET_PURCHASE_DETAILS_BY_ID,
  UPDATE_PURCHASE_ORDER,
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
  GetPurchaseDetailsResponse,
  TransformedMedicine,
} from '@/types/purchases';
import { isRowComplete } from '@/lib/medicineValidation';

const useAddPurchase = (
  purchaseOrderId: string | null,
): UseAddPurchaseReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [purchaseInfo, setPurchaseInfo] = useState<TPurchaseInfo>({
    selectedDistributor: '',
    distributorName: '',
    invoiceNo: '',
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
  });
  const [medicines, setMedicines] = useState<TMedicine[]>([]);
  const [originalMedicinesCount, setOriginalMedicinesCount] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const handleFetchDistributors = async (): Promise<TDistributor[]> => {
    const { data } = await apiClient.get<{
      data: { distributors: TDistributor[] };
    }>(`/${GET_DISTRIBUTORS}`);
    return data.data.distributors;
  };

  const handleFetchPurchaseDetails = async (
    id: string,
  ): Promise<GetPurchaseDetailsResponse> => {
    const response = await apiClient.get(`${GET_PURCHASE_DETAILS_BY_ID}/${id}`);
    return response.data;
  };

  const handleSaveMedicinesPurchase = async (
    purchaseData: PurchaseData,
  ): Promise<SavePurchaseResponse> => {
    const response = await apiClient.post(CREATE_PURCHASE_ORDER, purchaseData);
    return response.data;
  };

  const handleUpdatePurchase = async (
    purchaseOrderId: string,
    newMedicines: TransformedMedicine[],
  ): Promise<SavePurchaseResponse> => {
    const response = await apiClient.post(
      `${UPDATE_PURCHASE_ORDER}/${purchaseOrderId}`,
      { medicines: newMedicines },
    );
    return response.data;
  };

  const { data: distributorsData, isLoading: distributorsLoading } = useQuery<
    TDistributor[]
  >({
    queryKey: ['distributors'],
    queryFn: handleFetchDistributors,
    staleTime: 1000 * 60 * 5,
  });

  /** Fetch purchase details in edit mode */
  const { data: purchaseDetailsData, isLoading: isLoadingPurchaseDetails } =
    useQuery<GetPurchaseDetailsResponse>({
      queryKey: ['purchase-details', purchaseOrderId],
      queryFn: () => handleFetchPurchaseDetails(purchaseOrderId!),
      enabled: !!purchaseOrderId,
      staleTime: 1000 * 60 * 5,
    });

  /** Common success handler */
  const handleOnSuccess = () => {
    queryClient.invalidateQueries();

    setTimeout(() => {
      router.back();
    }, 1500);
  };

  /** Save purchase mutation */
  const savePurchaseMutation = useMutation({
    mutationFn: handleSaveMedicinesPurchase,
    onSuccess: (data) => {
      toast.success(data.message || 'Purchase saved successfully!');

      // Reset form state
      setPurchaseInfo({
        selectedDistributor: '',
        distributorName: '',
        invoiceNo: '',
        invoiceDate: new Date(),
        paymentDueDate: new Date(),
      });
      setMedicines([]);
      setInvoiceError(null);

      handleOnSuccess();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message ||
          'Failed to save purchase. Please try again.',
      );
    },
  });

  /** Update purchase mutation for edit mode */
  const updatePurchaseMutation = useMutation({
    mutationFn: ({
      purchaseOrderId,
      newMedicines,
    }: {
      purchaseOrderId: string;
      newMedicines: TransformedMedicine[];
    }) => handleUpdatePurchase(purchaseOrderId, newMedicines),
    onSuccess: (data) => {
      toast.success(data.message || 'Purchase updated successfully!');
      handleOnSuccess();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message ||
          'Failed to update purchase. Please try again.',
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
    if (
      purchaseInfo.invoiceNo &&
      purchaseInfo.selectedDistributor &&
      !purchaseOrderId
    ) {
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
    purchaseOrderId,
  ]);

  useEffect(() => {
    return () => {
      debouncedCheckInvoice.clear();
    };
  }, [debouncedCheckInvoice]);

  // Populate form data when in edit mode
  useEffect(() => {
    if (purchaseOrderId && purchaseDetailsData) {
      const { purchase_order, purchase_order_items } = purchaseDetailsData.data;

      setPurchaseInfo({
        selectedDistributor: purchase_order.distributor_id,
        distributorName: '',
        invoiceNo: purchase_order.invoice_no,
        invoiceDate: new Date(purchase_order.invoice_date),
        paymentDueDate: new Date(purchase_order.payment_due_date),
      });

      // Transform purchase order items to TMedicine format
      const transformedMedicines: TMedicine[] = purchase_order_items.map(
        (item, index) => ({
          id: `medicine-${index + 1}`,
          med_name: item.med_name,
          batch: item.batch,
          expiryMM: item.expiry_mm,
          expiryYY: item.expiry_yy,
          pack: item.pack,
          qty: item.qty,
          free: item.free,
          mrp: item.mrp,
          rate: item.rate,
          disc: item.disc,
          amount: item.amount,
          margin: item.margin,
        }),
      );

      setMedicines(transformedMedicines);
      setOriginalMedicinesCount(transformedMedicines.length);
    }
  }, [purchaseOrderId, purchaseDetailsData, distributorsData]);

  const handleMedicinesChange = (updatedMedicines: TMedicine[]) => {
    setMedicines(updatedMedicines);
  };

  const handleImportMedicines = (importedMedicines: TMedicine[]) => {
    setMedicines((prev) => {
      const hasOnlyEmptyRow =
        prev.length === 1 && !prev[0].med_name && !prev[0].batch;
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
        const packParts = medicine.pack.split('*').map((p) => parseInt(p, 10));
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

    if (!purchaseInfo.selectedDistributor.trim()) {
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
        (medicine.med_name.trim() !== '' ||
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

    const transformedMedicines = validMedicines.map((medicine) => {
      const packParts = medicine.pack.split('*').map((p) => parseInt(p, 10));
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
        med_name: medicine.med_name,
        batch: medicine.batch,
        pack: medicine.pack,
        expiry_mm: medicine.expiryMM || null,
        expiry_yy: medicine.expiryYY || null, // Format: YYYY-MM-DD (first day of month)
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
    console.log('purchaseData', purchaseData);

    if (purchaseOrderId) {
      const newMedicines = transformedMedicines.slice(originalMedicinesCount);
      if (newMedicines.length === 0) {
        toast.error('No new medicines to add.');
        return;
      }
      updatePurchaseMutation.mutate({
        purchaseOrderId,
        newMedicines,
      });
    } else {
      savePurchaseMutation.mutate(purchaseData);
    }
  };

  return {
    purchaseInfo,
    setPurchaseInfo,
    medicines,
    setMedicines,
    originalMedicinesCount,
    showImportModal,
    setShowImportModal,
    distributors: distributorsData || [],
    distributorsLoading,
    isLoadingPurchaseDetails,
    isCheckingInvoice: checkMutation.isPending,
    isSubmitting:
      savePurchaseMutation.isPending || updatePurchaseMutation.isPending,
    invoiceError,
    handleMedicinesChange,
    handleImportMedicines,
    handleSubmit,
    validateDateOrder,
    calculateTotals,
  };
};

export default useAddPurchase;
