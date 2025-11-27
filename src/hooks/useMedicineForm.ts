import { useState, useCallback, useEffect } from 'react';
import {
  TMedicine,
  TMedicineFormData,
  UseMedicineFormOptions,
} from '@/types/purchases';
import { isRowComplete, hasAnyData } from '@/lib/medicineValidation';

// Simple ID generator
const generateId = () =>
  `medicine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useMedicineForm = (options: UseMedicineFormOptions = {}) => {
  const { initialMedicines = [], onMedicinesChange } = options;

  // Create initial empty medicine
  const createEmptyMedicine = useCallback(
    (): TMedicine => ({
      id: generateId(),
      med_name: '',
      batch: '',
      expiryMM: '',
      expiryYY: '',
      pack: '',
      qty: '',
      free: '',
      mrp: '',
      rate: '',
      disc: '',
      amount: 0,
      margin: 0,
    }),
    [],
  );

  const [medicines, setMedicines] = useState<TMedicine[]>(() => {
    if (initialMedicines.length > 0) {
      return initialMedicines;
    }
    return [createEmptyMedicine()];
  });

  // Sync with parent initialMedicines when they change
  useEffect(() => {
    if (initialMedicines.length > 0) {
      setMedicines(initialMedicines);
    }
  }, [initialMedicines]);

  // Update parent component when medicines change
  const updateParent = useCallback(
    (updatedMedicines: TMedicine[]) => {
      if (onMedicinesChange) {
        onMedicinesChange(updatedMedicines);
      }
    },
    [onMedicinesChange],
  );

  // Handle updating a specific medicine
  const updateMedicine = useCallback(
    (id: string, data: TMedicineFormData) => {
      setMedicines((prev) => {
        const updated = prev.map((medicine) =>
          medicine.id === id ? { ...medicine, ...data } : medicine,
        );
        updateParent(updated);
        return updated;
      });
    },
    [updateParent],
  );

  // Handle adding a new medicine row
  const addMedicine = useCallback(() => {
    const newMedicine = createEmptyMedicine();
    setMedicines((prev) => {
      const updated = [...prev, newMedicine];
      updateParent(updated);
      return updated;
    });

    // Focus the first input of the new row after a short delay
    setTimeout(() => {
      const inputs = document.querySelectorAll('input:not([readonly])');
      const lastRowInputs = Array.from(inputs).slice(-10); // Get last 10 inputs (for the new row)
      const firstInput = lastRowInputs[0] as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }, [createEmptyMedicine, updateParent]);

  // Handle deleting a medicine row
  const deleteMedicine = useCallback(
    (id: string) => {
      setMedicines((prev) => {
        // Prevent deleting the last row
        if (prev.length === 1) {
          const updated = [createEmptyMedicine()];
          updateParent(updated);
          return updated;
        }

        const updated = prev.filter((medicine) => medicine.id !== id);
        updateParent(updated);
        return updated;
      });
    },
    [createEmptyMedicine, updateParent],
  );

  // Clear all medicines
  const clearAllMedicines = useCallback(() => {
    const updated = [createEmptyMedicine()];
    setMedicines(updated);
    updateParent(updated);
  }, [createEmptyMedicine, updateParent]);

  // Get valid medicines (completely filled with required fields)
  const getValidMedicines = useCallback(() => {
    return medicines.filter((medicine) => isRowComplete(medicine));
  }, [medicines]);

  // Get medicines with any data (for preventing accidental loss)
  const getMedicinesWithData = useCallback(() => {
    return medicines.filter((medicine) => hasAnyData(medicine));
  }, [medicines]);

  // Calculate totals
  const calculateTotals = useCallback(() => {
    return medicines.reduce(
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

        // Apply discount
        const discountAmount = totalRate * (Number(medicine.disc || 0) / 100);
        const afterDiscount = totalRate - discountAmount;

        // Add GST (5%)
        const gst = afterDiscount * 0.05;
        const finalAmount = afterDiscount + gst;

        acc.totalAmount += finalAmount;
        acc.totalItems += totalUnits;
        acc.totalQty += Number(medicine.qty || 0);
        acc.totalFree += Number(medicine.free || 0);
        acc.totalDiscount += discountAmount;
        acc.totalGST += gst;

        return acc;
      },
      {
        totalAmount: 0,
        totalItems: 0,
        totalQty: 0,
        totalFree: 0,
        totalDiscount: 0,
        totalGST: 0,
      },
    );
  }, [medicines]);

  // Duplicate a medicine row
  const duplicateMedicine = useCallback(
    (id: string) => {
      setMedicines((prev) => {
        const medicineToClone = prev.find((medicine) => medicine.id === id);
        if (!medicineToClone) return prev;

        const clonedMedicine: TMedicine = {
          ...medicineToClone,
          id: generateId(),
          // Reset quantity-related fields for the clone
          qty: '',
          free: '',
        };

        const medicineIndex = prev.findIndex((medicine) => medicine.id === id);
        const updated = [
          ...prev.slice(0, medicineIndex + 1),
          clonedMedicine,
          ...prev.slice(medicineIndex + 1),
        ];

        updateParent(updated);
        return updated;
      });
    },
    [updateParent],
  );

  // Get validation summary
  const getValidationSummary = useCallback(() => {
    const total = medicines.length;
    const valid = medicines.filter((medicine) =>
      isRowComplete(medicine),
    ).length;
    const withData = medicines.filter((medicine) =>
      hasAnyData(medicine),
    ).length;

    return {
      total,
      valid,
      withData,
      hasInvalidRows: withData > valid,
    };
  }, [medicines]);

  // Import multiple medicines from file
  const importMedicines = useCallback(
    (importedData: TMedicineFormData[]) => {
      const newMedicines: TMedicine[] = importedData.map((data) => ({
        ...data,
        id: generateId(),
        amount: 0,
        margin: 0,
      }));

      setMedicines((prev) => {
        // If there's only one empty row, replace it; otherwise append
        const shouldReplace = prev.length === 1 && !hasAnyData(prev[0]);
        const updated = shouldReplace
          ? newMedicines
          : [...prev, ...newMedicines];
        updateParent(updated);
        return updated;
      });
    },
    [updateParent],
  );

  return {
    medicines,
    updateMedicine,
    addMedicine,
    deleteMedicine,
    clearAllMedicines,
    duplicateMedicine,
    getValidMedicines,
    getMedicinesWithData,
    getValidationSummary,
    calculateTotals,
    importMedicines,
    setMedicines,
  };
};
