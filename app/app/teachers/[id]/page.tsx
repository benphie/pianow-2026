"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Clock, Globe, MapPin, MessageSquare, Star, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TeacherPage({ params }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = useState("")
  const [activeTab, setActiveTab] = useState("about")

  // This would normally come from an API call using the ID
  const teacher = {
    id: params.id,
    name: "Sarah Johnson",
    specialty: "Piano & Keyboard",
    location: "New York, USA",
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg?height=400&width=400",
    hourlyRate: 45,
    experience: 12,
    languages: ["English", "French"],
    availability: ["Weekdays", "Evenings"],
    bio: "Sarah Johnson is a classically trained pianist with over 12 years of teaching experience. She holds a Master's degree in Piano Performance from Juilliard School of Music and has performed in prestigious venues across the United States and Europe. Sarah specializes in classical piano but is also proficient in jazz and contemporary styles. Her teaching approach focuses on proper technique, music theory, and fostering a love for music in her students.",
    education: [
      "Master of Music in Piano Performance, Juilliard School of Music",
      "Bachelor of Arts in Music, Yale University",
    ],
    certifications: [
      "Certified Piano Teacher, American College of Musicians",
      "Suzuki Piano Method Certification, Levels 1-3",
    ],
    lessonTypes: ["In-person", "Online"],
    studentLevels: ["Beginner", "Intermediate", "Advanced"],
    reviewsData: [
      {
        id: 1,
        name: "Michael P.",
        rating: 5,
        date: "March 15, 2023",
        comment:
          "Sarah is an exceptional teacher! Her patience and expertise helped me progress much faster than I expected. Highly recommend!",
      },
      {
        id: 2,
        name: "Emma L.",
        rating: 5,
        date: "February 2, 2023",
        comment:
          "My 8-year-old daughter loves her lessons with Sarah. She makes learning piano fun and engaging while still being thorough with technique.",
      },
      {
        id: 3,
        name: "David K.",
        rating: 4,
        date: "January 10, 2023",
        comment: "Great teacher who really knows her stuff. Very professional and accommodating with scheduling.",
      },
    ],
  }

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <Link href="/teachers" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Teachers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Teacher Profile */}
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative h-[200px] w-[200px] rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0">
              <Image src={teacher.image || "/placeholder.svg"} alt={teacher.name} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <Badge className="mb-2 bg-rose-100 text-rose-800 hover:bg-rose-200">{teacher.specialty}</Badge>
              <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>

              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {teacher.location}
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(teacher.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm">
                    {teacher.rating} ({teacher.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                  <div className="font-medium">{teacher.experience} years</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                  <div className="font-medium">{teacher.languages.join(", ")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Lesson Types</div>
                  <div className="font-medium">{teacher.lessonTypes.join(", ")}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Student Levels</div>
                  <div className="font-medium">{teacher.studentLevels.join(", ")}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-rose-600 hover:bg-rose-700" asChild>
                  <Link href="/lessons/tracker">
                    <Video className="h-4 w-4 mr-2" />
                    Book Online Lesson
                  </Link>
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Biography</h2>
                  <p>{teacher.bio}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-2">Education</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {teacher.education.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-2">Certifications</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {teacher.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Student Reviews</h2>
                  <Button variant="outline">Write a Review</Button>
                </div>

                <div className="space-y-4">
                  {teacher.reviewsData.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lessons" className="pt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-2">Available Lessons</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Private Piano Lessons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>30, 45, or 60 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>In-person or Online</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span>From ${teacher.hourlyRate}/hour</span>
                        </div>
                        <Button className="w-full mt-4" asChild>
                          <Link href="/lessons/book">Book Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Group Piano Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>60 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>In-person only</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span>$30/session</span>
                        </div>
                        <Button className="w-full mt-4" asChild>
                          <Link href="/lessons/book">Book Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Widget */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book a Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Select Date</h3>
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Available Time Slots</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={timeSlot === slot ? "default" : "outline"}
                        className={timeSlot === slot ? "bg-rose-600 hover:bg-rose-700" : ""}
                        onClick={() => setTimeSlot(slot)}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Lesson Type</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lesson type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Lesson Duration</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Lesson Fee</span>
                    <span>${teacher.hourlyRate}/hour</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Platform Fee</span>
                    <span>$5.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${teacher.hourlyRate + 5}.00</span>
                  </div>
                </div>

                <Button className="w-full bg-rose-600 hover:bg-rose-700" asChild>
                  <Link href="/lessons/book">Book Now</Link>
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 inline mr-1" />
                  All times are shown in your local timezone
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Teachers */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Similar Teachers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <Card key={id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <Link href={`/teachers/${id}`}>
                  <div className="relative h-[200px] w-full">
                    <Image src="/placeholder.svg?height=300&width=300" alt="Teacher" fill className="object-cover" />
                  </div>
                </Link>
                <div className="p-4">
                  <Badge className="mb-2 bg-rose-100 text-rose-800 hover:bg-rose-200">Piano & Keyboard</Badge>
                  <Link href={`/teachers/${id}`} className="hover:underline">
                    <h3 className="font-medium text-lg">Thomas Schmidt</h3>
                  </Link>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    Berlin, Germany
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground text-sm ml-1">(105 reviews)</span>
                  </div>
                  <div className="mt-2 font-bold">$48/hour</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
