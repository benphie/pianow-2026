import { NextRequest, NextResponse } from 'next/server'

const MOCK_GUIDANCE = [
  {
    id: 1,
    title: 'How to Become a Music Teacher',
    category: 'Getting Started',
    description: 'Learn the steps to start a career in music education, from education requirements to landing your first position.',
    content: 'Music education is a rewarding career path. Here are the essential steps...',
    tips: [
      'Get formal music education or certification',
      'Develop strong performance skills on your instrument',
      'Build a portfolio of your teaching experience',
      'Network with other music educators',
      'Consider specializing in a particular age group or level'
    ],
    read_time: '5 min',
    published_date: new Date('2024-01-10')
  },
  {
    id: 2,
    title: 'Creating Engaging Online Lessons',
    category: 'Teaching Tips',
    description: 'Master the art of teaching music online with strategies that keep students engaged and motivated.',
    content: 'Online music teaching requires specific skills and strategies...',
    tips: [
      'Invest in quality audio and video equipment',
      'Keep lessons interactive with Q&A sessions',
      'Use visual aids and screen sharing tools',
      'Create structured lesson plans with clear goals',
      'Record lessons for students to review later'
    ],
    read_time: '4 min',
    published_date: new Date('2024-01-08')
  },
  {
    id: 3,
    title: 'Music Career Opportunities Beyond Teaching',
    category: 'Career Paths',
    description: 'Explore diverse career options in the music industry including content creation, music therapy, and more.',
    content: 'The music industry offers many career paths beyond traditional teaching...',
    tips: [
      'Content creation and YouTube monetization',
      'Music composition and licensing',
      'Music therapy and wellness coaching',
      'Event coordination and performance booking',
      'Music production and sound engineering'
    ],
    read_time: '6 min',
    published_date: new Date('2024-01-05')
  },
  {
    id: 4,
    title: 'Building Your Personal Brand as a Musician',
    category: 'Professional Development',
    description: 'Develop a strong professional presence to attract students and opportunities in your music career.',
    content: 'Your personal brand is crucial for career success in the music industry...',
    tips: [
      'Create a professional website or portfolio',
      'Use social media to showcase your expertise',
      'Share valuable music tips and content',
      'Get testimonials from satisfied students',
      'Collaborate with other musicians and educators'
    ],
    read_time: '5 min',
    published_date: new Date('2024-01-03')
  },
  {
    id: 5,
    title: 'Income Strategies for Music Educators',
    category: 'Business',
    description: 'Learn multiple ways to generate income as a music educator and diversify your revenue streams.',
    content: 'Successful music educators diversify their income sources...',
    tips: [
      'One-on-one private lessons',
      'Group classes and workshops',
      'Creating online courses',
      'Selling lesson materials and resources',
      'Freelance content creation'
    ],
    read_time: '7 min',
    published_date: new Date('2024-01-01')
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let guidance = [...MOCK_GUIDANCE]

    if (category && category !== 'all') {
      guidance = guidance.filter(g => g.category.toLowerCase() === category.toLowerCase())
    }

    if (search) {
      const q = search.toLowerCase()
      guidance = guidance.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({
      guidance: guidance.sort((a, b) => 
        new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
      ),
      total: guidance.length,
      categories: [...new Set(MOCK_GUIDANCE.map(g => g.category))],
      source: 'mock'
    })
  } catch (error: any) {
    console.error('[v0] Error fetching guidance:', error?.message)
    return NextResponse.json({
      guidance: MOCK_GUIDANCE,
      total: MOCK_GUIDANCE.length,
      error: 'Error fetching guidance, returning mock data'
    })
  }
}
