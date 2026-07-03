import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin, Search } from "lucide-react"
import Link from "next/link"

export default function TeachersPage() {
  const featuredTeachers = [
    {
      id: 1,
      name: "Sarah Johnson",
      instrument: "Piano",
      experience: "15+ years",
      rating: 4.9,
      students: 1234,
      location: "Los Angeles, CA",
      hourlyRate: 75,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Classical", "Jazz", "Beginner-friendly"],
      bio: "Classically trained pianist with a passion for teaching students of all ages. Specializes in building strong fundamentals while making learning enjoyable.",
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      instrument: "Guitar",
      experience: "12+ years",
      rating: 4.8,
      students: 987,
      location: "Nashville, TN",
      hourlyRate: 65,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Rock", "Blues", "Acoustic"],
      bio: "Professional guitarist and songwriter with extensive performance experience. Focuses on practical skills and helping students play their favorite songs.",
    },
    {
      id: 3,
      name: "Alex Thompson",
      instrument: "Drums",
      experience: "10+ years",
      rating: 4.7,
      students: 756,
      location: "New York, NY",
      hourlyRate: 70,
      image: "/drum-teacher.png",
      specialties: ["Rock", "Jazz", "Latin"],
      bio: "Studio drummer and percussion specialist. Known for patient teaching style and ability to help students develop solid rhythm and timing.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Music Teachers</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Learn from experienced professionals who are passionate about music education
        </p>
        <div className="flex gap-4">
          <Link href="/teachers/find">
            <Button size="lg">
              <Search className="h-4 w-4 mr-2" />
              Find a Teacher
            </Button>
          </Link>
          <Link href="/lessons/book">
            <Button variant="outline" size="lg">
              Book a Lesson
            </Button>
          </Link>
          <Link href="/teachers/upload">
            <Button variant="outline" size="lg">
              Upload Video
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featuredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <img
                src={teacher.image || "/placeholder.svg"}
                alt={teacher.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <CardTitle className="text-xl">{teacher.name}</CardTitle>
              <CardDescription>
                {teacher.instrument} • {teacher.experience}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{teacher.bio}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{teacher.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{teacher.students.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{teacher.location}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-lg font-bold">${teacher.hourlyRate}/hour</span>
                  <Link href={`/teachers/${teacher.id}`}>
                    <Button>View Profile</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Want to Become a Teacher?</h2>
        <p className="text-muted-foreground mb-6">
          Share your musical expertise and help students around the world learn to play
        </p>
        <Link href="/teachers/apply">
          <Button size="lg">Apply to Teach</Button>
        </Link>
      </div>
    </div>
  )
}
