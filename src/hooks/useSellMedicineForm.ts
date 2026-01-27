import { useState, useCallback, useEffect } from 'react';
import { SellMedicine } from '@/types/sells';
import { isRowComplete, hasAnyData } from '@/lib/medicineValidation';

const generateId = () =>
  `sell_medicine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface UseSellMedicineFormOptions {
  initialMedicines?: SellMedicine[];
  onMedicinesChange?: (medicines: SellMedicine[]) => void;
}

export const useSellMedicineForm = (
  options: UseSellMedicineFormOptions = {},
) => {
  const { initialMedicines = [], onMedicinesChange } = options;

  const createEmptyMedicine = useCallback(
    (): SellMedicine => ({
      id: generateId(),
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
    }),
    [],
  );

  const [medicines, setMedicines] = useState<SellMedicine[]>(() => {
    if (initialMedicines.length > 0) {
      return initialMedicines;
    }
    return [createEmptyMedicine()];
  });

  useEffect(() => {
    if (initialMedicines.length > 0) {
      setMedicines(initialMedicines);
    }
  }, [initialMedicines]);

  const updateParent = useCallback(
    (updatedMedicines: SellMedicine[]) => {
      if (onMedicinesChange) {
        onMedicinesChange(updatedMedicines);
      }
    },
    [onMedicinesChange],
  );

  const handleUpdate = useCallback(
    (id: string, data: Partial<SellMedicine>) => {
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

  const handleAddNew = useCallback(() => {
    const newMedicine = createEmptyMedicine();
    setMedicines((prev) => {
      const updated = [...prev, newMedicine];
      updateParent(updated);
      return updated;
    });
  }, [createEmptyMedicine, updateParent]);

  const handleDelete = useCallback(
    (id: string) => {
      setMedicines((prev) => {
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

  return {
    medicines,
    handleUpdate,
    handleDelete,
    handleAddNew,
  };
};

export default useSellMedicineForm;
