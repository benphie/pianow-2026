import { NextRequest, NextResponse } from 'next/server'

const MOCK_JOBS = [
  {
    id: 1,
    title: 'Music Teacher - Piano',
    department: 'Education',
    location: 'Remote',
    type: 'Full-time',
    salary: '$40,000 - $60,000',
    description: 'Join our team of experienced music educators and inspire the next generation of musicians.',
    requirements: [
      "Bachelor's degree in Music or equivalent experience",
      '3+ years of teaching experience',
      'Proficiency in piano performance',
      'Excellent communication skills',
      'Experience with online teaching preferred'
    ],
    responsibilities: [
      'Create and deliver high-quality piano lessons',
      'Develop customized learning plans for students',
      'Track student progress and provide feedback',
      'Collaborate with other teachers',
      'Participate in platform improvements'
    ],
    posted_date: new Date('2024-01-15'),
    featured: true
  },
  {
    id: 2,
    title: 'Content Creator - Music Tutorials',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    salary: '$35,000 - $55,000',
    description: 'Create engaging music tutorial content for our platform.',
    requirements: [
      'Experience creating video content',
      'Strong musical background',
      'Video editing skills',
      'Creative storytelling ability',
      'Understanding of music education'
    ],
    responsibilities: [
      'Plan and film music tutorial videos',
      'Edit and produce high-quality content',
      'Develop tutorial series and courses',
      'Engage with community feedback',
      'Stay current with music trends'
    ],
    posted_date: new Date('2024-01-10'),
    featured: true
  },
  {
    id: 3,
    title: 'Guitar Teacher - Beginner Focus',
    department: 'Education',
    location: 'Remote',
    type: 'Part-time',
    salary: '$25 - $40/hour',
    description: 'Help beginners start their guitar journey!',
    requirements: [
      'Advanced guitar skills',
      '2+ years teaching experience',
      'Patience and teaching ability',
      'Experience with different teaching methods',
      'Reliable internet connection'
    ],
    responsibilities: [
      'Conduct one-on-one guitar lessons',
      'Create lesson plans for students',
      'Motivate and encourage student progress',
      'Handle student scheduling',
      'Gather student feedback for improvement'
    ],
    posted_date: new Date('2024-01-08'),
    featured: false
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const department = searchParams.get('department')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    let jobs = [...MOCK_JOBS]

    if (department && department !== 'all') {
      jobs = jobs.filter(j => j.department.toLowerCase() === department.toLowerCase())
    }

    if (type && type !== 'all') {
      jobs = jobs.filter(j => j.type.toLowerCase() === type.toLowerCase())
    }

    if (search) {
      const q = search.toLowerCase()
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({
      jobs,
      total: jobs.length,
      source: 'mock'
    })
  } catch (error: any) {
    console.error('[v0] Error fetching jobs:', error?.message)
    return NextResponse.json({
      jobs: MOCK_JOBS,
      total: MOCK_JOBS.length,
      error: 'Error fetching jobs, returning mock data'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, cover_letter, job_id } = body

    if (!name || !email || !cover_letter || !job_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[v0] Job application received:', { name, email, job_id })

    // Here you would save to database or send to email service
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: Date.now(),
        name,
        email,
        job_id,
        submitted_at: new Date()
      }
    })
  } catch (error: any) {
    console.error('[v0] Error submitting application:', error?.message)
    return NextResponse.json(
      { error: 'Error submitting application' },
      { status: 500 }
    )
  }
}
