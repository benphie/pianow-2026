"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function FindTeachersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [selectedInstrument, setSelectedInstrument] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const teachers = [
    {
      id: 1,
      name: "Sarah Johnson",
      instrument: "Piano",
      experience: "15+ years",
      rating: 4.9,
      students: 1234,
      location: "Los Angeles, CA",
      hourlyRate: 75,
      availability: "Weekdays",
      image: "/placeholder.svg?height=150&width=150",
      specialties: ["Classical", "Jazz", "Beginner-friendly"],
      languages: ["English", "Spanish"],
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
      availability: "Flexible",
      image: "/placeholder.svg?height=150&width=150",
      specialties: ["Rock", "Blues", "Acoustic"],
      languages: ["English"],
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
      availability: "Evenings",
      image: "/drum-teacher.png",
      specialties: ["Rock", "Jazz", "Latin"],
      languages: ["English", "French"],
    },
  ]

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesInstrument =
      selectedInstrument === "all" || teacher.instrument.toLowerCase() === selectedInstrument.toLowerCase()
    const matchesLocation =
      !locationQuery || teacher.location.toLowerCase().includes(locationQuery.toLowerCase())

    return matchesSearch && matchesInstrument && matchesLocation
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Teacher</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Connect with qualified music instructors for personalized lessons
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search teachers by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Search by location (e.g., Los Angeles, CA)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instruments</SelectItem>
                <SelectItem value="piano">Piano</SelectItem>
                <SelectItem value="guitar">Guitar</SelectItem>
                <SelectItem value="drums">Drums</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
                <SelectItem value="15+">15+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
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
              <div className="space-y-4">
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

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{teacher.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{teacher.availability}</span>
                  </div>
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

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
