import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Newspaper, Plus, Pencil, Trash2, Eye, Sparkles, Loader2,
  Calendar, ArrowLeft, Send, Clock, CheckCircle2, XCircle, FileText
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'wouter';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  scheduled: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const STATUS_ICONS: Record<string, typeof FileText> = {
  draft: FileText,
  scheduled: Clock,
  published: CheckCircle2,
  rejected: XCircle,
};

const CATEGORIES = [
  { value: "market-tips", label: "Market Tips" },
  { value: "rehab-strategies", label: "Rehab Strategies" },
  { value: "deal-analysis", label: "Deal Analysis" },
  { value: "financing", label: "Financing" },
  { value: "wholesaling", label: "Wholesaling" },
  { value: "brrrr", label: "BRRRR Strategy" },
  { value: "general", label: "General" },
];

interface PostForm {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImageUrl: string;
  status: "draft" | "scheduled" | "published" | "rejected";
}

const emptyForm: PostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'general',
  tags: '',
  coverImageUrl: '',
  status: 'draft',
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminBlog() {
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editing, setEditing] = useState<PostForm | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genCategory, setGenCategory] = useState('general');
  const [page, setPage] = useState(0);
  const limit = 20;

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.blog.adminList.useQuery({
    limit,
    offset: page * limit,
    status: statusFilter === 'all' ? undefined : statusFilter as any,
  });

  const upsertMutation = trpc.blog.upsert.useMutation({
    onSuccess: () => {
      toast.success(editing?.id ? 'Post updated' : 'Post created');
      setEditing(null);
      utils.blog.adminList.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success('Post deleted');
      utils.blog.adminList.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const generateMutation = trpc.blog.generate.useMutation({
    onSuccess: (data) => {
      toast.success('AI post generated as draft');
      setGenerating(false);
      setGenTopic('');
      utils.blog.adminList.invalidate();
    },
    onError: (err) => {
      toast.error('Generation failed: ' + err.message);
      setGenerating(false);
    },
  });

  // Auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.48_0.20_18)]" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to manage blog posts.</p>
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Edit form
  if (editing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 max-w-3xl">
          <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => setEditing(null)}>
            <ArrowLeft className="w-4 h-4" /> Back to Posts
          </Button>
          <h1 className="text-2xl font-bold mb-6">{editing.id ? 'Edit Post' : 'New Post'}</h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
                placeholder="Post title"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="url-friendly-slug"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Excerpt</label>
              <Textarea
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                placeholder="Brief summary for preview cards (1-2 sentences)"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Content (Markdown)</label>
              <Textarea
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                placeholder="Write your blog post in Markdown..."
                rows={16}
                className="font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
              <Input
                value={editing.tags}
                onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                placeholder="fix-and-flip, investing, rehab"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Cover Image URL</label>
              <Input
                value={editing.coverImageUrl}
                onChange={(e) => setEditing({ ...editing, coverImageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="gap-2 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                disabled={upsertMutation.isPending || !editing.title || !editing.content}
                onClick={() => {
                  upsertMutation.mutate({
                    id: editing.id,
                    title: editing.title,
                    slug: editing.slug || slugify(editing.title),
                    excerpt: editing.excerpt || undefined,
                    content: editing.content,
                    category: editing.category,
                    tags: editing.tags || undefined,
                    coverImageUrl: editing.coverImageUrl || undefined,
                    status: editing.status,
                  });
                }}
              >
                {upsertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {editing.status === 'published' ? 'Publish' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
                <Newspaper className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Blog Manager</h1>
                <p className="text-sm text-[oklch(0.55_0_0)]">
                  {data ? `${data.total} total posts` : 'Loading...'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/blog">
                <Button variant="outline" size="sm" className="gap-1.5 border-white/20 text-white hover:bg-white/10">
                  <Eye className="w-4 h-4" /> View Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-6">
        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2">
            {['all', 'draft', 'published', 'scheduled'].map(s => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={statusFilter === s ? "bg-[oklch(0.48_0.20_18)] text-white" : ""}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
              onClick={() => setEditing({ ...emptyForm })}
            >
              <Plus className="w-4 h-4" /> New Post
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Blog Post with AI</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Topic (optional)</label>
                    <Input
                      value={genTopic}
                      onChange={(e) => setGenTopic(e.target.value)}
                      placeholder="e.g., How to find off-market deals in 2026"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={genCategory} onValueChange={setGenCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                      disabled={generating}
                      onClick={() => {
                        setGenerating(true);
                        generateMutation.mutate({
                          topic: genTopic || undefined,
                          category: genCategory as any,
                        });
                      }}
                    >
                      {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.48_0.20_18)]" />
          </div>
        )}

        {/* Posts table */}
        {data && data.posts.length > 0 && (
          <>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="text-left p-3 font-medium">Title</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Views</th>
                    <th className="text-left p-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.posts.map((post) => {
                    const StatusIcon = STATUS_ICONS[post.status] || FileText;
                    return (
                      <tr key={post.id} className="border-t hover:bg-secondary/20">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {post.aiGenerated === 1 && (
                              <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            )}
                            <span className="font-medium line-clamp-1">{post.title}</span>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span className="text-muted-foreground text-xs">
                            {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge className={`text-xs ${STATUS_COLORS[post.status] || ''}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {post.status}
                          </Badge>
                        </td>
                        <td className="p-3 hidden md:table-cell text-muted-foreground">
                          {post.viewCount}
                        </td>
                        <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            {post.status === 'published' && (
                              <Link href={`/blog/${post.slug}`}>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => setEditing({
                                id: post.id,
                                title: post.title,
                                slug: post.slug,
                                excerpt: post.excerpt || '',
                                content: post.content || '',
                                category: post.category,
                                tags: post.tags || '',
                                coverImageUrl: post.coverImageUrl || '',
                                status: post.status as any,
                              })}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                              onClick={() => {
                                if (confirm('Delete this post?')) {
                                  deleteMutation.mutate({ id: post.id });
                                }
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.total > limit && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="flex items-center text-sm text-muted-foreground px-3">
                  Page {page + 1} of {Math.ceil(data.total / limit)}
                </span>
                <Button variant="outline" size="sm" disabled={(page + 1) * limit >= data.total} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {data && data.posts.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No Posts Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first blog post or use AI to generate one automatically.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                className="gap-1.5 bg-[oklch(0.48_0.20_18)] hover:bg-[oklch(0.42_0.20_18)] text-white"
                onClick={() => setEditing({ ...emptyForm })}
              >
                <Plus className="w-4 h-4" /> Write a Post
              </Button>
            </div>
          </div>
        )}

        {/* Generating indicator */}
        {generating && (
          <div className="fixed bottom-6 right-6 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[oklch(0.48_0.20_18)]" />
            <span className="text-sm font-medium">Generating blog post with AI...</span>
          </div>
        )}
      </div>
    </div>
  );
}
