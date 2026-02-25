import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import {
  Building2, Plus, ImagePlus, MapPin, Bed, Bath, Ruler,
  Calendar, DollarSign, Tag, Trash2, Edit, Eye, Share2,
} from 'lucide-react';
import { useState } from 'react';

interface PropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  status: 'active' | 'pending' | 'sold' | 'coming_soon';
  description: string;
  features: string[];
  photos: string[]; // placeholder URLs
  dateAdded: string;
  rehabStatus: string;
}

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800 border-green-300' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  sold: { label: 'Sold', color: 'bg-red-100 text-red-800 border-red-300' },
  coming_soon: { label: 'Coming Soon', color: 'bg-blue-100 text-blue-800 border-blue-300' },
};

const SAMPLE_LISTINGS: PropertyListing[] = [
  {
    id: '1',
    address: '1648 Georgetown Way',
    city: 'Salinas',
    state: 'CA',
    zip: '93906',
    price: 825000,
    beds: 4,
    baths: 2.5,
    sqft: 1652,
    yearBuilt: 1996,
    propertyType: 'Single Family',
    status: 'coming_soon',
    description: 'Beautifully renovated 4-bedroom home in the desirable Creekbridge neighborhood. Features include brand new kitchen with quartz countertops, updated bathrooms, new LVP flooring throughout, fresh interior and exterior paint, and a spacious backyard.',
    features: ['New Kitchen', 'Updated Baths', 'New Flooring', 'Fresh Paint', 'Large Yard', '2-Car Garage'],
    photos: [],
    dateAdded: '2026-02-24',
    rehabStatus: 'In Progress — 60% Complete',
  },
];

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

