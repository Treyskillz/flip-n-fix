import { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import {
  Camera, Upload, Paintbrush, Loader2, ExternalLink, DollarSign,
  Hammer, Sparkles, Crown, ChevronRight, ArrowRight, ImageIcon, Info, Calculator
} from 'lucide-react';
import {
  getDefaultRoomScopes,
  calculateRoomCost,
  type MaterialTier,
  type HomeDepotProduct,
} from '@/lib/scopeOfWork';

const ROOM_OPTIONS = [
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'master_bath', label: 'Master Bathroom', icon: '🛁' },
  { id: 'full_bath', label: 'Full Bathroom', icon: '🚿' },
  { id: 'half_bath', label: 'Half Bath', icon: '🚽' },
  { id: 'living_room', label: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'landscaping', label: 'Landscaping & Exterior', icon: '🌿' },
  { id: 'garage', label: 'Garage', icon: '🚗' },
];

const TIER_CONFIG: Record<MaterialTier, { label: string; icon: typeof Hammer; color: string; bgColor: string; description: string }> = {
  rental: {
    label: 'Rental Grade',
    icon: Hammer,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Budget-friendly, functional finishes. Builder-grade materials, basic appliances, laminate counters.',
  },
  standard: {
    label: 'Standard',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    description: 'Mid-range finishes popular with homebuyers. Quartz counters, stainless appliances, shaker cabinets.',
  },
  luxury: {
    label: 'Luxury',
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    description: 'High-end finishes for premium markets. Natural stone, custom cabinets, professional appliances.',
  },
};

