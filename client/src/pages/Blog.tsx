import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { Newspaper, Clock, ArrowLeft, Tag } from 'lucide-react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const activePost = BLOG_POSTS.find(p => p.id === activePostId);

  const categoryColors: Record<string, string> = {
    'market-update': 'bg-blue-100 text-blue-800',
    'strategy': 'bg-green-100 text-green-800',
    'how-to': 'bg-amber-100 text-amber-800',
    'financing': 'bg-purple-100 text-purple-800',
    'legal': 'bg-red-100 text-red-800',
  };

  if (activePost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8 max-w-3xl">
          <Button variant="ghost" size="sm" className="mb-4 gap-1.5" onClick={() => setActivePostId(null)}>
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
          <article>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={categoryColors[activePost.category] || 'bg-gray-100 text-gray-800'}>
                  {activePost.category.replace('-', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activePost.readTime} read
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(activePost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">{activePost.title}</h1>
              <p className="text-lg text-muted-foreground">{activePost.excerpt}</p>
            </div>
            <div className="prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1.5 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:bg-secondary/60 [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50 [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
              <Streamdown>{activePost.content}</Streamdown>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex flex-wrap gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {activePost.tags.map(tag => (
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
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[oklch(0.92_0.06_250)]">
              <Newspaper className="w-6 h-6 text-[oklch(0.5_0.12_250)]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Investor Blog</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Educational articles, market updates, and investment strategies to help you make smarter real estate decisions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {BLOG_CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              size="sm"
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post: BlogPost) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setActivePostId(post.id)}
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
                <CardTitle className="text-base group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
