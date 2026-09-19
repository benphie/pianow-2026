'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  Tag,
  User,
  Music,
  Share2,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BLOG_POSTS, BlogPost } from '@/lib/blog-data'

export default function BlogIndexPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Harmony & Voicings', label: 'Harmony & Voicings' },
    { id: 'Gig Life & Careers', label: 'Gig Life & Careers' },
    { id: 'Gospel & Church', label: 'Gospel & Church' },
    { id: 'Practice & Technique', label: 'Practice & Technique' },
    { id: 'Gear & Tech', label: 'Gear & Tech' }
  ]

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory

    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const featuredPost = BLOG_POSTS[0]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-foreground pb-20">
      {/* Editorial Header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-purple-900/10 via-background to-background py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            PIANOW Musician Journal & Craft Insights
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Chords, Stagecraft, and the Art of Professional Playing
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore in-depth articles written by master gospel pianists, touring keyboardists,
              and educators. Master 2-5-1 voicings, seamless worship transitions, deliberate
              practice routines, and stage gear that never fails.
            </p>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tutorials by title, chord progression, stagecraft, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            Showing <span className="font-bold text-foreground">{filteredPosts.length}</span> articles
          </div>
        </div>

        {/* Spotlight Featured Article (When no query or all selected) */}
        {selectedCategory === 'all' && searchQuery === '' && featuredPost && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-md hover:border-purple-300 dark:hover:border-purple-800 transition">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-700 text-white hover:bg-purple-800">
                    Featured Masterclass
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-purple-600 transition leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Key Takeaways snippet */}
                <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 space-y-1.5">
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                    Quick Takeaways:
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {featuredPost.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {featuredPost.author.role}
                      </div>
                    </div>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold gap-1.5">
                      Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* All Posts Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Recent Articles & Guides
            </h3>
            <Link
              href="/careers"
              className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
            >
              Looking for live gigs? Browse the Gigs Board <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-border">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h4 className="text-lg font-semibold">No articles found</h4>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                We couldn't find any articles matching your search terms. Try searching for "voicings", "gigs", "worship", or "gear".
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Reset Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-border hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-xs hover:shadow-md overflow-hidden group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/70 backdrop-blur-xs text-white border-none text-[11px]">
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 transition leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 pt-0 border-t border-border mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-700 dark:text-purple-400 hover:text-purple-800 text-xs font-semibold p-0 h-auto gap-1"
                      >
                        Read Article <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Musician Growth Box */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-950 via-zinc-900 to-black text-white border border-purple-900/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/60 text-xs font-semibold text-purple-200">
              <Music className="w-3.5 h-3.5" />
              Put Knowledge Into Practice
            </div>
            <h3 className="text-2xl font-bold">
              Ready to turn these chord voicings and routines into real progress?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Log your practice time, measure your tempo progression, or book live 1-on-1
              sessions with certified PIANOW teachers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/lessons/tracker">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5">
                Open Practice Tracker
              </Button>
            </Link>
            <Link href="/teachers">
              <Button variant="outline" className="bg-transparent border-purple-400 text-white hover:bg-white/10 rounded-xl px-5">
                Book an Instructor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
