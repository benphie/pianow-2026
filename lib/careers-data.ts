export interface GigOpportunity {
  id: string
  title: string
  organization: string
  category: 'church' | 'studio' | 'live_band' | 'tour' | 'corporate' | 'theatre'
  instrument: string[]
  location: string
  isRemote: boolean
  compensation: string
  payType: 'per_gig' | 'per_hour' | 'monthly' | 'contract'
  postedDate: string
  deadline?: string
  datesRequired: string
  experienceLevel: 'All Levels' | 'Intermediate' | 'Advanced' | 'Pro / Session'
  description: string
  requirements: string[]
  benefits?: string[]
  contactEmail: string
  contactPhone?: string
  status: 'open' | 'reviewing' | 'filled'
  urgent?: boolean
  featured?: boolean
}

export interface CareerGuide {
  id: string
  slug: string
  title: string
  category: 'Session Player' | 'Church & Gospel' | 'Teaching Studio' | 'Touring & Live' | 'Sync & Production'
  readTime: string
  summary: string
  keyMilestones: string[]
  toolsAndGear: string[]
  actionPlan: { step: string; detail: string }[]
  recommendedLessons: { title: string; href: string }[]
}

export interface GigApplication {
  id: string
  gigId: string
  gigTitle: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  instrument: string
  experienceSummary: string
  sampleLink?: string
  coverNote?: string
  appliedAt: string
  status: 'submitted' | 'under_review' | 'shortlisted' | 'accepted' | 'declined'
}

