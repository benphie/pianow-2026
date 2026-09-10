'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Heart,
  CheckCircle2,
  Music,
  Send,
  Sparkles,
  BookOpen,
  Briefcase,
  ChevronRight,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { BLOG_POSTS, BlogPost } from '@/lib/blog-data'

interface Comment {
  id: string
  name: string
  text: string
  date: string
}

export default function BlogPostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const slug = params?.slug as string
  const post = BLOG_POSTS.find((p) => p.slug === slug)

  // Engagement state
  const [likes, setLikes] = useState(24)
  const [hasLiked, setHasLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Comments state
  const [comments, setComments] = useState<Comment[]>([])
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    if (!slug) return

    // Pre-fill user name if logged in
    if (user?.name) {
      setCommentName(user.name)
    }

    try {
      const storedLikes = localStorage.getItem(`pianow_blog_liked_${slug}`)
      if (storedLikes) {
        setHasLiked(true)
        setLikes((prev) => prev + 1)
      }

      const storedBookmark = localStorage.getItem(`pianow_blog_bookmarked_${slug}`)
      if (storedBookmark) {
        setIsBookmarked(true)
      }

      const storedComments = localStorage.getItem(`pianow_blog_comments_${slug}`)
      if (storedComments) {
        setComments(JSON.parse(storedComments))
      } else {
        // Initial sample comments
        const initialSample: Comment[] = [
          {
            id: 'c1',
            name: 'Michael T.',
            text: 'This voicing breakdown completely fixed the clash I was having with our church bass player! The minor 11th chord tip is pure gold.',
            date: '2 days ago'
          },
          {
            id: 'c2',
            name: 'Grace A.',
            text: 'Practiced this with a metronome at 65 BPM today. The voice leading into the altered dominant is so smooth.',
            date: 'Yesterday'
          }
        ]
        setComments(initialSample)
      }
    } catch (e) {
      console.warn('Could not load blog interaction data', e)
    }
  }, [slug, user])

  const handleLike = () => {
    if (hasLiked) {
      setLikes((l) => l - 1)
      setHasLiked(false)
      try {
        localStorage.removeItem(`pianow_blog_liked_${slug}`)
      } catch (e) {}
    } else {
      setLikes((l) => l + 1)
      setHasLiked(true)
      try {
        localStorage.setItem(`pianow_blog_liked_${slug}`, 'true')
      } catch (e) {}
      toast({
        title: 'Thank you for your feedback!',
        description: 'You liked this article.'
      })
    }
  }

  const handleBookmark = () => {
    const next = !isBookmarked
    setIsBookmarked(next)
    try {
      if (next) {
        localStorage.setItem(`pianow_blog_bookmarked_${slug}`, 'true')
        toast({
          title: 'Article Bookmarked',
          description: 'Saved to your reading list on this device.'
        })
      } else {
        localStorage.removeItem(`pianow_blog_bookmarked_${slug}`)
      }
    } catch (e) {}
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link Copied to Clipboard!',
        description: 'Share this tutorial with fellow bandmates and musicians.'
      })
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentName.trim() || !commentText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter your name and comment.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmittingComment(true)
    setTimeout(() => {
      const newComment: Comment = {
        id: `com-${Date.now()}`,
        name: commentName.trim(),
        text: commentText.trim(),
        date: 'Just now'
      }
      const updated = [newComment, ...comments]
      setComments(updated)
      try {
        localStorage.setItem(
          `pianow_blog_comments_${slug}`,
          JSON.stringify(updated)
        )
      } catch (e) {}

      setIsSubmittingComment(false)
      setCommentText('')
      toast({
        title: 'Comment posted!',
        description: 'Thank you for contributing to the musician discussion.'
      })
    }, 400)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground opacity-40 mb-4" />
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
          The requested article may have moved or does not exist.
        </p>
        <Link href="/blog">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl">
            Back to All Articles
          </Button>
        </Link>
      </div>
    )
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-foreground pb-20">
      {/* Top Breadcrumbs */}
      <div className="border-b border-border bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`rounded-xl text-xs gap-1.5 h-8 ${
                hasLiked ? 'text-red-500 border-red-200 bg-red-50/50 dark:bg-red-950/20' : ''
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-500' : ''}`} />
              {likes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className={`rounded-xl text-xs gap-1.5 h-8 ${
                isBookmarked ? 'text-purple-600 border-purple-300 bg-purple-50/50 dark:bg-purple-950/20' : ''
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-purple-600' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl text-xs gap-1.5 h-8"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16 space-y-8">
        {/* Header Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-700 text-white font-medium">
              {post.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author info */}
          <div className="flex items-center gap-3 pt-3 border-y border-border py-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800"
            />
            <div className="flex-1">
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {post.author.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {post.author.role} • Published {post.publishedAt}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Core Practical Takeaways
          </div>
          <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-300">
            {post.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Body Sections */}
        <div className="space-y-10 pt-4">
          {post.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 border-b border-border pb-2">
                {section.heading}
              </h2>

              <div className="space-y-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Musical Tip / Chord Box */}
              {section.musicalTip && (
                <div className="my-6 p-5 rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-inner space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                    <Music className="w-4 h-4 text-purple-400" />
                    {section.musicalTip.title}
                  </div>

                  {section.musicalTip.chordProgression && (
                    <div className="p-3 rounded-xl bg-black/60 font-mono text-sm sm:text-base text-emerald-400 border border-zinc-800 overflow-x-auto">
                      {section.musicalTip.chordProgression}
                    </div>
                  )}

                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {section.musicalTip.notes}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Topics:</span>
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-xl bg-muted text-xs font-medium text-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Callouts to Gigs and Lessons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base">Want to play this live?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore open church positions, studio session calls, and hotel lounge gigs on the PIANOW Careers board.
            </p>
            <Link href="/careers">
              <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 w-full justify-center">
                Browse Active Gigs <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base">Master It With a Teacher</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Book a 1-on-1 private lesson with our certified jazz and gospel instructors to polish your voice leading.
            </p>
            <Link href="/teachers">
              <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 w-full justify-center">
                Find an Instructor <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Discussion & Reflections Section */}
        <div className="pt-10 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Musician Discussion & Reflections ({comments.length})
            </h3>
          </div>

          {/* New Comment Box */}
          <form onSubmit={handleCommentSubmit} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border space-y-4">
            <h4 className="text-sm font-semibold">Share your experience or musical questions</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                required
                placeholder="Your Name / Handle"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Textarea
              required
              rows={3}
              placeholder="What voicings do you use for this turnaround? How did this work in your rehearsal?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="rounded-xl"
            />

            <Button
              type="submit"
              disabled={isSubmittingComment}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs px-5 gap-1.5"
            >
              {isSubmittingComment ? 'Posting...' : 'Post Reflection'}
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {comment.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{comment.date}</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* More Articles to Explore */}
        {otherPosts.length > 0 && (
          <div className="pt-12 border-t border-border space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Continue Reading
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherPosts.map((op) => (
                <Link
                  key={op.id}
                  href={`/blog/${op.slug}`}
                  className="group p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border hover:border-purple-300 dark:hover:border-purple-800 transition shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {op.category}
                    </Badge>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 transition line-clamp-2">
                      {op.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-muted-foreground pt-3 flex items-center justify-between">
                    <span>{op.readTime}</span>
                    <ArrowLeft className="w-3 h-3 rotate-180 text-purple-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