interface DesignResult {
  tier: MaterialTier;
  imageUrl: string;
  materials: Array<{
    item: string;
    material: string;
    materialCost: number;
    laborCost: number;
    qty: number;
    product?: HomeDepotProduct;
  }>;
  totalMaterials: number;
  totalLabor: number;
  totalCost: number;
}

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function RenovationDesigner() {
  const [selectedRoom, setSelectedRoom] = useState('kitchen');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [designs, setDesigns] = useState<DesignResult[]>([]);
  const [generatingTier, setGeneratingTier] = useState<MaterialTier | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const uploadMutation = trpc.renovation.uploadRoomPhoto.useMutation();
  const generateMutation = trpc.renovation.generateDesign.useMutation();

  // Get materials for each tier from the SOW database
  const roomMaterials = useMemo(() => {
    const rooms = getDefaultRoomScopes();
    const room = rooms.find(r => r.id === selectedRoom);
    if (!room) return { rental: null, standard: null, luxury: null };

    // Force condition to 'full' to show all materials
    const fullRoom = { ...room, condition: 'full' as const, enabled: true };

    const tiers: Record<MaterialTier, ReturnType<typeof calculateRoomCost> | null> = {
      rental: calculateRoomCost(fullRoom, 'rental', 1500, 2, 3, 1.0, 1.0),
      standard: calculateRoomCost(fullRoom, 'standard', 1500, 2, 3, 1.0, 1.0),
      luxury: calculateRoomCost(fullRoom, 'luxury', 1500, 2, 3, 1.0, 1.0),
    };
    return tiers;
  }, [selectedRoom]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    setIsUploading(true);
    setDesigns([]);
    setSelectedDesign(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedPreview(ev.target?.result as string);
      reader.readAsDataURL(file);

      // Upload to S3
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const result = await uploadMutation.mutateAsync({
        base64,
        filename: file.name,
        mimeType: file.type,
      });

      setUploadedImageUrl(result.url);
      toast.success('Photo uploaded! Select a design tier to generate a renovation concept.');
    } catch (err) {
      toast.error('Failed to upload photo. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }, [uploadMutation]);

  const handleGenerateDesign = useCallback(async (tier: MaterialTier) => {
    if (!uploadedImageUrl) {
      toast.error('Please upload a room photo first.');
      return;
    }

    setGeneratingTier(tier);

    try {
      const result = await generateMutation.mutateAsync({
        roomType: ROOM_OPTIONS.find(r => r.id === selectedRoom)?.label || selectedRoom,
        tier,
        imageUrl: uploadedImageUrl,
      });

      const materials = roomMaterials[tier];
      const newDesign: DesignResult = {
        tier,
        imageUrl: result.imageUrl,
        materials: materials?.itemBreakdown || [],
        totalMaterials: materials?.totalMaterials || 0,
        totalLabor: materials?.totalLabor || 0,
        totalCost: materials?.totalCost || 0,
      };

      setDesigns(prev => {
        const filtered = prev.filter(d => d.tier !== tier);
        return [...filtered, newDesign].sort((a, b) => {
          const order: MaterialTier[] = ['rental', 'standard', 'luxury'];
          return order.indexOf(a.tier) - order.indexOf(b.tier);
        });
      });

      setSelectedDesign(newDesign);
      toast.success(`${TIER_CONFIG[tier].label} design generated!`);
    } catch (err) {
      toast.error('Failed to generate design. Please try again.');
      console.error(err);
    } finally {
      setGeneratingTier(null);
    }
  }, [uploadedImageUrl, selectedRoom, generateMutation, roomMaterials]);

  const handleGenerateAll = useCallback(async () => {
    if (!uploadedImageUrl) {
      toast.error('Please upload a room photo first.');
      return;
    }

    for (const tier of ['rental', 'standard', 'luxury'] as MaterialTier[]) {
      await handleGenerateDesign(tier);
    }
  }, [uploadedImageUrl, handleGenerateDesign]);

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/10">
            <Paintbrush className="w-6 h-6 text-[oklch(0.48_0.20_18)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Room Renovation Designer</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Upload a photo of any room and see AI-generated renovation concepts across three material tiers.
          Each design includes Home Depot SKU numbers, material costs, and labor estimates.
        </p>
      </div>

      {/* Step 1: Room Type & Photo Upload */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Room Selection & Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Camera className="w-5 h-5" />
              Step 1: Upload Room Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Room Type</label>
              <Select value={selectedRoom} onValueChange={(v) => { setSelectedRoom(v); setDesigns([]); setSelectedDesign(null); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_OPTIONS.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.icon} {room.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full h-32 border-dashed border-2 flex-col gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload or take a photo
                    </span>
                    <span className="text-xs text-muted-foreground/70">JPG, PNG up to 10MB</span>
                  </>
                )}
              </Button>
            </div>

            {uploadedPreview && (
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={uploadedPreview}
                  alt="Uploaded room"
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                  Current Room
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Tier Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Paintbrush className="w-5 h-5" />
              Step 2: Choose Design Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(TIER_CONFIG) as [MaterialTier, typeof TIER_CONFIG[MaterialTier]][]).map(([tier, config]) => {
              const TierIcon = config.icon;
              const materials = roomMaterials[tier];
              const isGenerating = generatingTier === tier;
              const hasDesign = designs.some(d => d.tier === tier);

              return (
                <button
                  key={tier}
                  onClick={() => handleGenerateDesign(tier)}
                  disabled={!uploadedImageUrl || isGenerating || generatingTier !== null}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    hasDesign ? config.bgColor : 'hover:bg-muted/50'
                  } ${!uploadedImageUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TierIcon className={`w-5 h-5 ${config.color}`} />
                      <div>
                        <div className="font-semibold text-sm">{config.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{config.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {materials && (
                        <span className="text-sm font-medium">{formatCurrency(materials.totalCost)}</span>
                      )}
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : hasDesign ? (
                        <Badge variant="secondary" className="text-xs">Done</Badge>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="pt-2">
              <Button
                onClick={handleGenerateAll}
                disabled={!uploadedImageUrl || generatingTier !== null}
                className="w-full gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              >
                <Sparkles className="w-4 h-4" />
                Generate All 3 Designs
                {generatingTier && <Loader2 className="w-4 h-4 animate-spin" />}
              </Button>
            </div>

            {!uploadedImageUrl && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <Info className="w-4 h-4 shrink-0" />
                Upload a room photo first to enable design generation.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Design Results */}
      {designs.length > 0 && (
        <div className="space-y-6">
          {/* Before/After Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="w-5 h-5" />
                Design Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Original */}
                {uploadedPreview && (
                  <div className="space-y-1.5">
                    <div className="relative rounded-lg overflow-hidden border aspect-[4/3]">
                      <img src={uploadedPreview} alt="Original" className="w-full h-full object-cover" />
                      <Badge className="absolute top-1.5 left-1.5 bg-black/70 text-white text-xs">Before</Badge>
                    </div>
                    <p className="text-xs text-center text-muted-foreground font-medium">Current</p>
                  </div>
                )}

                {/* Generated Designs */}
                {designs.map(design => {
                  const config = TIER_CONFIG[design.tier];
                  const isSelected = selectedDesign?.tier === design.tier;
                  return (
                    <button
                      key={design.tier}
                      onClick={() => setSelectedDesign(design)}
                      className={`space-y-1.5 text-left ${isSelected ? '' : 'opacity-80 hover:opacity-100'}`}
                    >
                      <div className={`relative rounded-lg overflow-hidden border-2 aspect-[4/3] transition-all ${
                        isSelected ? 'border-[oklch(0.48_0.20_18)] shadow-md' : 'border-transparent'
                      }`}>
                        <img src={design.imageUrl} alt={config.label} className="w-full h-full object-cover" />
                        <Badge className={`absolute top-1.5 left-1.5 text-xs ${
                          design.tier === 'rental' ? 'bg-blue-600' :
                          design.tier === 'standard' ? 'bg-amber-600' : 'bg-purple-600'
                        } text-white`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-center font-medium">
                        {formatCurrency(design.totalCost)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Design Materials */}
          {selectedDesign && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5" />
                    {TIER_CONFIG[selectedDesign.tier].label} — Material List & SKUs
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Materials: <strong>{formatCurrency(selectedDesign.totalMaterials)}</strong></span>
                    <span>Labor: <strong>{formatCurrency(selectedDesign.totalLabor)}</strong></span>
                    <Badge className="bg-[oklch(0.48_0.20_18)] text-white text-sm px-3 py-1">
                      Total: {formatCurrency(selectedDesign.totalCost)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-semibold">Item</th>
                        <th className="pb-2 font-semibold">Material / Product</th>
                        <th className="pb-2 font-semibold text-center">Qty</th>
                        <th className="pb-2 font-semibold text-right">Material $</th>
                        <th className="pb-2 font-semibold text-right">Labor $</th>
                        <th className="pb-2 font-semibold text-right">Total</th>
                        <th className="pb-2 font-semibold text-center">SKU / Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDesign.materials.map((mat, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2.5 font-medium">{mat.item}</td>
                          <td className="py-2.5 text-muted-foreground">
                            <div>{mat.material}</div>
                            {mat.product && (
                              <div className="text-xs text-muted-foreground/70 mt-0.5">
                                {mat.product.name} — {mat.product.price}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 text-center">{mat.qty}</td>
                          <td className="py-2.5 text-right">{formatCurrency(mat.materialCost)}</td>
                          <td className="py-2.5 text-right">{formatCurrency(mat.laborCost)}</td>
                          <td className="py-2.5 text-right font-medium">{formatCurrency(mat.materialCost + mat.laborCost)}</td>
                          <td className="py-2.5 text-center">
                            {mat.product ? (
                              <a
                                href={mat.product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[oklch(0.48_0.20_18)] hover:underline"
                              >
                                {mat.product.sku}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-bold">
                        <td className="pt-3" colSpan={3}>TOTAL</td>
                        <td className="pt-3 text-right">{formatCurrency(selectedDesign.totalMaterials)}</td>
                        <td className="pt-3 text-right">{formatCurrency(selectedDesign.totalLabor)}</td>
                        <td className="pt-3 text-right text-[oklch(0.48_0.20_18)]">{formatCurrency(selectedDesign.totalCost)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                  <strong>Note:</strong> Costs are estimates based on a 1,500 sqft home with national average pricing.
                  Actual costs vary by region, contractor, and project specifics. SKU links go to Home Depot product pages.
                  AI-generated design images are conceptual renderings — actual results will depend on your contractor and materials selected.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Side-by-side cost comparison */}
          {designs.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Comparison Across Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {designs.map(design => {
                    const config = TIER_CONFIG[design.tier];
                    const TierIcon = config.icon;
                    return (
                      <div key={design.tier} className={`p-4 rounded-lg border ${config.bgColor}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <TierIcon className={`w-5 h-5 ${config.color}`} />
                          <span className="font-bold">{config.label}</span>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Materials</span>
                            <span className="font-medium">{formatCurrency(design.totalMaterials)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Labor</span>
                            <span className="font-medium">{formatCurrency(design.totalLabor)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-1.5 font-bold">
                            <span>Total</span>
                            <span className={config.color}>{formatCurrency(design.totalCost)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1"
                            onClick={() => setSelectedDesign(design)}
                          >
                            View Materials <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 gap-1 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                            onClick={() => {
                              const payload = {
                                roomId: selectedRoom,
                                tier: design.tier,
                                totalCost: design.totalCost,
                                totalMaterials: design.totalMaterials,
                                totalLabor: design.totalLabor,
                                timestamp: Date.now(),
                              };
                              localStorage.setItem('renovation-to-analyzer', JSON.stringify(payload));
                              toast.success(`${TIER_CONFIG[design.tier].label} design applied! Redirecting to Analyzer...`);
                              setTimeout(() => navigate('/analyzer'), 500);
                            }}
                          >
                            <Calculator className="w-3.5 h-3.5" /> Apply to Analyzer
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