export const INITIAL_GIG_OPPORTUNITIES: GigOpportunity[] = [
  {
    id: 'gig-001',
    title: 'Lead Gospel & Contemporary Worship Keyboardist',
    organization: 'Grace Community Cathedral',
    category: 'church',
    instrument: ['Piano / Keys', 'Synthesizer / Hammond Organ'],
    location: 'Atlanta, GA (Also accepting Kampala & Lagos affiliate positions)',
    isRemote: false,
    compensation: '$350 - $500',
    payType: 'per_gig',
    postedDate: '2026-09-08',
    datesRequired: 'Weekly Sundays (8:00 AM - 1:00 PM) + Thursday Rehearsal (7:00 PM)',
    experienceLevel: 'Advanced',
    description: 'Seeking a seasoned keyboardist with strong gospel, contemporary Christian, and neo-soul chord sensibilities. Must be comfortable providing dynamic ambient pads during speaker moments, modulating smoothly on the fly, and locking in with a rhythm section on click and in-ear monitors.',
    requirements: [
      'Mastery of extended chords (9ths, 11ths, 13ths, altered dominants, and tritone substitutions)',
      'Experience playing with click track, backing loops, and multitracks (Ableton / Prime)',
      'Familiarity with Nord Stage, MainStage, or Yamaha Montage keyboards',
      'Positive, ministry-minded team attitude and punctual rehearsal attendance'
    ],
    benefits: [
      'Guaranteed recurring weekly schedule',
      'Access to top-tier in-house backline (Nord Stage 3 + Roland RD-2000)',
      'Paid holiday special services (Easter, Christmas, New Year Eve)'
    ],
    contactEmail: 'worship@gracecommunity.org',
    contactPhone: '+1 (404) 555-0192',
    status: 'open',
    urgent: true,
    featured: true
  },
  {
    id: 'gig-002',
    title: 'Studio Session Pianist & Arranger (Acoustic & R&B EP)',
    organization: 'SoundWave Recording Studios',
    category: 'studio',
    instrument: ['Piano / Keys', 'Electric Piano (Rhodes/Wurlitzer)'],
    location: 'London, UK / Remote stems accepted',
    isRemote: true,
    compensation: '£450 - £800',
    payType: 'per_gig',
    postedDate: '2026-09-06',
    datesRequired: 'Session dates late September 2026 (approx. 2 tracking days)',
    experienceLevel: 'Pro / Session',
    description: 'Award-winning independent producer tracking a 5-track neo-soul / acoustic soul EP. We need an expressive, tasteful pianist who can deliver emotional chord textures, delicate acoustic piano arpeggios, and groovy Rhodes rhythm lines.',
    requirements: [
      'Clean audio tracking capability (24-bit/48kHz or higher) if submitting stems remotely',
      'Proficiency in sight-reading lead sheets or chord charts with Nashville numbers',
      'Ability to take producer direction quickly with minimal takes',
      'Solid sense of pocket and harmonic subtlety'
    ],
    benefits: [
      'Master recording royalties credit & liner notes listing',
      'Potential ongoing relationship for future label sessions',
      'Rapid direct payment via bank transfer upon stem sign-off'
    ],
    contactEmail: 'production@soundwavestudios.co.uk',
    status: 'open',
    featured: true
  },
  {
    id: 'gig-003',
    title: 'Keyboardist / Musical Accompanist for Luxury Hotel Lounge',
    organization: 'Serena Grand Hotels & Resorts',
    category: 'corporate',
    instrument: ['Piano / Keys'],
    location: 'Kampala, Uganda',
    isRemote: false,
    compensation: 'UGX 800,000 - 1,400,000 / week',
    payType: 'monthly',
    postedDate: '2026-09-04',
    datesRequired: 'Wednesday to Saturday Evenings (6:30 PM - 10:30 PM)',
    experienceLevel: 'Intermediate',
    description: 'Serena Grand is hiring an elegant solo pianist or pianist/vocalist for our prime evening cocktail lounge. Repertoire includes jazz standards, pop ballads, classic soul, African jazz fusion, and timeless easy-listening piano arrangements on our Yamaha C7 Grand Piano.',
    requirements: [
      'Extensive repertoire of minimum 80-100 popular, jazz, and classic songs without sheet music dependency',
      'Polished stage presence, formal attire, and professional guest interaction',
      'Ability to maintain pleasant background volume without overpowering table conversation'
    ],
    benefits: [
      'Complimentary chef dinner each performance shift',
      'Regular monthly contract with renewal options',
      'Direct guest tips permitted'
    ],
    contactEmail: 'entertainment@serenahotels.co.ug',
    contactPhone: '+256 781 609660',
    status: 'open'
  },
  {
    id: 'gig-004',
    title: 'Touring Rhythm & Lead Guitarist (West Coast & Midwest Leg)',
    organization: 'Skyline Indie Pop Collective',
    category: 'tour',
    instrument: ['Acoustic Guitar', 'Electric Guitar'],
    location: 'Dallas, TX (Rehearsals) + Tour Route',
    isRemote: false,
    compensation: '$2,800 / month + $45/day per diem',
    payType: 'contract',
    postedDate: '2026-09-01',
    datesRequired: 'October 10 – November 22, 2026',
    experienceLevel: 'Advanced',
    description: 'Rising indie-pop band hitting 16 cities across the US is holding auditions for a versatile rhythm/lead guitarist who can also provide backing vocal harmonies. Set is 75 minutes of high-energy grooves and ambient swell textures.',
    requirements: [
      'Proficiency with pedalboard modeling (Quad Cortex, Helix, or analog boards with delay/reverb swells)',
      'Pitch-perfect high tenor or falsetto backing vocals',
      'Tour experience, valid driver’s license, and passport',
      'In-ear monitoring comfort'
    ],
    benefits: [
      'All tour bus lodging and travel costs covered',
      'Endorsement discount eligibility on partner gear',
      'Merchandise commission percentage'
    ],
    contactEmail: 'management@skylineband.com',
    status: 'open'
  },
  {
    id: 'gig-005',
    title: 'Wedding & High-End Private Event Band Drummer',
    organization: 'Apex Entertainment Group',
    category: 'live_band',
    instrument: ['Drums / Percussion'],
    location: 'Nairobi, Kenya & Regional Event Destinations',
    isRemote: false,
    compensation: 'KES 25,000 - 45,000 / event',
    payType: 'per_gig',
    postedDate: '2026-08-28',
    datesRequired: 'Selected Fridays and Saturdays through December 2026',
    experienceLevel: 'Intermediate',
    description: 'Premier live corporate and wedding band seeks a tight, groove-centric drummer. Must have strong dynamic control, proficiency with funk, pop, Motown, Afrobeats, and high-energy dance medley transitions.',
    requirements: [
      'Own professional drum kit with quality cymbals and drum shield if required',
      'Strict timekeeping with click and backing track triggers (Roland SPD-SX is a plus)',
      'Reliable personal transport to venues',
      'Dependable punctuality and neat formal appearance'
    ],
    benefits: [
      'Regular weekend bookings across peak wedding season',
      'Band meals and refreshments provided at all events',
      'Immediate cash/transfer payment post-event'
    ],
    contactEmail: 'auditions@apexentertainment.co.ke',
    contactPhone: '+254 712 345678',
    status: 'open'
  },
  {
    id: 'gig-006',
    title: 'Online Video Game Soundtrack Composer & MIDI Arranger',
    organization: 'Starlight Interactive Games',
    category: 'studio',
    instrument: ['Piano / Keys', 'Synthesizer / Production'],
    location: 'Remote / Worldwide',
    isRemote: true,
    compensation: '$1,200 - $2,500 / cue bundle',
    payType: 'contract',
    postedDate: '2026-08-25',
    datesRequired: 'Milestone deliverables over 3 months',
    experienceLevel: 'All Levels',
    description: 'Indie fantasy RPG studio looking for evocative instrumental themes, battle loop tracks, and peaceful tavern piano arrangements. Looking for composers who blend orchestral textures with emotional piano motifs.',
    requirements: [
      'Strong portfolio of original instrumental compositions or game audio reels',
      'Proficiency in DAW (Logic Pro, Cubase, Ableton, or Reaper)',
      'Ability to produce loop-ready stems that seamlessly crossfade'
    ],
    benefits: [
      '100% remote flexible work hours',
      'Composer credit on Steam, Nintendo Switch, and soundtrack platforms',
      'Milestone-based upfront escrow payments'
    ],
    contactEmail: 'audio@starlightinteractive.dev',
    status: 'open'
  }
]