export default function Listings() {
  const [listings, setListings] = useState<PropertyListing[]>(SAMPLE_LISTINGS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [newListing, setNewListing] = useState<Partial<PropertyListing>>({
    status: 'coming_soon',
    propertyType: 'Single Family',
    features: [],
    photos: [],
  });
  const [newFeature, setNewFeature] = useState('');

  const addListing = () => {
    if (!newListing.address || !newListing.city) return;
    const listing: PropertyListing = {
      id: Date.now().toString(),
      address: newListing.address || '',
      city: newListing.city || '',
      state: newListing.state || '',
      zip: newListing.zip || '',
      price: newListing.price || 0,
      beds: newListing.beds || 3,
      baths: newListing.baths || 2,
      sqft: newListing.sqft || 1500,
      yearBuilt: newListing.yearBuilt || 2000,
      propertyType: newListing.propertyType || 'Single Family',
      status: (newListing.status as PropertyListing['status']) || 'coming_soon',
      description: newListing.description || '',
      features: newListing.features || [],
      photos: [],
      dateAdded: new Date().toISOString().split('T')[0],
      rehabStatus: newListing.rehabStatus || '',
    };
    setListings(prev => [listing, ...prev]);
    setShowAddDialog(false);
    setNewListing({ status: 'coming_soon', propertyType: 'Single Family', features: [], photos: [] });
  };

  const removeListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setNewListing(prev => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
    setNewFeature('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[oklch(0.50_0.18_25)] text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Property Listings</h1>
              <p className="text-sm text-muted-foreground">Market your fix & flip properties for sale</p>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property Listing</DialogTitle>
                <DialogDescription>Enter the property details to create a new listing.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold">Street Address</Label>
                    <Input placeholder="123 Main St" value={newListing.address || ''} onChange={e => setNewListing(p => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">City</Label>
                    <Input placeholder="Salinas" value={newListing.city || ''} onChange={e => setNewListing(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">State</Label>
                      <Input placeholder="CA" value={newListing.state || ''} onChange={e => setNewListing(p => ({ ...p, state: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">ZIP</Label>
                      <Input placeholder="93906" value={newListing.zip || ''} onChange={e => setNewListing(p => ({ ...p, zip: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Asking Price</Label>
                    <Input type="number" placeholder="825000" value={newListing.price || ''} onChange={e => setNewListing(p => ({ ...p, price: Number(e.target.value) }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Beds</Label>
                    <Input type="number" placeholder="4" value={newListing.beds || ''} onChange={e => setNewListing(p => ({ ...p, beds: Number(e.target.value) }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Baths</Label>
                    <Input type="number" step="0.5" placeholder="2.5" value={newListing.baths || ''} onChange={e => setNewListing(p => ({ ...p, baths: Number(e.target.value) }))} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Sqft</Label>
                    <Input type="number" placeholder="1652" value={newListing.sqft || ''} onChange={e => setNewListing(p => ({ ...p, sqft: Number(e.target.value) }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Year Built</Label>
                    <Input type="number" placeholder="1996" value={newListing.yearBuilt || ''} onChange={e => setNewListing(p => ({ ...p, yearBuilt: Number(e.target.value) }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Status</Label>
                    <Select value={newListing.status || 'coming_soon'} onValueChange={val => setNewListing(p => ({ ...p, status: val as PropertyListing['status'] }))}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="coming_soon">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Description</Label>
                  <Textarea rows={3} placeholder="Describe the property..." value={newListing.description || ''} onChange={e => setNewListing(p => ({ ...p, description: e.target.value }))} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Rehab Status</Label>
                  <Input placeholder="e.g., Complete, In Progress — 60%" value={newListing.rehabStatus || ''} onChange={e => setNewListing(p => ({ ...p, rehabStatus: e.target.value }))} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Features</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., New Kitchen" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                    <Button type="button" size="sm" onClick={addFeature}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(newListing.features || []).map((f, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        {f}
                        <button onClick={() => setNewListing(p => ({ ...p, features: (p.features || []).filter((_, idx) => idx !== i) }))} className="ml-1 text-muted-foreground hover:text-foreground">&times;</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={addListing} className="w-full">Add Listing</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Listings', value: listings.length, icon: Building2 },
            { label: 'Active', value: listings.filter(l => l.status === 'active').length, icon: Tag },
            { label: 'Pending', value: listings.filter(l => l.status === 'pending').length, icon: Calendar },
            { label: 'Sold', value: listings.filter(l => l.status === 'sold').length, icon: DollarSign },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <stat.icon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map(listing => (
            <Card key={listing.id} className="overflow-hidden group">
              {/* Photo Section with Placeholders */}
              <div className="relative aspect-[16/10] bg-muted">
                {listing.photos.length > 0 ? (
                  <img src={listing.photos[0]} alt={listing.address} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-muted">
                    <ImagePlus className="w-12 h-12 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground/60">Click to add photos</p>
                    {/* Photo placeholder grid */}
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 h-10 rounded bg-background/30 border border-border/30 flex items-center justify-center">
                          <ImagePlus className="w-3.5 h-3.5 text-muted-foreground/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Status Badge */}
                <Badge className={`absolute top-3 left-3 ${STATUS_CONFIG[listing.status].color}`}>
                  {STATUS_CONFIG[listing.status].label}
                </Badge>
                {/* Price */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <span className="font-bold text-lg">{formatCurrency(listing.price)}</span>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Address */}
                <div>
                  <h3 className="font-bold text-base">{listing.address}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.city}, {listing.state} {listing.zip}
                  </p>
                </div>

                {/* Property Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {listing.beds} bd</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.baths} ba</span>
                  <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {listing.sqft.toLocaleString()} sqft</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {listing.yearBuilt}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2">{listing.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {listing.features.slice(0, 4).map((f, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
                  ))}
                  {listing.features.length > 4 && (
                    <Badge variant="secondary" className="text-[10px]">+{listing.features.length - 4} more</Badge>
                  )}
                </div>

                {/* Rehab Status */}
                {listing.rehabStatus && (
                  <div className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                    Rehab: <span className="font-medium text-foreground">{listing.rehabStatus}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => removeListing(listing.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Listing Card */}
          <Card
            className="overflow-hidden border-dashed border-2 cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => setShowAddDialog(true)}
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-muted-foreground">
              <Plus className="w-12 h-12" />
              <p className="font-semibold">Add New Listing</p>
              <p className="text-xs">List a property for sale</p>
            </div>
          </Card>
        </div>

        {/* Detail View Dialog */}
        {selectedListing && (
          <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedListing.address}</DialogTitle>
                <DialogDescription>
                  {selectedListing.city}, {selectedListing.state} {selectedListing.zip}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {/* Photo Gallery Placeholder */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-4 aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImagePlus className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                      <p className="text-sm text-muted-foreground/50 mt-2">Main Photo — Click to Upload</p>
                    </div>
                  </div>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-2xl">{formatCurrency(selectedListing.price)}</h3>
                    <Badge className={`mt-1 ${STATUS_CONFIG[selectedListing.status].color}`}>
                      {STATUS_CONFIG[selectedListing.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {selectedListing.beds} bd</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {selectedListing.baths} ba</span>
                    <span className="flex items-center gap-1"><Ruler className="w-4 h-4" /> {selectedListing.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedListing.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Features & Upgrades</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedListing.features.map((f, i) => (
                      <Badge key={i} variant="secondary">{f}</Badge>
                    ))}
                  </div>
                </div>

                {selectedListing.rehabStatus && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Rehab Status</h4>
                    <p className="text-sm text-muted-foreground">{selectedListing.rehabStatus}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2"><Share2 className="w-4 h-4" /> Share Listing</Button>
                  <Button variant="outline" className="gap-2"><Edit className="w-4 h-4" /> Edit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
