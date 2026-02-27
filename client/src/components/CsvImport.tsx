import { useState, useCallback, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle,
  Download, ArrowRight, ArrowLeft, X, Loader2
} from 'lucide-react';

// ─── CSV Parsing ─────────────────────────────────────────
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine).filter(r => r.some(c => c));
  return { headers, rows };
}

// ─── Field Definitions ───────────────────────────────────
const IMPORT_FIELDS = [
  { key: 'propertyAddress', label: 'Property Address', required: true, type: 'string' as const },
  { key: 'city', label: 'City', required: false, type: 'string' as const },
  { key: 'state', label: 'State', required: false, type: 'string' as const },
  { key: 'zip', label: 'Zip Code', required: false, type: 'string' as const },
  { key: 'stage', label: 'Stage', required: false, type: 'stage' as const },
  { key: 'purchasePrice', label: 'Purchase Price', required: false, type: 'number' as const },
  { key: 'arv', label: 'ARV', required: false, type: 'number' as const },
  { key: 'rehabCost', label: 'Rehab Cost', required: false, type: 'number' as const },
  { key: 'estimatedProfit', label: 'Est. Profit', required: false, type: 'number' as const },
  { key: 'tags', label: 'Tags', required: false, type: 'string' as const },
  { key: 'notes', label: 'Notes', required: false, type: 'string' as const },
] as const;

const VALID_STAGES = ['lead', 'analyzing', 'offer_submitted', 'under_contract', 'closing', 'rehab', 'listed', 'sold', 'dead'];

type ColumnMapping = Record<string, string>; // csvHeader -> fieldKey

// ─── Auto-map heuristic ─────────────────────────────────
function autoMapColumns(csvHeaders: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const patterns: Record<string, RegExp> = {
    propertyAddress: /^(property\s*)?address|street|location|property$/i,
    city: /^city|town$/i,
    state: /^state|st$/i,
    zip: /^zip|zip\s*code|postal|postal\s*code$/i,
    stage: /^stage|status|pipeline\s*stage$/i,
    purchasePrice: /^purchase\s*price|asking\s*price|price|offer|purchase$/i,
    arv: /^arv|after\s*repair\s*value|after\s*repair$/i,
    rehabCost: /^rehab\s*cost|repair\s*cost|rehab|renovation\s*cost$/i,
    estimatedProfit: /^(est\.?\s*)?profit|estimated\s*profit|net\s*profit$/i,
    tags: /^tags?|labels?|categories?$/i,
    notes: /^notes?|comments?|description$/i,
  };

  for (const header of csvHeaders) {
    for (const [fieldKey, pattern] of Object.entries(patterns)) {
      if (pattern.test(header.trim()) && !Object.values(mapping).includes(fieldKey)) {
        mapping[header] = fieldKey;
        break;
      }
    }
  }
  return mapping;
}

