import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Camera, Upload, X, Trash2, Image as ImageIcon, ChevronLeft,
  ChevronRight, Loader2, Edit2, Check, Plus
} from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  fileKey: string;
  filename: string | null;
  mimeType: string | null;
  caption: string | null;
  sortOrder: number;
}

interface Props {
  dealUniqueId: string;
  readOnly?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export function PropertyPhotoGallery({ dealUniqueId, readOnly = false }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [editingCaption, setEditingCaption] = useState<number | null>(null);
  const [captionText, setCaptionText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: photos = [], refetch } = trpc.photos.list.useQuery(
    { dealUniqueId },
    { enabled: !!dealUniqueId }
  );

  const uploadMutation = trpc.photos.upload.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Photo uploaded successfully');
    },
    onError: (err) => {
      toast.error(`Upload failed: ${err.message}`);
    },
  });

  const deleteMutation = trpc.photos.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Photo deleted');
    },
    onError: () => {
      toast.error('Failed to delete photo');
    },
  });

  const captionMutation = trpc.photos.updateCaption.useMutation({
    onSuccess: () => {
      refetch();
      setEditingCaption(null);
    },
  });

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Unsupported file type. Use JPEG, PNG, or WebP.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        await uploadMutation.mutateAsync({
          dealUniqueId,
          base64,
          filename: file.name,
          mimeType: file.type,
        });
      } catch {
        // error handled by mutation
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [dealUniqueId, uploadMutation]);

  const handleDelete = (photoId: number) => {
    if (confirm('Delete this photo?')) {
      deleteMutation.mutate({ id: photoId });
    }
  };

  const handleCaptionSave = (photoId: number) => {
    captionMutation.mutate({ id: photoId, caption: captionText });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (dir: 1 | -1) => {
    setLightboxIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
            Property Photos
            {photos.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">({photos.length})</span>
            )}
          </CardTitle>
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {uploading ? 'Uploading...' : 'Add Photos'}
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {readOnly ? (
              <p className="text-sm">No property photos available</p>
            ) : (
              <div
                className="border-2 border-dashed border-border/60 rounded-lg p-8 cursor-pointer hover:border-[oklch(0.50_0.18_25)]/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium mb-1">Upload property photos</p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, or WebP up to 10MB each. Photos appear in shared links and PDF reports.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div key={photo.id} className="group relative">
                <div
                  className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary/40 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.filename || 'Property photo'}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Caption */}
                {editingCaption === photo.id ? (
                  <div className="flex gap-1 mt-1">
                    <Input
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      placeholder="Add caption..."
                      className="h-6 text-[10px]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCaptionSave(photo.id);
                        if (e.key === 'Escape') setEditingCaption(null);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCaptionSave(photo.id)}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <p
                    className="text-[10px] text-muted-foreground mt-1 truncate cursor-pointer hover:text-foreground"
                    onClick={(e) => {
                      if (readOnly) return;
                      e.stopPropagation();
                      setEditingCaption(photo.id);
                      setCaptionText(photo.caption || '');
                    }}
                    title={photo.caption || 'Click to add caption'}
                  >
                    {photo.caption || (readOnly ? '' : 'Click to add caption')}
                  </p>
                )}

                {/* Delete button */}
                {!readOnly && (
                  <button
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {/* Add more button */}
            {!readOnly && (
              <div
                className="aspect-[4/3] rounded-lg border-2 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-[oklch(0.50_0.18_25)]/40 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto text-muted-foreground/40 mb-1" />
                  <p className="text-[10px] text-muted-foreground">Add More</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo Viewer</DialogTitle>
            <DialogDescription>View property photos</DialogDescription>
          </DialogHeader>
          {photos[lightboxIndex] && (
            <div className="relative">
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption || 'Property photo'}
                className="w-full max-h-[80vh] object-contain"
              />

              {/* Navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                    onClick={() => navigateLightbox(-1)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                    onClick={() => navigateLightbox(1)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Caption & Counter */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm">
                    {photos[lightboxIndex].caption || photos[lightboxIndex].filename || ''}
                  </p>
                  <p className="text-white/60 text-xs">
                    {lightboxIndex + 1} / {photos.length}
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Read-only gallery for shared deal views
export function PhotoGalleryReadOnly({ photos }: { photos: { url: string; caption?: string | null }[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="w-4 h-4 text-[oklch(0.50_0.18_25)]" />
          Property Photos ({photos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="group relative">
              <div
                className="aspect-[4/3] rounded-lg overflow-hidden bg-secondary/40 cursor-pointer"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Property photo'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {photo.caption && (
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Photo Viewer</DialogTitle>
            <DialogDescription>View property photos</DialogDescription>
          </DialogHeader>
          {photos[lightboxIndex] && (
            <div className="relative">
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption || 'Property photo'}
                className="w-full max-h-[80vh] object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                    onClick={() => setLightboxIndex((p) => (p - 1 + photos.length) % photos.length)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                    onClick={() => setLightboxIndex((p) => (p + 1) % photos.length)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm">{photos[lightboxIndex].caption || ''}</p>
                  <p className="text-white/60 text-xs">{lightboxIndex + 1} / {photos.length}</p>
                </div>
              </div>
              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Helper: file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