export const CAREER_GUIDANCE_ARTICLES: CareerGuide[] = [
  {
    id: 'guide-01',
    slug: 'first-call-session-player',
    title: 'How to Become a First-Call Studio & Session Musician',
    category: 'Session Player',
    readTime: '8 min read',
    summary: 'Producers and music directors hire session players for consistency, speed, and emotional taste. Learn how to prepare charts, master the Nashville Number System, and build a reputation that keeps your calendar booked.',
    keyMilestones: [
      'Master the Nashville Number System and chord chart notation',
      'Learn to dial in tone within 60 seconds of arriving at the studio',
      'Record pristine audio stems with zero clipping and clean time alignment',
      'Build an audio portfolio reel featuring 30-second genre spotlights'
    ],
    toolsAndGear: [
      'High-quality direct box (Radial JDI or Rupert Neve RNDI)',
      'In-ear monitors with flat frequency response (e.g. Shure SE215 / Sennheiser IE 100)',
      'Tablet with ForScore or MobileSheets for instant chart reading',
      'Versatile stage keyboard with dedicated stereo balanced outputs'
    ],
    actionPlan: [
      {
        step: 'Phase 1: Harmonic Fluency',
        detail: 'Practice transposing standards into all 12 keys using numbers (1-4-5-6m-2m). Never rely solely on the transpose button on acoustic or session rigs.'
      },
      {
        step: 'Phase 2: Build Your 60-Second Demo Reel',
        detail: 'Record a video containing 4 distinct 15-second musical styles: gospel ballad, funk groove, cinematic acoustic, and pop comping.'
      },
      {
        step: 'Phase 3: Network with Local Producers and Church MDs',
        detail: 'Show up at rehearsals early, offer to sub for experienced players for free or low rate, and prove your punctuality and reliability.'
      }
    ],
    recommendedLessons: [
      { title: 'Essential 2-5-1 Voicings & Substitutions', href: '/lessons' },
      { title: 'Advanced Pocket & Timekeeping with Metronome', href: '/lessons' }
    ]
  },
  {
    id: 'guide-02',
    slug: 'gospel-church-music-director',
    title: 'The Modern Church & Gospel Music Director Playbook',
    category: 'Church & Gospel',
    readTime: '10 min read',
    summary: 'Mastering the flow of worship services requires technical mastery, spiritual sensitivity, and spontaneous communication with vocalists, pastors, and audio engineers.',
    keyMilestones: [
      'Learn pastoral talk-music voicings and emotional chord movements',
      'Effortlessly modulate between unrelated keys using secondary dominants and pivot chords',
      'Implement multi-tracks, click tracks, and talkback mics for clean communication',
      'Lead efficient 60-minute rehearsals that respect musicians time'
    ],
    toolsAndGear: [
      'Ambient pad soundbank (Worship Essentials / Sunday Keys / MainStage)',
      'MIDI Foot Expression Pedal for smooth volume swell transitions',
      'Stereo DI boxes and noise isolators for hum-free stage audio'
    ],
    actionPlan: [
      {
        step: 'Step 1: The Ambient Pad Foundation',
        detail: 'Always maintain a gentle drone pad on the root key during transitions so there is never dead air between songs or during prayers.'
      },
      {
        step: 'Step 2: Smooth Modulations',
        detail: 'To modulate up a half step (e.g. Eb to E), use the V7 of the new key (B7) or the 2-5 progression of the new key (F#m7 to B7) during the chorus turnaround.'
      },
      {
        step: 'Step 3: Directing Vocalists with Hand Signals',
        detail: 'Establish standard band cues for chorus repeat, bridge build, soft breakdown, and final cut-off.'
      }
    ],
    recommendedLessons: [
      { title: 'Gospel Passing Chords & Tritone Movements', href: '/lessons' },
      { title: 'Keyboard Drone Pads and Stage Layering', href: '/lessons' }
    ]
  },
  {
    id: 'guide-03',
    slug: 'building-private-teaching-studio',
    title: 'Building a $4,000+/Month Private Teaching & Mentorship Studio',
    category: 'Teaching Studio',
    readTime: '7 min read',
    summary: 'Teaching is one of the most reliable and fulfilling income sources for skilled instrumentalists. Here is how to structure your student packages, retain students for years, and teach effectively.',
    keyMilestones: [
      'Transition from charging per lesson to monthly tuition packages',
      'Create customized practice logs and progress roadmaps for each student',
      'Host biannual student recitals or digital showcases',
      'Apply to join certified teaching platforms like PIANOW'
    ],
    toolsAndGear: [
      'High-speed internet with external USB audio interface (Focusrite Scarlett)',
      'Overhead camera mount for hands-on keyboard/guitar demonstrations',
      'PIANOW Practice Log & Repertoire Tracker for student accountability'
    ],
    actionPlan: [
      {
        step: 'Step 1: Shift to Monthly Tuition',
        detail: 'Never charge per lesson. Charge a flat monthly fee (e.g. $200 - $350/month for 4 weekly sessions) with strict 24-hour reschedule policies.'
      },
      {
        step: 'Step 2: Focus on Student Songs, Not Dry Drills',
        detail: 'Teach scales and theory through songs the student already loves. When they see immediate musical results, retention jumps past 12 months.'
      },
      {
        step: 'Step 3: Join the PIANOW Teaching Roster',
        detail: 'Submit an application through PIANOW to gain access to students seeking live 1-on-1 instruction.'
      }
    ],
    recommendedLessons: [
      { title: 'Apply to Teach on PIANOW', href: '/teachers/apply' },
      { title: 'Browse Active PIANOW Teachers', href: '/teachers' }
    ]
  },
  {
    id: 'guide-04',
    slug: 'touring-musician-survival-guide',
    title: 'Touring & Live Production: Gear, Etiquette, and Stamina',
    category: 'Touring & Live',
    readTime: '9 min read',
    summary: 'Life on the road tests your endurance, stagecraft, and interpersonal harmony. Learn how to protect your hearing, organize backups, and handle grueling travel itineraries like a pro.',
    keyMilestones: [
      'Custom-molded or high-isolation in-ear monitors to prevent hearing fatigue',
      'Duplicated emergency power supplies and backup patch cables',
      'Maintaining physical agility through pre-show wrist, back, and finger warmups',
      'Managing stage volume and working constructively with house FOH engineers'
    ],
    toolsAndGear: [
      'Molded IEMs or dual-driver earphones (at least -25dB ambient isolation)',
      'Waterproof hard shell flight case (Pelican / Gator)',
      'Universal voltage power adaptors and battery backups'
    ],
    actionPlan: [
      {
        step: '1. Redundancy Rule',
        detail: 'Every critical cable, DI, adapter, and guitar string must have a backup in your gig bag. If it breaks at soundcheck, you have 5 minutes to solve it.'
      },
      {
        step: '2. Respect the FOH Engineer',
        detail: 'Give the sound engineer a neat input list, keep stage amp volume modest, and avoid playing during line checks until your channel is called.'
      },
      {
        step: '3. Hydration & Sleep Routine',
        detail: 'Tour exhaustion ruins timing and accuracy. Limit alcohol, drink electrolytes, and do 10 minutes of stretches before sitting at the instrument.'
      }
    ],
    recommendedLessons: [
      { title: 'Metronome Precision & Time-Keeping', href: '/lessons' }
    ]
  }
]

export const AUDITION_EPK_CHECKLIST = [
  {
    title: '60-Second Audition Video',
    description: 'Keep your video reel under 90 seconds. Open with your most impressive 15 seconds. Frame your hands and facial expression clearly in good lighting.'
  },
  {
    title: 'Clean Unprocessed Audio Stems',
    description: 'Avoid drown-out reverb or clipping. Bandleaders and producers need to hear your acoustic touch, clean finger velocity, and pocket timing.'
  },
  {
    title: 'One-Page Musical Bio / Resume',
    description: 'List your primary instruments, vocal range, notable live gigs/recordings, gear owned, and active contact numbers (WhatsApp/Phone/Email).'
  },
  {
    title: 'High-Resolution Headshot & Stage Photos',
    description: 'Include 1 clear professional headshot and 1-2 photos of you actively performing on stage with your instrument.'
  },
  {
    title: 'Chart Reading Proof',
    description: 'Mention your reading ability (Standard Notation, Chord Charts, Lead Sheets, or Nashville Numbers).'
  }
]
