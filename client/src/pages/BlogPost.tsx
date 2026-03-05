import { trpc } from "@/lib/trpc";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, Clock, ArrowLeft, Tag, Eye, Calendar, Facebook, Loader2 } from 'lucide-react';
import { Streamdown } from 'streamdown';
import { useRoute, Link } from 'wouter';

const CATEGORY_LABELS: Record<string, string> = {
  "market-tips": "Market Tips",
  "market-update": "Market Updates",
  "rehab-strategies": "Rehab Strategies",
  "deal-analysis": "Deal Analysis",
  "financing": "Financing",
  "wholesaling": "Wholesaling",
  "brrrr": "BRRRR Strategy",
  "strategy": "Investment Strategy",
  "how-to": "How-To Guides",
  "legal": "Legal",
  "general": "General",
};

const categoryColors: Record<string, string> = {
  'market-update': 'bg-blue-100 text-blue-800',
  'market-tips': 'bg-blue-100 text-blue-800',
  'strategy': 'bg-green-100 text-green-800',
  'rehab-strategies': 'bg-green-100 text-green-800',
  'how-to': 'bg-amber-100 text-amber-800',
  'deal-analysis': 'bg-amber-100 text-amber-800',
  'financing': 'bg-purple-100 text-purple-800',
  'wholesaling': 'bg-teal-100 text-teal-800',
  'brrrr': 'bg-indigo-100 text-indigo-800',
  'legal': 'bg-red-100 text-red-800',
  'general': 'bg-gray-100 text-gray-800',
};

function shareToFacebook(title: string, url: string) {
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  window.open(fbUrl, '_blank', 'width=600,height=400');
}

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.48_0.20_18)]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16 text-center">
          <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">This blog post doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const postUrl = `${window.location.origin}/blog/${post.slug}`;
  const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1200)) + ' min';
  const tags = post.tags ? post.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-3xl">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-4 gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
        </Link>

        <article>
          {/* Cover image */}
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Meta */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={categoryColors[post.category] || 'bg-gray-100 text-gray-800'}>
                {CATEGORY_LABELS[post.category] || post.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {readTime} read
              </span>
              {post.publishedAt && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {post.viewCount} views
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">{post.title}</h1>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            )}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => shareToFacebook(post.title, postUrl)}
              >
                <Facebook className="w-4 h-4 text-blue-600" /> Share to Facebook
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1.5 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:bg-secondary/60 [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50 [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
            <Streamdown>{post.content || ''}</Streamdown>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-border flex flex-wrap gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {/* AI generated notice */}
          {post.aiGenerated === 1 && (
            <p className="mt-4 text-xs text-muted-foreground italic">
              This article was generated with AI assistance and reviewed by the Freedom One team.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
