'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Briefcase, 
  Heart, 
  Users, 
  TrendingUp, 
  Bell, 
  CheckCircle,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function CareersPage() {
  const [email, setEmail] = useState('')
  const [notificationSent, setNotificationSent] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isApplying, setIsApplying] = useState(false)

  const jobListings = [
    {
      id: 1,
      title: 'Music Teacher - Piano',
      department: 'Education',
      location: 'Remote',
      type: 'Full-time',
      salary: '$40,000 - $60,000',
      description: 'Join our team of experienced music educators and inspire the next generation of musicians. We&apos;re looking for passionate piano teachers to create engaging lessons and mentor students of all levels.',
      requirements: [
        'Bachelor\'s degree in Music or equivalent experience',
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
      ]
    },
    {
      id: 2,
      title: 'Content Creator - Music Tutorials',
      department: 'Content',
      location: 'Remote',
      type: 'Full-time',
      salary: '$35,000 - $55,000',
      description: 'Create engaging music tutorial content for our platform. We need creative individuals who can produce high-quality video lessons, guides, and tips for aspiring musicians.',
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
      ]
    },
    {
      id: 3,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Hybrid',
      type: 'Full-time',
      salary: '$50,000 - $70,000',
      description: 'Drive growth for PIANOW by developing and executing marketing strategies. Help us reach more music learners and teachers around the world.',
      requirements: [
        'Bachelor\'s degree in Marketing or related field',
        '4+ years of marketing experience',
        'Digital marketing expertise',
        'Strong analytical skills',
        'Project management experience'
      ],
      responsibilities: [
        'Develop marketing campaigns and strategies',
        'Manage social media and content marketing',
        'Analyze campaign performance metrics',
        'Collaborate with product and design teams',
        'Lead marketing initiatives and promotions'
      ]
    },
    {
      id: 4,
      title: 'Guitar Teacher - Beginner Focus',
      department: 'Education',
      location: 'Remote',
      type: 'Part-time',
      salary: '$25 - $40/hour',
      description: 'Help beginners start their guitar journey! We&apos;re recruiting experienced guitar instructors to teach beginner and intermediate students one-on-one and in group sessions.',
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
      ]
    },
    {
      id: 5,
      title: 'Community Manager',
      department: 'Community',
      location: 'Remote',
      type: 'Full-time',
      salary: '$35,000 - $50,000',
      description: 'Build and nurture our vibrant community of musicians and learners. Engage with users, moderate discussions, and create opportunities for connection.',
      requirements: [
        'Experience in community management',
        'Strong communication skills',
        'Passion for music and learning',
        'Social media expertise',
        'Conflict resolution abilities'
      ],
      responsibilities: [
        'Moderate platform discussions and forums',
        'Respond to user inquiries and feedback',
        'Organize community events and challenges',
        'Create engaging community content',
        'Build relationships with community members'
      ]
    }
  ]

  const careerGuidance = [
    {
      id: 1,
      title: 'How to Become a Music Teacher',
      category: 'Getting Started',
      description: 'Learn the steps to start a career in music education, from education requirements to landing your first position.',
      tips: [
        'Get formal music education or certification',
        'Develop strong performance skills on your instrument',
        'Build a portfolio of your teaching experience',
        'Network with other music educators',
        'Consider specializing in a particular age group or level'
      ]
    },
    {
      id: 2,
      title: 'Creating Engaging Online Lessons',
      category: 'Teaching Tips',
      description: 'Master the art of teaching music online with strategies that keep students engaged and motivated.',
      tips: [
        'Invest in quality audio and video equipment',
        'Keep lessons interactive with Q&A sessions',
        'Use visual aids and screen sharing tools',
        'Create structured lesson plans with clear goals',
        'Record lessons for students to review later'
      ]
    },
    {
      id: 3,
      title: 'Music Career Opportunities Beyond Teaching',
      category: 'Career Paths',
      description: 'Explore diverse career options in the music industry including content creation, music therapy, and more.',
      tips: [
        'Content creation and YouTube monetization',
        'Music composition and licensing',
        'Music therapy and wellness coaching',
        'Event coordination and performance booking',
        'Music production and sound engineering'
      ]
    },
    {
      id: 4,
      title: 'Building Your Personal Brand as a Musician',
      category: 'Professional Development',
      description: 'Develop a strong professional presence to attract students and opportunities in your music career.',
      tips: [
        'Create a professional website or portfolio',
        'Use social media to showcase your expertise',
        'Share valuable music tips and content',
        'Get testimonials from satisfied students',
        'Collaborate with other musicians and educators'
      ]
    },
    {
      id: 5,
      title: 'Income Strategies for Music Educators',
      category: 'Business',
      description: 'Learn multiple ways to generate income as a music educator and diversify your revenue streams.',
      tips: [
        'One-on-one private lessons',
        'Group classes and workshops',
        'Creating online courses',
        'Selling lesson materials and resources',
        'Freelance content creation'
      ]
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: 'Flexible Schedule',
      description: 'Work on your own terms with flexible hours and remote opportunities'
    },
    {
      icon: TrendingUp,
      title: 'Professional Growth',
      description: 'Access training, resources, and opportunities to advance your career'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with passionate musicians and educators worldwide'
    },
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Earn competitive rates with potential for performance bonuses'
    }
  ]

  const handleNotificationSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      // Simulate API call
      console.log('[v0] Signing up for notifications:', email)
      setNotificationSent(true)
      setEmail('')
      setTimeout(() => setNotificationSent(false), 3000)
    } catch (error) {
      console.error('[v0] Error signing up:', error)
    }
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsApplying(true)
    
    try {
      // Simulate API call
      console.log('[v0] Application submitted for job:', selectedJob?.id)
      setTimeout(() => {
        setIsApplying(false)
        setSelectedJob(null)
      }, 2000)
    } catch (error) {
      console.error('[v0] Error submitting application:', error)
      setIsApplying(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join the PIANOW Team</h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Help us inspire the next generation of musicians and educators
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                Learn About PIANOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Job Notifications Signup */}
        <Card className="mb-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Get Job Notifications
            </CardTitle>
            <CardDescription>
              Be the first to know about new positions that match your skills and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNotificationSignup} className="flex flex-col md:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {notificationSent ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Open Positions</TabsTrigger>
            <TabsTrigger value="guidance">Career Guidance</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="space-y-4">
              {jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{job.department}</Badge>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-sm text-foreground mt-3">{job.description}</p>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full md:w-auto"
                          onClick={() => setSelectedJob(job)}
                        >
                          View Details & Apply
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{selectedJob?.title}</DialogTitle>
                          <DialogDescription>
                            {selectedJob?.department} • {selectedJob?.type} • {selectedJob?.location}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">About the Role</h3>
                            <p className="text-sm text-muted-foreground">{selectedJob?.description}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Requirements</h3>
                            <ul className="space-y-1">
                              {selectedJob?.requirements.map((req: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Responsibilities</h3>
                            <ul className="space-y-1">
                              {selectedJob?.responsibilities.map((resp: string, idx: number) => (
                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                  <Briefcase className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <form onSubmit={handleApplicationSubmit} className="space-y-4 pt-4 border-t">
                            <div>
                              <label className="text-sm font-medium">Full Name</label>
                              <Input placeholder="Your name" required />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input type="email" placeholder="your@email.com" required />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Cover Letter</label>
                              <Textarea 
                                placeholder="Tell us why you're interested in this role..."
                                className="min-h-24"
                                required
                              />
                            </div>
                            <Button 
                              type="submit" 
                              className="w-full"
                              disabled={isApplying}
                            >
                              {isApplying ? 'Submitting...' : 'Submit Application'}
                            </Button>
                          </form>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Career Guidance Tab */}
          <TabsContent value="guidance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {careerGuidance.map((guide) => (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className="mb-2">{guide.category}</Badge>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Benefits Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Join PIANOW?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <Card key={idx} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 text-center">
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 border-0">
            <CardContent className="pt-12">
              <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our community of passionate musicians and educators. Help us democratize music education worldwide.
              </p>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Explore All Opportunities
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
