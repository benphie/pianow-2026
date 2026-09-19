'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  Briefcase,
  Music,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Plus,
  Compass,
  FileCheck,
  Headphones,
  GraduationCap,
  ExternalLink,
  Phone,
  Mail,
  UserCheck,
  ChevronRight,
  BookOpen,
  Sliders,
  Clock,
  Award,
  Globe,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'
import { addNotification } from '@/lib/notifications'
import {
  GigOpportunity,
  INITIAL_GIG_OPPORTUNITIES,
  CAREER_GUIDANCE_ARTICLES,
  AUDITION_EPK_CHECKLIST,
  CareerGuide
} from '@/lib/careers-data'

export default function CareersPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Tab State
  const [activeTab, setActiveTab] = useState<'gigs' | 'guidance' | 'epk' | 'mentorship'>('gigs')

  // Gigs Board State
  const [gigs, setGigs] = useState<GigOpportunity[]>(INITIAL_GIG_OPPORTUNITIES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all')
  const [remoteOnly, setRemoteOnly] = useState(false)

  // Modals
  const [applyingGig, setApplyingGig] = useState<GigOpportunity | null>(null)
  const [isPostGigOpen, setIsPostGigOpen] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<CareerGuide | null>(null)

  // Application Form
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')
  const [applicantInstrument, setApplicantInstrument] = useState('')
  const [applicantDemoLink, setApplicantDemoLink] = useState('')
  const [applicantNote, setApplicantNote] = useState('')
  const [isSubmittingApp, setIsSubmittingApp] = useState(false)

  // Post Gig Form
  const [newGigTitle, setNewGigTitle] = useState('')
  const [newGigOrg, setNewGigOrg] = useState('')
  const [newGigCategory, setNewGigCategory] = useState<GigOpportunity['category']>('church')
  const [newGigInstrument, setNewGigInstrument] = useState('')
  const [newGigLocation, setNewGigLocation] = useState('')
  const [newGigIsRemote, setNewGigIsRemote] = useState(false)
  const [newGigCompensation, setNewGigCompensation] = useState('')
  const [newGigDates, setNewGigDates] = useState('')
  const [newGigDesc, setNewGigDesc] = useState('')
  const [newGigRequirements, setNewGigRequirements] = useState('')
  const [newGigEmail, setNewGigEmail] = useState('')
  const [newGigPhone, setNewGigPhone] = useState('')
  const [isSubmittingPostGig, setIsSubmittingPostGig] = useState(false)

  // Mentorship Form
  const [mentorshipTopic, setMentorshipTopic] = useState('session_musician')
  const [mentorshipGoals, setMentorshipGoals] = useState('')
  const [mentorshipPhone, setMentorshipPhone] = useState('')
  const [isBookingMentorship, setIsBookingMentorship] = useState(false)
  const [mentorshipBooked, setMentorshipBooked] = useState(false)

  // EPK Checked Items
  const [checkedEpk, setCheckedEpk] = useState<Record<number, boolean>>({})

  // Load user data & posted gigs from local storage
  useEffect(() => {
    if (user) {
      setApplicantName(user.name || '')
      setApplicantEmail(user.email || '')
    }

    try {
      const storedGigs = localStorage.getItem('pianow_posted_gigs')
      if (storedGigs) {
        const parsed = JSON.parse(storedGigs)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGigs([...parsed, ...INITIAL_GIG_OPPORTUNITIES])
        }
      }

      const storedEpk = localStorage.getItem('pianow_epk_checklist')
      if (storedEpk) {
        setCheckedEpk(JSON.parse(storedEpk))
      }
    } catch (e) {
      console.warn('Could not load stored career data', e)
    }
  }, [user])

  const toggleEpk = (index: number) => {
    const updated = { ...checkedEpk, [index]: !checkedEpk[index] }
    setCheckedEpk(updated)
    try {
      localStorage.setItem('pianow_epk_checklist', JSON.stringify(updated))
    } catch (e) {}
  }

  // Filter Gigs
  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      searchQuery === '' ||
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || gig.category === selectedCategory

    const matchesInstrument =
      selectedInstrument === 'all' ||
      gig.instrument.some((inst) =>
        inst.toLowerCase().includes(selectedInstrument.toLowerCase())
      )

    const matchesRemote = !remoteOnly || gig.isRemote

    return matchesSearch && matchesCategory && matchesInstrument && matchesRemote
  })

  // Handle Gig Application Submission
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!applyingGig) return

    if (!applicantName.trim() || !applicantEmail.trim()) {
      toast({
        title: 'Required fields missing',
        description: 'Please provide your full name and email address.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmittingApp(true)

    setTimeout(() => {
      // Save application locally
      try {
        const existing = JSON.parse(
          localStorage.getItem('pianow_gig_applications') || '[]'
        )
        const newApp = {
          id: `app-${Date.now()}`,
          gigId: applyingGig.id,
          gigTitle: applyingGig.title,
          applicantName,
          applicantEmail,
          applicantPhone,
          instrument: applicantInstrument || applyingGig.instrument[0],
          sampleLink: applicantDemoLink,
          coverNote: applicantNote,
          appliedAt: new Date().toISOString(),
          status: 'submitted'
        }
        localStorage.setItem(
          'pianow_gig_applications',
          JSON.stringify([newApp, ...existing])
        )
      } catch (err) {
        console.warn('Could not save gig application', err)
      }

      // Add in-app notification
      addNotification({
        type: 'application',
        title: 'Gig Application Sent',
        message: `Your audition application for "${applyingGig.title}" at ${applyingGig.organization} was successfully transmitted.`,
        href: '/careers'
      })

      setIsSubmittingApp(false)
      toast({
        title: 'Application Submitted!',
        description: `Your application for "${applyingGig.title}" has been sent to ${applyingGig.contactEmail}.`
      })

      setApplyingGig(null)
      setApplicantDemoLink('')
      setApplicantNote('')
    }, 750)
  }

  // Handle Post Gig Submission
  const handlePostGigSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newGigTitle.trim() || !newGigOrg.trim() || !newGigEmail.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please specify the gig title, organization, and contact email.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmittingPostGig(true)

    setTimeout(() => {
      const createdGig: GigOpportunity = {
        id: `gig-user-${Date.now()}`,
        title: newGigTitle.trim(),
        organization: newGigOrg.trim(),
        category: newGigCategory,
        instrument: newGigInstrument
          ? newGigInstrument.split(',').map((s) => s.trim())
          : ['Piano / Keys'],
        location: newGigLocation.trim() || 'Worldwide / Remote',
        isRemote: newGigIsRemote,
        compensation: newGigCompensation.trim() || 'Negotiable',
        payType: 'per_gig',
        postedDate: new Date().toISOString().split('T')[0],
        datesRequired: newGigDates.trim() || 'Immediate / Flexible',
        experienceLevel: 'Intermediate',
        description:
          newGigDesc.trim() ||
          'Musician opportunity posted via the PIANOW Musician Career Network.',
        requirements: newGigRequirements
          ? newGigRequirements.split('\n').filter((r) => r.trim().length > 0)
          : ['High musical competence and dependable punctuality.'],
        contactEmail: newGigEmail.trim(),
        contactPhone: newGigPhone.trim() || undefined,
        status: 'open',
        urgent: false,
        featured: true
      }

      // Save to localStorage
      try {
        const stored = JSON.parse(
          localStorage.getItem('pianow_posted_gigs') || '[]'
        )
        const updated = [createdGig, ...stored]
        localStorage.setItem('pianow_posted_gigs', JSON.stringify(updated))
        setGigs([createdGig, ...gigs])
      } catch (err) {
        setGigs([createdGig, ...gigs])
      }

      addNotification({
        type: 'system',
        title: 'Gig Posted Successfully',
        message: `Your listing "${createdGig.title}" is now active on the PIANOW Musician Job Board.`,
        href: '/careers'
      })

      setIsSubmittingPostGig(false)
      setIsPostGigOpen(false)
      toast({
        title: 'Opportunity Posted!',
        description: 'Your gig is now live on the PIANOW board for all musicians.'
      })

      // Reset form
      setNewGigTitle('')
      setNewGigOrg('')
      setNewGigLocation('')
      setNewGigCompensation('')
      setNewGigDates('')
      setNewGigDesc('')
      setNewGigRequirements('')
      setNewGigEmail('')
      setNewGigPhone('')
    }, 800)
  }

  // Handle Mentorship Booking
  const handleBookMentorship = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBookingMentorship(true)

    setTimeout(() => {
      setIsBookingMentorship(false)
      setMentorshipBooked(true)

      addNotification({
        type: 'message',
        title: 'Mentorship Strategy Session Requested',
        message:
          'A PIANOW music director has received your consultation request and will reach out with calendar slots.',
        href: '/careers'
      })

      toast({
        title: 'Mentorship Request Received',
        description: 'Our senior music faculty will contact you via email to schedule your 1-on-1 strategy call.'
      })
    }, 700)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-foreground pb-20">
      {/* Top Banner Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-purple-900/10 via-background to-background py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                PIANOW Musician Careers, Gigs & Guidance Hub
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Unlock Real Gigs & Chart Your Path as a Professional Musician
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Connect directly with church music ministries, recording studios, touring bands,
                and corporate venues. Access road-tested career guidance to transition from the
                practice room to high-paying live performances.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={() => setActiveTab('gigs')}
                  className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-md gap-2"
                >
                  <Music className="w-4 h-4" />
                  Explore Active Gigs ({gigs.length})
                </Button>
                <Button
                  onClick={() => setIsPostGigOpen(true)}
                  variant="outline"
                  className="rounded-xl border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-2"
                >
                  <Plus className="w-4 h-4 text-purple-600" />
                  Post a Gig / Casting Call
                </Button>
                <Link href="/teachers/apply">
                  <Button
                    variant="ghost"
                    className="rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-950/40 gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Teach on PIANOW
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-80">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {gigs.length}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Live Casting Calls & Gigs
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  $350+
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Avg. Weekly Church/Session Pay
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  100%
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Verified Music Directors
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  4 Roadmaps
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Career Strategy Blueprints
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-10 border-b border-border overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('gigs')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'gigs'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-zinc-900/60'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Playing Opportunities & Gigs ({gigs.length})
            </button>

            <button
              onClick={() => setActiveTab('guidance')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'guidance'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-zinc-900/60'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Compass className="w-4 h-4" />
              Career Guidance & Roadmaps
            </button>

            <button
              onClick={() => setActiveTab('epk')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'epk'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-zinc-900/60'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Audition & EPK Checklist
            </button>

            <button
              onClick={() => setActiveTab('mentorship')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'mentorship'
                  ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-zinc-900/60'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              1-on-1 Career Mentorship
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ========================================================= */}
        {/* TAB 1: GIGS & AUDITIONS BOARD */}
        {/* ========================================================= */}
        {activeTab === 'gigs' && (
          <div className="space-y-8">
            {/* Filter & Search Bar */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by gig title, church, venue, city, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3.5 py-2 rounded-xl text-sm bg-background border border-border focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Gig Types</option>
                    <option value="church">Church & Worship</option>
                    <option value="studio">Recording Studio</option>
                    <option value="live_band">Live Band / Wedding</option>
                    <option value="tour">Touring & Road</option>
                    <option value="corporate">Hotel Lounge / Corporate</option>
                  </select>

                  {/* Instrument Filter */}
                  <select
                    value={selectedInstrument}
                    onChange={(e) => setSelectedInstrument(e.target.value)}
                    className="px-3.5 py-2 rounded-xl text-sm bg-background border border-border focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Instruments</option>
                    <option value="piano">Piano / Keys</option>
                    <option value="guitar">Guitar</option>
                    <option value="drums">Drums / Percussion</option>
                    <option value="organ">Organ / Synth</option>
                    <option value="production">Production / MIDI</option>
                  </select>

                  {/* Remote Toggle */}
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs font-medium cursor-pointer hover:bg-muted/50 select-none">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="rounded text-purple-600 accent-purple-600"
                    />
                    <Globe className="w-3.5 h-3.5 text-purple-600" />
                    Remote / Stem Sessions Only
                  </label>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Popular Searches:</span>
                {['Church Keyboardist', 'Nord Stage', 'Wedding Drummer', 'Acoustic Soul', 'Indie Tour', 'Kampala', 'London', 'Atlanta'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-muted hover:bg-purple-100 dark:hover:bg-purple-950/40 text-muted-foreground hover:text-purple-700 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Post Callout */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filteredGigs.length}</span> opportunities
              </p>
              <button
                onClick={() => setIsPostGigOpen(true)}
                className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
              >
                Are you a bandleader or church director? Post a casting call <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gigs List */}
            {filteredGigs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-border">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <h3 className="text-lg font-semibold">No gigs matched your criteria</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                  Try adjusting your keywords or clearing the category and instrument filters to see all available listings.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedInstrument('all')
                    setRemoteOnly(false)
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredGigs.map((gig) => (
                  <motion.div
                    key={gig.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-xs hover:shadow-md"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-medium capitalize"
                          >
                            {gig.category.replace('_', ' ')}
                          </Badge>
                          {gig.isRemote && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
                              Remote / Worldwide
                            </Badge>
                          )}
                          {gig.urgent && (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                              Immediate Need
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <DollarSign className="w-4 h-4 -mr-0.5" />
                          {gig.compensation}
                        </div>
                      </div>

                      {/* Title & Organization */}
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 transition">
                          {gig.title}
                        </h3>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mt-0.5">
                          {gig.organization}
                        </p>
                      </div>

                      {/* Location & Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <span className="truncate">{gig.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <span className="truncate">{gig.datesRequired}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {gig.description}
                      </p>

                      {/* Instrument Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {gig.instrument.map((inst, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground"
                          >
                            {inst}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-zinc-500">
                          {gig.experienceLevel}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                      <div className="text-[11px] text-muted-foreground">
                        Posted {gig.postedDate}
                      </div>

                      <Button
                        onClick={() => {
                          setApplyingGig(gig)
                          setApplicantInstrument(gig.instrument[0])
                        }}
                        className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold px-4 gap-1.5"
                      >
                        Apply for Gig <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CAREER GUIDANCE & ROADMAPS */}
        {/* ========================================================= */}
        {activeTab === 'guidance' && (
          <div className="space-y-10">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Musician Career Strategy & Income Blueprints
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Step-by-step methodologies compiled from first-call session musicians,
                church music directors, and full-time educators. Learn what it takes to
                consistently win auditions and build a sustainable musical living.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAREER_GUIDANCE_ARTICLES.map((guide) => (
                <div
                  key={guide.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-border shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                        {guide.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {guide.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {guide.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {guide.summary}
                    </p>

                    {/* Key Milestones */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Core Competencies Required:
                      </div>
                      <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {guide.keyMilestones.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <Button
                      onClick={() => setSelectedGuide(guide)}
                      variant="outline"
                      className="rounded-xl border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold gap-1.5 w-full justify-center"
                    >
                      Open Full Strategy Blueprint <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Teaching Callout Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Educator Opportunity
                </div>
                <h3 className="text-2xl font-bold">
                  Teach Lessons on PIANOW & Monetize Your Expertise
                </h3>
                <p className="text-sm text-purple-200 leading-relaxed">
                  Join our certified educator roster. Set your own booking schedule, teach
                  students from around the globe, and earn steady monthly income with PIANOW’s
                  student management tools.
                </p>
              </div>

              <Link href="/teachers/apply">
                <Button className="bg-white hover:bg-purple-50 text-purple-950 font-bold px-6 py-6 rounded-2xl shadow-lg flex-shrink-0">
                  Apply as an Instructor <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: AUDITION & EPK CHECKLIST */}
        {/* ========================================================= */}
        {activeTab === 'epk' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Musician Electronic Press Kit (EPK) & Audition Reel Checklist
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Before applying for high-paying church positions, studio tracking sessions, or touring
                auditions, verify that your presentation satisfies what professional directors demand.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="font-semibold text-base">
                  Interactive Preparation Progress
                </div>
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {Object.values(checkedEpk).filter(Boolean).length} of {AUDITION_EPK_CHECKLIST.length} Completed
                </div>
              </div>

              <div className="space-y-4">
                {AUDITION_EPK_CHECKLIST.map((item, index) => {
                  const isChecked = !!checkedEpk[index]
                  return (
                    <div
                      key={index}
                      onClick={() => toggleEpk(index)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isChecked
                          ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'
                          : 'bg-muted/30 border-border hover:bg-muted/60'
                      }`}
                    >
                      <div className="pt-0.5 flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-zinc-400 bg-background'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="space-y-1 flex-1">
                        <h4
                          className={`text-sm font-bold ${
                            isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bonus Audio Tip */}
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Golden Rule for Video Auditions:</span> Music directors
                  judge your pocket, time, and touch in the first 15 seconds. Do not spend 45 seconds
                  introducing yourself—start immediately with your most musical, dynamic playing.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: 1-ON-1 CAREER MENTORSHIP */}
        {/* ========================================================= */}
        {activeTab === 'mentorship' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                1-on-1 Musician Career Mentorship
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Book a focused 30-minute career strategy call with a PIANOW music director.
                Receive direct feedback on your audition reel, rate negotiation, or church band transitions.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-xs">
              {mentorshipBooked ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Strategy Consultation Requested!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you! One of our senior faculty members has received your request.
                    We will email you directly with a personalized calendar booking link.
                  </p>
                  <Button
                    onClick={() => setMentorshipBooked(false)}
                    variant="outline"
                    className="rounded-xl mt-2"
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookMentorship} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Primary Guidance Area
                    </label>
                    <select
                      value={mentorshipTopic}
                      onChange={(e) => setMentorshipTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="session_musician">Becoming a First-Call Studio / Session Player</option>
                      <option value="church_director">Church Music Directing & Flow Modulations</option>
                      <option value="teaching_studio">Launching a High-Income Teaching Studio</option>
                      <option value="audition_prep">Audition Tape Review & Critique</option>
                      <option value="gear_rig">Live Keyboard / Guitar Rig Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Your Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. musician@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      WhatsApp or Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="e.g. +256 781 609660 or +1 (404) 555-0192"
                      value={mentorshipPhone}
                      onChange={(e) => setMentorshipPhone(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      What is your current musical roadblock or target?
                    </label>
                    <Textarea
                      rows={4}
                      placeholder="Tell us about your current experience, what instruments you play, and what specific goal you want to achieve over the next 90 days..."
                      value={mentorshipGoals}
                      onChange={(e) => setMentorshipGoals(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isBookingMentorship}
                    className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md gap-2"
                  >
                    {isBookingMentorship ? 'Sending Request...' : 'Schedule Strategy Consultation'}
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: APPLY FOR GIG */}
      {/* ========================================================= */}
      <AnimatePresence>
        {applyingGig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 mb-1">
                    Audition Application
                  </Badge>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {applyingGig.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {applyingGig.organization} • {applyingGig.compensation}
                  </p>
                </div>
                <button
                  onClick={() => setApplyingGig(null)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. John Doe"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Phone / WhatsApp Number
                    </label>
                    <Input
                      placeholder="e.g. +256 781 609660"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Primary Instrument
                    </label>
                    <Input
                      placeholder="e.g. Piano / Keys"
                      value={applicantInstrument}
                      onChange={(e) => setApplicantInstrument(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Demo Reel or Video Link (YouTube, Drive, or Instagram)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://youtu.be/... or https://instagram.com/..."
                    value={applicantDemoLink}
                    onChange={(e) => setApplicantDemoLink(e.target.value)}
                    className="rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    A short 30-60 second clip of your playing greatly increases callback rates.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Brief Note or Background
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Mention gear owned, sight-reading ability, previous church/band experience..."
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setApplyingGig(null)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl px-5 gap-2"
                  >
                    {isSubmittingApp ? 'Submitting...' : 'Submit Application'}
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 2: POST A GIG */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isPostGigOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Post a Musician Casting Call or Gig
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your opportunity will be visible to hundreds of trained musicians on PIANOW.
                  </p>
                </div>
                <button
                  onClick={() => setIsPostGigOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePostGigSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Gig / Role Title *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Sunday Morning Gospel Keyboardist"
                      value={newGigTitle}
                      onChange={(e) => setNewGigTitle(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Band / Church / Organization *
                    </label>
                    <Input
                      required
                      placeholder="e.g. All Saints Cathedral"
                      value={newGigOrg}
                      onChange={(e) => setNewGigOrg(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Category
                    </label>
                    <select
                      value={newGigCategory}
                      onChange={(e) => setNewGigCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-hidden"
                    >
                      <option value="church">Church & Worship</option>
                      <option value="studio">Recording Studio</option>
                      <option value="live_band">Live Band / Wedding</option>
                      <option value="tour">Touring Musician</option>
                      <option value="corporate">Hotel / Corporate</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Required Instrument(s)
                    </label>
                    <Input
                      placeholder="e.g. Piano / Keys, Hammond Organ"
                      value={newGigInstrument}
                      onChange={(e) => setNewGigInstrument(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Location (City, Country)
                    </label>
                    <Input
                      placeholder="e.g. Kampala, Uganda"
                      value={newGigLocation}
                      onChange={(e) => setNewGigLocation(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Compensation / Rate
                    </label>
                    <Input
                      placeholder="e.g. $300 / gig or UGX 500,000"
                      value={newGigCompensation}
                      onChange={(e) => setNewGigCompensation(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Dates & Schedule Requirements
                  </label>
                  <Input
                    placeholder="e.g. Weekly Sundays + Thursday 7 PM Rehearsal"
                    value={newGigDates}
                    onChange={(e) => setNewGigDates(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Job Description
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="Detail the musical style, songs, expectations, and rehearsal expectations..."
                    value={newGigDesc}
                    onChange={(e) => setNewGigDesc(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="director@church.org"
                      value={newGigEmail}
                      onChange={(e) => setNewGigEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Contact Phone / WhatsApp
                    </label>
                    <Input
                      type="tel"
                      placeholder="+256 781 609660"
                      value={newGigPhone}
                      onChange={(e) => setNewGigPhone(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="newGigIsRemote"
                    checked={newGigIsRemote}
                    onChange={(e) => setNewGigIsRemote(e.target.checked)}
                    className="rounded text-purple-600 accent-purple-600"
                  />
                  <label htmlFor="newGigIsRemote" className="text-xs text-muted-foreground cursor-pointer">
                    This is a Remote / Recording stem opportunity
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsPostGigOpen(false)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingPostGig}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl px-5"
                  >
                    {isSubmittingPostGig ? 'Posting...' : 'Publish Gig Now'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL 3: FULL STRATEGY BLUEPRINT VIEW */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 mb-1">
                    {selectedGuide.category}
                  </Badge>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedGuide.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedGuide.readTime} • Comprehensive Action Plan
                  </p>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Action Plan & Execution Steps:
                  </h4>
                  <div className="space-y-3">
                    {selectedGuide.actionPlan.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1"
                      >
                        <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
                          {action.step}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {action.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Essential Gear & Tools for this Path:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    {selectedGuide.toolsAndGear.map((tool, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-900 flex items-center justify-between">
                  <div className="text-xs text-purple-900 dark:text-purple-200">
                    Ready to practice the chords and skills required for this role?
                  </div>
                  <Link href="/lessons">
                    <Button
                      size="sm"
                      className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold"
                    >
                      Browse Lessons
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setSelectedGuide(null)}
                  className="rounded-xl px-6"
                >
                  Close Roadmap
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