// ─── Sample CSV Template ─────────────────────────────────
function downloadSampleCSV() {
  const csv = `Property Address,City,State,Zip,Stage,Purchase Price,ARV,Rehab Cost,Est. Profit,Tags,Notes
123 Main St,Dallas,TX,75201,lead,150000,220000,35000,25000,flip,Great neighborhood
456 Oak Ave,Houston,TX,77001,analyzing,180000,280000,50000,35000,"wholesale,flip",Needs new roof
789 Elm Dr,Austin,TX,78701,lead,200000,310000,60000,40000,BRRRR,Owner motivated`;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pipeline-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Step Components ─────────────────────────────────────

function StepUpload({ onParsed }: { onParsed: (headers: string[], rows: string[][]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback((file: File) => {
    setError('');
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file (.csv)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);
      if (headers.length === 0) {
        setError('Could not parse CSV. Check the file format.');
        return;
      }
      if (rows.length === 0) {
        setError('CSV has headers but no data rows.');
        return;
      }
      if (rows.length > 500) {
        setError(`Too many rows (${rows.length}). Maximum 500 deals per import.`);
        return;
      }
      onParsed(headers, rows);
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsText(file);
  }, [onParsed]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Upload CSV File</h3>
          <p className="text-xs text-[oklch(0.5_0_0)] mt-0.5">
            Upload a CSV file with property addresses and deal details. Max 500 rows.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadSampleCSV}
          className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5 text-xs"
        >
          <Download className="w-3 h-3 mr-1" /> Sample CSV
        </Button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-[oklch(0.48_0.20_18)] bg-[oklch(0.48_0.20_18/0.05)]'
            : 'border-[oklch(0.3_0_0)] hover:border-[oklch(0.4_0_0)]'
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 text-[oklch(0.4_0_0)]" />
        <p className="text-sm text-[oklch(0.6_0_0)] mb-1">
          Drag & drop your CSV file here, or click to browse
        </p>
        <p className="text-xs text-[oklch(0.4_0_0)]">
          Supports .csv files up to 5MB
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          if (e.target) e.target.value = '';
        }}
      />

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[oklch(0.65_0.18_18/0.1)] border border-[oklch(0.65_0.18_18/0.3)]">
          <AlertCircle className="w-4 h-4 text-[oklch(0.65_0.18_18)] shrink-0" />
          <p className="text-xs text-[oklch(0.65_0.18_18)]">{error}</p>
        </div>
      )}
    </div>
  );
}

