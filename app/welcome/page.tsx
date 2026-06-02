import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Users, ShoppingCart, Tv } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const features = [
    {
      icon: Music,
      title: "Expert Lessons",
      description: "Learn from professional musicians with structured video lessons and live sessions",
      href: "/lessons",
    },
    {
      icon: Users,
      title: "Find Teachers",
      description: "Connect with qualified instructors for personalized one-on-one lessons",
      href: "/teachers",
    },
    {
      icon: ShoppingCart,
      title: "Music Store",
      description: "Browse and purchase high-quality instruments, equipment, and accessories",
      href: "/shop",
    },
    {
      icon: Tv,
      title: "Live Sessions",
      description: "Join interactive live music sessions and workshops with other students",
      href: "/live",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img 
              src="/pianow logo1.png" 
              alt="PIANOW Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold mb-6 text-gray-900">
            Welcome to <span className="text-purple-600">PIANOW</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Your all-in-one platform for learning music, connecting with instructors, and building your musical journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3">
                Start Learning Today
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg" className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3">
                Explore Store
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover everything you need to enhance your musical journey
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={feature.title} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-purple-100 bg-white">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Link href={feature.href}>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-colors"
                    >
                      Explore
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Musical Journey?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their musical skills with PIANOW
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-700 px-8 py-3 font-semibold">
                Browse Lessons
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
