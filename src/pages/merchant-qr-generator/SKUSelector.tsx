// SKU Selector Component
interface SKUSelectorProps {
  skus: any[];
  bulkMode: boolean;
  selectedSKU: string;
  selectedSKUs: string[];
  onSingleSelect: (sku: string) => void;
  onBulkSelect: (skus: string[]) => void;
}

export default function SKUSelector({
  skus,
  bulkMode,
  selectedSKU,
  selectedSKUs,
  onSingleSelect,
  onBulkSelect,
}: SKUSelectorProps) {
  const handleCheckboxChange = (skuCode: string, checked: boolean) => {
    if (checked) {
      onBulkSelect([...selectedSKUs, skuCode]);
    } else {
      onBulkSelect(selectedSKUs.filter(s => s !== skuCode));
    }
  };

  if (bulkMode) {
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {skus.map(sku => (
          <label key={sku.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSKUs.includes(sku.code)}
              onChange={(e) => handleCheckboxChange(sku.code, e.target.checked)}
              className="w-5 h-5 text-primary"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{sku.name}</p>
              <p className="text-sm text-gray-600">SKU: {sku.code} • {sku.paymentMode}</p>
            </div>
          </label>
        ))}
      </div>
    );
  }

  return (
    <select
      value={selectedSKU}
      onChange={(e) => onSingleSelect(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
    >
      <option value="">-- Select SKU --</option>
      {skus.map(sku => (
        <option key={sku.id} value={sku.code}>
          {sku.name} (SKU: {sku.code}) - {sku.paymentMode}
        </option>
      ))}
    </select>
  );
}
