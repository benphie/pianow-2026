import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Users, ShoppingCart, BookOpen, Tv } from "lucide-react"
import Link from "next/link"
import FeaturedTeachers from "@/components/featured-teachers"
import FeaturedProducts from "@/components/featured-products"
import NewReleases from "@/components/new-releases"
import { AnimatedCartoonPianoStrip } from "@/components/animated-cartoon-piano"

export default function HomePage() {
  const stats = [
    { number: "10,000+", label: "Students" },
    { number: "500+", label: "Lessons" },
    { number: "50+", label: "Instructors" },
    { number: "4.9", label: "Rating" },
  ]

  const features = [
    {
      icon: BookOpen,
      title: "Video Lessons",
      description: "Access thousands of high-quality video lessons from beginner to advanced levels",
      href: "/lessons",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from professional musicians and certified music teachers",
      href: "/teachers",
    },
    {
      icon: ShoppingCart,
      title: "Music Store",
      description: "Shop premium instruments, equipment, and accessories for your musical journey",
      href: "/shop",
    },
    {
      icon: Tv,
      title: "Live Sessions",
      description: "Join interactive live music sessions and connect with fellow students",
      href: "/live",
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-950 text-white py-24 lg:py-28">
        {/* Blended Background Instrument Ensemble Layer */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/hero-instruments-purple.jpg"
            alt="Musical instruments studio backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-lighten scale-105"
          />
          {/* Deep Purple Radial & Linear Vignette Overlays for Seamless Blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-800/80 via-purple-700/55 to-purple-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(59,7,100,0.85)_100%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-center">
              Master Music with
              <span className="block text-purple-200">Expert Guidance</span>
            </h1>
            <p className="text-xl mb-8 text-purple-100 leading-relaxed max-w-2xl mx-auto text-center">
              Browse thousands of lessons from expert instructors and begin learning today. From piano to guitar,
              drums to vocals - your musical journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link href="/lessons">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 font-semibold shadow-lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-700 bg-transparent font-semibold"
                >
                  Explore Store
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Centerpiece Blended Instrument Image */}
            <div className="relative mt-10 w-full max-w-3xl mx-auto">
              <div className="absolute -inset-4 bg-purple-500/25 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="/hero-instruments-purple.jpg"
                  alt="Drums, guitars, and keyboard ensemble"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[380px] object-cover object-center mx-auto mix-blend-screen opacity-95 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_98%)]"
                />
                <div className="
                  absolute inset-0 pointer-events-none
                  bg-gradient-to-t from-purple-950/70 via-transparent to-purple-800/40
                " />
              </div>
            </div>

            {/* Animated Cartoon Rhythm Strip */}
            <div className="flex justify-center w-full">
              <AnimatedCartoonPianoStrip />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Learn Music</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From structured lessons to quality instruments, we provide all the tools for your musical success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Link href={feature.href}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet Our Expert Instructors</h2>
            <p className="text-xl text-muted-foreground">Learn from professional musicians and certified teachers</p>
          </div>
          <FeaturedTeachers />
        </div>
      </section>

      {/* New Releases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest Lessons</h2>
            <p className="text-xl text-muted-foreground">Fresh content added weekly by our expert instructors</p>
          </div>
          <NewReleases />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Premium Instruments</h2>
            <p className="text-xl text-muted-foreground">Quality instruments and equipment for every level</p>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Musical Journey?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students who have transformed their musical skills with PIANOW
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
                Start Learning Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
