import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { Newspaper, Clock, ArrowLeft, Tag, Eye, Calendar, Share2, Facebook } from 'lucide-react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';
import { useRoute } from 'wouter';
import { Link } from 'wouter';

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

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStaticPostId, setActiveStaticPostId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 12;

  // Fetch database posts
  const { data: dbData, isLoading: dbLoading } = trpc.blog.list.useQuery({
    limit,
    offset: page * limit,
    category: activeCategory === 'all' ? undefined : activeCategory,
  });

  const { data: dbCategories } = trpc.blog.categories.useQuery();

  // Merge static + DB categories
  const allCategories: Array<{ id: string; label: string }> = BLOG_CATEGORIES.map(c => ({ id: c.id, label: c.label }));
  if (dbCategories) {
    for (const cat of dbCategories) {
      if (!allCategories.find(c => c.id === cat.category)) {
        allCategories.push({ id: cat.category, label: CATEGORY_LABELS[cat.category] || cat.category });
      }
    }
  }

  // Filter static posts by category
  const filteredStatic = activeCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const activeStaticPost = BLOG_POSTS.find(p => p.id === activeStaticPostId);

  // Show static post detail
  if (activeStaticPost) {
    const postUrl = `${window.location.origin}/blog`;
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 max-w-3xl">
          <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => setActiveStaticPostId(null)}>
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
          <article>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={categoryColors[activeStaticPost.category] || 'bg-gray-100 text-gray-800'}>
                  {activeStaticPost.category.replace('-', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeStaticPost.readTime} read
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(activeStaticPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">{activeStaticPost.title}</h1>
              <p className="text-lg text-muted-foreground">{activeStaticPost.excerpt}</p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => shareToFacebook(activeStaticPost.title, postUrl)}
                >
                  <Facebook className="w-4 h-4 text-blue-600" /> Share to Facebook
                </Button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1.5 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:bg-secondary/60 [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50 [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
              <Streamdown>{activeStaticPost.content}</Streamdown>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex flex-wrap gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {activeStaticPost.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[oklch(0.15_0_0)] border-b border-[oklch(0.25_0_0)]">
        <div className="container py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[oklch(0.48_0.20_18)]/15">
              <Newspaper className="w-6 h-6 text-[oklch(0.65_0.18_18)]" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Freedom One Blog</h1>
          </div>
          <p className="text-[oklch(0.6_0_0)] max-w-2xl">
            Free real estate investing tips, rehab strategies, deal analysis walkthroughs, and market insights — updated weekly.
          </p>
        </div>
      </section>

      <div className="container py-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allCategories.map(cat => (
            <Button
              key={cat.id}
              size="sm"
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              onClick={() => { setActiveCategory(cat.id); setPage(0); }}
              className={activeCategory === cat.id ? "bg-[oklch(0.48_0.20_18)] text-white" : ""}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* DB Posts */}
        {dbData && dbData.posts.length > 0 && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {dbData.posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-0">
                      {post.coverImageUrl ? (
                        <img src={post.coverImageUrl} alt={post.title} className="w-full h-44 object-cover rounded-t-lg" />
                      ) : (
                        <div className="w-full h-44 bg-gradient-to-br from-[oklch(0.48_0.20_18)]/20 to-[oklch(0.48_0.20_18)]/5 flex items-center justify-center rounded-t-lg">
                          <Newspaper className="w-10 h-10 text-[oklch(0.48_0.20_18)]/40" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                            {CATEGORY_LABELS[post.category] || post.category}
                          </Badge>
                          {post.publishedAt && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base mb-2 group-hover:text-[oklch(0.48_0.20_18)] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {post.viewCount} views
                          </span>
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            shareToFacebook(post.title, `${window.location.origin}/blog/${post.slug}`);
                          }}>
                            <Facebook className="w-3.5 h-3.5 text-blue-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {/* Pagination for DB posts */}
            {dbData.total > limit && (
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="flex items-center text-sm text-muted-foreground px-3">
                  Page {page + 1} of {Math.ceil(dbData.total / limit)}
                </span>
                <Button variant="outline" size="sm" disabled={(page + 1) * limit >= dbData.total} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </div>
        )}

        {/* Static Posts (built-in content) */}
        {filteredStatic.length > 0 && (
          <>
            {dbData && dbData.posts.length > 0 && (
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Featured Articles</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStatic.map((post: BlogPost) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setActiveStaticPostId(post.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
                        {post.category.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-base group-hover:text-[oklch(0.48_0.20_18)] transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => {
                        e.stopPropagation();
                        shareToFacebook(post.title, window.location.href);
                      }}>
                        <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
