'use client';

import React from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoMdClose } from 'react-icons/io';
import { Button } from '@/components/ui/button'; // your button component

// ----------------- Schema -----------------
const MedicineItemSchema = z.object({
  product: z.string().min(2, 'Product name is required'),
  hsn: z.string().min(1, 'HSN is required'),
  batch: z.string().min(1, 'Batch is required'),
  expiry: z.string().min(1, 'Expiry date is required'),
  pack: z.string().optional(), // like "1*10"
  qty: z.coerce
    .number({ invalid_type_error: 'Qty is required' })
    .min(1, 'Qty should be at least 1'),
  free: z.coerce.number().optional().nullable(),
  mrp: z.coerce
    .number({ invalid_type_error: 'MRP is required' })
    .min(0.01, 'MRP is required'),
  rate: z.coerce
    .number({ invalid_type_error: 'Rate is required' })
    .min(0.01, 'Rate is required'),
  scheme: z.string().optional(),
  schemePercent: z.coerce.number().optional().nullable(),
  discount: z.coerce.number().optional().nullable(), // treated as ₹ discount per line
  gst: z.coerce.number().optional().nullable(), // percentage
  margin: z.coerce.number().optional().nullable(), // optional
});

const FormSchema = z.object({
  items: z.array(MedicineItemSchema).min(1, 'Add at least one medicine'),
});

type FormValues = z.infer<typeof FormSchema>;
type MedicineItem = z.infer<typeof MedicineItemSchema>;

// ----------------- Helpers -----------------
const blankItem = (): Partial<MedicineItem> => ({
  product: '',
  hsn: '',
  batch: '',
  expiry: '',
  pack: '',
  qty: undefined,
  free: undefined,
  mrp: undefined,
  rate: undefined,
  scheme: '',
  schemePercent: undefined,
  discount: undefined,
  gst: undefined,
  margin: undefined,
});

function calcLineAmount(item: Partial<MedicineItem>) {
  const qty = Number(item.qty || 0);
  const rate = Number(item.rate || 0);
  const base = qty * rate;

  // apply scheme percentage if any
  const schPct = Number(item.schemePercent || 0);
  const afterScheme = base * (1 - schPct / 100);

  // subtract absolute discount (treated as rupee)
  const disc = Number(item.discount || 0);
  const afterDisc = afterScheme - disc;

  // GST on net amount
  const gstPct = Number(item.gst || 0);
  const gstAmount = afterDisc * (gstPct / 100);

  const total = afterDisc + gstAmount;

  // don't return negative
  return Math.max(0, total || 0);
}

function formatRupee(n: number) {
  return `₹ ${n.toFixed(2)}`;
}

