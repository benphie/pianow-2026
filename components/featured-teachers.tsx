import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users } from "lucide-react"
import Link from "next/link"

export default function FeaturedTeachers() {
  const teachers = [
    {
      id: 1,
      name: "Sarah Johnson",
      instrument: "Piano",
      experience: "15+ years",
      rating: 4.9,
      students: 1234,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Classical", "Jazz", "Beginner-friendly"],
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      instrument: "Guitar",
      experience: "12+ years",
      rating: 4.8,
      students: 987,
      image: "/placeholder.svg?height=200&width=200",
      specialties: ["Rock", "Blues", "Acoustic"],
    },
    {
      id: 3,
      name: "Alex Thompson",
      instrument: "Drums",
      experience: "10+ years",
      rating: 4.7,
      students: 756,
      image: "/drum-teacher.png",
      specialties: ["Rock", "Jazz", "Latin"],
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <img
              src={teacher.image || "/placeholder.svg"}
              alt={teacher.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <CardTitle>{teacher.name}</CardTitle>
            <CardDescription>
              {teacher.instrument} • {teacher.experience}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center mb-4 space-x-4">
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{teacher.rating}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>{teacher.students.toLocaleString()} students</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 justify-center mb-4">
              {teacher.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
            <Link href={`/teachers/${teacher.id}`}>
              <Button className="w-full">View Profile</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
