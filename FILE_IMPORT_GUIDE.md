# Medicine Import File Formats

This document describes the supported file formats for importing medicines into the system.

## Supported File Types

- **CSV** (.csv) - Comma-separated values
- **Excel** (.xlsx, .xls) - Microsoft Excel files
- **PDF** (.pdf) - Coming soon

## Required Columns

The file must contain the following columns (column names are case-insensitive):

| Column Name  | Aliases                                    | Type   | Required | Example           |
| ------------ | ------------------------------------------ | ------ | -------- | ----------------- |
| Product Name | product, productname, name, medicine, item | Text   | Yes      | Paracetamol 500mg |
| HSN          | hsn, hsncode                               | Text   | Yes      | 3004              |
| Batch        | batch, batchno, batchnumber                | Text   | Yes      | B12345            |
| Expiry       | expiry, exp, expdate, expirymm/expiryyy    | Text   | Yes      | 12/25 or 12-25    |
| Pack         | pack, packing, package                     | Text   | Yes      | 1×10              |
| Qty          | qty, quantity, strips                      | Number | Yes      | 50                |
| MRP          | mrp, price, maxretailprice                 | Number | Yes      | 10.50             |
| Rate         | rate, purchaserate, cost                   | Number | Yes      | 8.00              |
| Free         | free, freeqty                              | Number | No       | 0                 |
| Discount     | disc, discount, discountpercent, disc%     | Number | No       | 5                 |

## CSV Format Example

```csv
Product Name,HSN,Batch,Expiry,Pack,Qty,Free,MRP,Rate,Disc
Paracetamol 500mg,3004,B12345,12/25,1×10,50,0,10.50,8.00,5
Amoxicillin 250mg,3004,B67890,06/26,1×15,30,5,15.00,12.00,10
Ibuprofen 400mg,3004,B11111,03/25,1×10,100,0,8.50,6.50,0
```

## Excel Format Example

Create an Excel file with the first row containing column headers and subsequent rows containing medicine data.

| Product Name       | HSN  | Batch  | Expiry | Pack | Qty | Free | MRP    | Rate   | Disc |
| ------------------ | ---- | ------ | ------ | ---- | --- | ---- | ------ | ------ | ---- |
| Paracetamol 500mg  | 3004 | B12345 | 12/26  | 1×10 | 50  | 5    | 12.50  | 9.50   | 8    |
| Amoxicillin 250mg  | 3004 | B67890 | 06/27  | 1×15 | 30  | 3    | 45.00  | 38.00  | 10   |
| Ibuprofen 400mg    | 3004 | B11111 | 03/26  | 1×10 | 75  | 0    | 25.00  | 20.00  | 5    |
| Azithromycin 500mg | 3004 | B22222 | 09/26  | 1×6  | 30  | 3    | 180.00 | 150.00 | 15   |

## Sample File

A sample CSV file with 25 realistic medicine entries is available at:
`sample-medicine-import.csv`

You can:

1. Open this file in Excel or Google Sheets
2. Edit the data as needed
3. Save it as CSV or Excel format
4. Import it into the system

### Sample Data Included:

- Common medicines (Paracetamol, Amoxicillin, Ibuprofen, etc.)
- Various pack sizes (1×10, 2×15, 1×30, etc.)
- Different expiry dates
- Realistic pricing (MRP and Rate)
- Free quantities and discounts
- Proper HSN codes

## Date Format for Expiry

The expiry date can be in any of the following formats:

- MM/YY (e.g., 12/25)
- MM-YY (e.g., 12-25)
- MMYY (e.g., 1225)

The system will automatically parse and separate the month and year.

## Important Notes

1. **Header Row**: The first row must contain column headers
2. **Data Types**: Ensure numeric columns contain valid numbers
3. **Pack Format**: Use format like "1×10" or "2×15"
4. **File Size**: Maximum file size is 5MB
5. **Empty Rows**: Empty rows will be skipped
6. **Validation**: Each row will be validated, and errors will be reported

## Installation Requirements

To use Excel file imports, you need to install the `xlsx` package:

```bash
npm install xlsx
```

## Error Handling

If there are errors in your file:

- Invalid rows will be reported with row numbers
- Valid rows will still be imported
- A summary of issues will be displayed after import