// ----------------- Component -----------------
export default function PurchaseEntryCardUI() {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [blankItem() as MedicineItem],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // live watch for computing AMT and re-render
  const watchedItems = useWatch({ control, name: 'items' }) as
    | Partial<MedicineItem>[]
    | undefined;

  // Add new row: only if last row passes required validation
  const handleAddRow = async () => {
    if (fields.length === 0) {
      append(blankItem());
      return;
    }
    const lastIndex = fields.length - 1;
    const requiredKeys = [
      'product',
      'hsn',
      'batch',
      'expiry',
      'qty',
      'mrp',
      'rate',
    ].map((k) => `items.${lastIndex}.${k}`);

    const ok = await trigger(requiredKeys);
    if (!ok) {
      // user feedback: you can replace with toast
      alert(
        'Please fill required fields in the last card before adding a new one.',
      );
      return;
    }
    append(blankItem());
  };

  // Remove card
  const handleRemove = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: FormValues) => {
    // final payload ready
    // you can call API here to save purchase stock
    console.log('Final submission:', data);
    // Example: compute total amount
    const grandTotal = (data.items || []).reduce((acc, it) => {
      return acc + calcLineAmount(it);
    }, 0);
    console.log('grandTotal', grandTotal);
    alert(
      `Saved ${data.items.length} items — Grand total ${formatRupee(
        grandTotal,
      )}`,
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Add Purchase Stock</h2>

      {fields.map((field, index) => {
        const liveItem = watchedItems?.[index] ?? ({} as Partial<MedicineItem>);
        const amt = calcLineAmount(liveItem);

        return (
          <div
            key={field.id}
            className="relative bg-white shadow-md rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* index & remove */}
            <div className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              #{index + 1}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              aria-label={`Remove row ${index + 1}`}
            >
              <IoMdClose size={18} />
            </button>

            {/* Left column: product, hsn, batch */}
            <div className="space-y-3">
              <Controller
                control={control}
                name={`items.${index}.product`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">
                      Product / Barcode *
                    </label>
                    <input
                      {...field}
                      type="text"
                      placeholder="Product name or barcode"
                      className="w-full border rounded px-3 py-2"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.hsn`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">HSN *</label>
                    <input
                      {...field}
                      type="text"
                      placeholder="HSN code"
                      className="w-full border rounded px-3 py-2"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.batch`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">Batch *</label>
                    <input
                      {...field}
                      type="text"
                      placeholder="Batch number"
                      className="w-full border rounded px-3 py-2"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Middle column: expiry, pack, qty, free */}
            <div className="space-y-3">
              <Controller
                control={control}
                name={`items.${index}.expiry`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">Expiry *</label>
                    <input
                      {...field}
                      type="month"
                      className="w-full border rounded px-3 py-2"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.pack`}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium">Pack</label>
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 1*10 or 1*1"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.qty`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">Qty *</label>
                    <input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      type="number"
                      placeholder="Qty"
                      className="w-full border rounded px-3 py-2"
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.free`}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium">Free</label>
                    <input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      type="number"
                      placeholder="Free units"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
              />
            </div>

            {/* Right column: mrp, rate, scheme, discounts, gst, margin, amt */}
            <div className="space-y-3">
              <Controller
                control={control}
                name={`items.${index}.mrp`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">MRP *</label>
                    <div className="flex items-center border rounded px-2">
                      <span className="text-gray-500 mr-2">₹</span>
                      <input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        type="number"
                        placeholder="MRP"
                        className="w-full py-2 outline-none"
                      />
                    </div>
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.rate`}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="text-sm font-medium">Rate *</label>
                    <div className="flex items-center border rounded px-2">
                      <span className="text-gray-500 mr-2">₹</span>
                      <input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        type="number"
                        placeholder="Rate"
                        className="w-full py-2 outline-none"
                      />
                    </div>
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.scheme`}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium">Scheme</label>
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 2+1"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.schemePercent`}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium">Sch %</label>
                    <div className="flex items-center border rounded px-2">
                      <input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        type="number"
                        placeholder="%"
                        className="w-full py-2 outline-none"
                      />
                      <span className="text-gray-500 ml-2">%</span>
                    </div>
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.discount`}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium">Disc (₹)</label>
                    <input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      type="number"
                      placeholder="Discount (₹)"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`items.${index}.gst`}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium">GST</label>
                    <div className="flex items-center border rounded px-2">
                      <input
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                        type="number"
                        placeholder="%"
                        className="w-full py-2 outline-none"
                      />
                      <span className="text-gray-500 ml-2">%</span>
                    </div>
                  </div>
                )}
              />

              <div>
                <label className="text-sm font-medium">Margin</label>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm text-gray-600">
                    {/* auto-calc margin % if possible */}
                    {liveItem.mrp && liveItem.rate
                      ? `${(
                          ((Number(liveItem.mrp) - Number(liveItem.rate)) /
                            Number(liveItem.mrp)) *
                          100
                        ).toFixed(2)} %`
                      : '-'}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-sm font-medium">AMT</label>
                <div className="mt-1 text-lg font-semibold">
                  {formatRupee(amt)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* controls */}
      <div className="flex gap-3 items-center">
        <Button type="button" onClick={handleAddRow}>
          + Add Row
        </Button>

        <Button
          type="button"
          onClick={() => {
            // trigger full form validation to submit
            handleSubmit(onSubmit)();
          }}
          className="bg-green-600"
        >
          Save All
        </Button>

        {errors.items && (
          <div className="text-sm text-red-500">
            {String(errors.items.message)}
          </div>
        )}
      </div>
    </div>
  );
}