function StepMapping({
  csvHeaders,
  mapping,
  onMappingChange,
}: {
  csvHeaders: string[];
  mapping: ColumnMapping;
  onMappingChange: (m: ColumnMapping) => void;
}) {
  const addressMapped = Object.values(mapping).includes('propertyAddress');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Map Columns</h3>
        <p className="text-xs text-[oklch(0.5_0_0)] mt-0.5">
          Match your CSV columns to deal fields. <span className="text-[oklch(0.65_0.18_18)]">Property Address is required.</span>
        </p>
      </div>

      <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
        {csvHeaders.map((header) => (
          <div key={header} className="flex items-center gap-3 p-2.5 rounded-lg bg-[oklch(0.12_0_0)] border border-[oklch(0.22_0_0)]">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{header}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[oklch(0.4_0_0)] shrink-0" />
            <div className="w-44">
              <Select
                value={mapping[header] || '_skip'}
                onValueChange={(val) => {
                  const next = { ...mapping };
                  // Remove old mapping for this field if it exists elsewhere
                  if (val !== '_skip') {
                    for (const k of Object.keys(next)) {
                      if (next[k] === val) delete next[k];
                    }
                  }
                  if (val === '_skip') {
                    delete next[header];
                  } else {
                    next[header] = val;
                  }
                  onMappingChange(next);
                }}
              >
                <SelectTrigger className="h-8 text-xs bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)]">
                  <SelectValue placeholder="Skip" />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)]">
                  <SelectItem value="_skip" className="text-xs text-[oklch(0.5_0_0)]">— Skip —</SelectItem>
                  {IMPORT_FIELDS.map((f) => (
                    <SelectItem key={f.key} value={f.key} className="text-xs">
                      {f.label}{f.required ? ' *' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      {!addressMapped && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[oklch(0.65_0.18_18/0.1)] border border-[oklch(0.65_0.18_18/0.3)]">
          <AlertCircle className="w-4 h-4 text-[oklch(0.65_0.18_18)] shrink-0" />
          <p className="text-xs text-[oklch(0.65_0.18_18)]">You must map at least one column to "Property Address".</p>
        </div>
      )}
    </div>
  );
}

function StepPreview({
  csvHeaders,
  rows,
  mapping,
}: {
  csvHeaders: string[];
  rows: string[][];
  mapping: ColumnMapping;
}) {
  const mappedFields = IMPORT_FIELDS.filter(f => Object.values(mapping).includes(f.key));
  const previewRows = rows.slice(0, 10);
  const getVal = (row: string[], fieldKey: string) => {
    const headerIdx = csvHeaders.findIndex(h => mapping[h] === fieldKey);
    return headerIdx >= 0 ? row[headerIdx] || '' : '';
  };

  // Count validation issues
  let issues = 0;
  for (const row of rows) {
    const addr = getVal(row, 'propertyAddress');
    if (!addr) issues++;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Preview & Validate</h3>
          <p className="text-xs text-[oklch(0.5_0_0)] mt-0.5">
            Review the first 10 rows. {rows.length} total rows will be imported.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-[oklch(0.65_0.18_145)]">
            <CheckCircle2 className="w-3.5 h-3.5" /> {rows.length - issues} valid
          </span>
          {issues > 0 && (
            <span className="flex items-center gap-1 text-[oklch(0.65_0.18_18)]">
              <AlertCircle className="w-3.5 h-3.5" /> {issues} missing address
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[oklch(0.22_0_0)]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[oklch(0.14_0_0)]">
              <th className="px-3 py-2 text-left text-[oklch(0.5_0_0)] font-medium w-8">#</th>
              {mappedFields.map(f => (
                <th key={f.key} className="px-3 py-2 text-left text-[oklch(0.5_0_0)] font-medium whitespace-nowrap">
                  {f.label}{f.required ? ' *' : ''}
                </th>
              ))}
              <th className="px-3 py-2 text-left text-[oklch(0.5_0_0)] font-medium w-16">Status</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => {
              const addr = getVal(row, 'propertyAddress');
              const valid = !!addr;
              return (
                <tr key={i} className={`border-t border-[oklch(0.2_0_0)] ${!valid ? 'bg-[oklch(0.65_0.18_18/0.04)]' : ''}`}>
                  <td className="px-3 py-2 text-[oklch(0.4_0_0)]">{i + 1}</td>
                  {mappedFields.map(f => (
                    <td key={f.key} className="px-3 py-2 text-white max-w-[200px] truncate">
                      {getVal(row, f.key) || <span className="text-[oklch(0.35_0_0)]">—</span>}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    {valid ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.65_0.18_145)]" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-[oklch(0.65_0.18_18)]" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length > 10 && (
          <div className="px-3 py-2 text-xs text-[oklch(0.4_0_0)] bg-[oklch(0.12_0_0)] border-t border-[oklch(0.2_0_0)]">
            ... and {rows.length - 10} more rows
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main CSV Import Dialog ──────────────────────────────
export default function CsvImportDialog({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [importResult, setImportResult] = useState<{
    imported: number;
    skipped: number;
    total: number;
    errors: { row: number; address: string; error: string }[];
  } | null>(null);

  const bulkImport = trpc.pipeline.bulkImport.useMutation({
    onSuccess: (result) => {
      setImportResult(result);
      if (result.imported > 0) {
        toast.success(`Imported ${result.imported} deals into pipeline`);
        onImported();
      }
      if (result.skipped > 0) {
        toast.error(`${result.skipped} deals failed to import`);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const reset = useCallback(() => {
    setStep(1);
    setCsvHeaders([]);
    setCsvRows([]);
    setMapping({});
    setImportResult(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleParsed = useCallback((headers: string[], rows: string[][]) => {
    setCsvHeaders(headers);
    setCsvRows(rows);
    setMapping(autoMapColumns(headers));
    setStep(2);
  }, []);

  const addressMapped = Object.values(mapping).includes('propertyAddress');

  const handleImport = useCallback(() => {
    // Build deals array from CSV rows using mapping
    const deals: any[] = [];
    for (const row of csvRows) {
      const deal: any = {};
      for (const [header, fieldKey] of Object.entries(mapping)) {
        const colIdx = csvHeaders.indexOf(header);
        if (colIdx < 0) continue;
        const rawVal = row[colIdx]?.trim() || '';
        if (!rawVal) continue;

        const fieldDef = IMPORT_FIELDS.find(f => f.key === fieldKey);
        if (!fieldDef) continue;

        if (fieldDef.type === 'number') {
          const num = parseFloat(rawVal.replace(/[$,\s]/g, ''));
          if (!isNaN(num)) deal[fieldKey] = num;
        } else if (fieldDef.type === 'stage') {
          const normalized = rawVal.toLowerCase().replace(/[\s-]+/g, '_');
          if (VALID_STAGES.includes(normalized)) {
            deal[fieldKey] = normalized;
          }
        } else {
          deal[fieldKey] = rawVal;
        }
      }

      // Skip rows without address
      if (deal.propertyAddress) {
        deals.push(deal);
      }
    }

    if (deals.length === 0) {
      toast.error('No valid deals found. Make sure Property Address is mapped and has values.');
      return;
    }

    bulkImport.mutate({ deals });
  }, [csvRows, csvHeaders, mapping, bulkImport]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-[oklch(0.16_0_0)] border-[oklch(0.3_0_0)] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Upload className="w-4.5 h-4.5 text-[oklch(0.48_0.20_18)]" />
            Import Deals from CSV
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[
            { num: 1, label: 'Upload' },
            { num: 2, label: 'Map Columns' },
            { num: 3, label: 'Preview & Import' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 ${step >= s.num ? 'text-white' : 'text-[oklch(0.4_0_0)]'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step > s.num ? 'bg-[oklch(0.65_0.18_145)] text-white' :
                  step === s.num ? 'bg-[oklch(0.48_0.20_18)] text-white' :
                  'bg-[oklch(0.25_0_0)] text-[oklch(0.5_0_0)]'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px ${step > s.num ? 'bg-[oklch(0.65_0.18_145)]' : 'bg-[oklch(0.25_0_0)]'}`} />}
            </div>
          ))}
        </div>

        {/* Import Result */}
        {importResult ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              {importResult.imported > 0 ? (
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-[oklch(0.65_0.18_145)]" />
              ) : (
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-[oklch(0.65_0.18_18)]" />
              )}
              <h3 className="text-lg font-bold text-white mb-1">Import Complete</h3>
              <p className="text-sm text-[oklch(0.6_0_0)]">
                {importResult.imported} of {importResult.total} deals imported successfully
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[oklch(0.12_0_0)] border border-[oklch(0.22_0_0)] text-center">
                <p className="text-xl font-bold text-[oklch(0.65_0.18_145)]">{importResult.imported}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Imported</p>
              </div>
              <div className="p-3 rounded-lg bg-[oklch(0.12_0_0)] border border-[oklch(0.22_0_0)] text-center">
                <p className="text-xl font-bold text-[oklch(0.65_0.18_18)]">{importResult.skipped}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Failed</p>
              </div>
              <div className="p-3 rounded-lg bg-[oklch(0.12_0_0)] border border-[oklch(0.22_0_0)] text-center">
                <p className="text-xl font-bold text-white">{importResult.total}</p>
                <p className="text-[10px] text-[oklch(0.5_0_0)]">Total</p>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {importResult.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded bg-[oklch(0.12_0_0)] text-xs">
                    <AlertCircle className="w-3 h-3 text-[oklch(0.65_0.18_18)] shrink-0 mt-0.5" />
                    <span className="text-[oklch(0.6_0_0)]">Row {err.row}: {err.address} — {err.error}</span>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button onClick={handleClose} className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            {/* Step Content */}
            {step === 1 && <StepUpload onParsed={handleParsed} />}
            {step === 2 && (
              <StepMapping
                csvHeaders={csvHeaders}
                mapping={mapping}
                onMappingChange={setMapping}
              />
            )}
            {step === 3 && (
              <StepPreview
                csvHeaders={csvHeaders}
                rows={csvRows}
                mapping={mapping}
              />
            )}

            {/* Navigation */}
            <DialogFooter className="gap-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
                  className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-white/5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                </Button>
              )}
              {step === 2 && (
                <Button
                  size="sm"
                  onClick={() => setStep(3)}
                  disabled={!addressMapped}
                  className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                >
                  Preview <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
              {step === 3 && (
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={bulkImport.isPending}
                  className="bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                >
                  {bulkImport.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 mr-1" /> Import {csvRows.filter(r => {
                        const addrIdx = csvHeaders.findIndex(h => mapping[h] === 'propertyAddress');
                        return addrIdx >= 0 && r[addrIdx]?.trim();
                      }).length} Deals
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
