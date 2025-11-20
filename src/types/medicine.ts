export type TMedicine = {
  id: string;
  productName: string;
  batch: string;
  expiryMM: string;
  expiryYY: string;
  pack: string;
  qty: number | '';
  free: number | '';
  mrp: number | '';
  rate: number | '';
  disc: number | '';
  amount: number;
  margin: number;
};

export type TMedicineFormData = Omit<TMedicine, 'id' | 'amount' | 'margin'>;
