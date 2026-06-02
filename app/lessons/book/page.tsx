"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Star } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function BookLessonPage() {
  const [date, setDate] = useState<Date>()
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedInstrument, setSelectedInstrument] = useState("")

  const teachers = [
    {
      id: 1,
      name: "Sarah Johnson",
      instrument: "Piano",
      rating: 4.9,
      price: 75,
      image: "/piano-teacher.png",
      availability: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      instrument: "Guitar",
      rating: 4.8,
      price: 65,
      image: "/guitar-teacher.png",
      availability: ["11:00 AM", "1:00 PM", "4:00 PM", "5:00 PM"],
    },
    {
      id: 3,
      name: "Alex Thompson",
      instrument: "Drums",
      rating: 4.7,
      price: 70,
      image: "/drum-teacher.png",
      availability: ["10:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"],
    },
  ]

  const selectedTeacherData = teachers.find((t) => t.id.toString() === selectedTeacher)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Book a Private Lesson</h1>
        <p className="text-xl text-muted-foreground">Schedule one-on-one lessons with our expert instructors</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
            <CardDescription>Fill in your lesson preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument</Label>
              <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piano">Piano</SelectItem>
                  <SelectItem value="guitar">Guitar</SelectItem>
                  <SelectItem value="drums">Drums</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Select Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name} - {teacher.instrument} (${teacher.price}/hour)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {selectedTeacherData && (
              <div className="space-y-2">
                <Label htmlFor="time">Available Times</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTeacherData.availability.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Special Requests (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific topics you'd like to focus on..."
                className="min-h-[100px]"
              />
            </div>

            {selectedTeacherData && date && selectedTime && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">Lesson Summary</h3>
                <div className="text-sm space-y-1">
                  <div>Teacher: {selectedTeacherData.name}</div>
                  <div>Date: {format(date, "PPP")}</div>
                  <div>Time: {selectedTime}</div>
                  <div>Duration: 1 hour</div>
                  <div className="font-semibold">Total: ${selectedTeacherData.price}</div>
                </div>
              </div>
            )}

            <Link href="/lessons/payment">
              <Button className="w-full" disabled={!selectedTeacherData || !date || !selectedTime}>
                Continue to Payment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Teacher Profiles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Instructors</h2>
          {teachers.map((teacher) => (
            <Card key={teacher.id} className={selectedTeacher === teacher.id.toString() ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={teacher.image || "/placeholder.svg"}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{teacher.name}</h3>
                      <Badge variant="secondary">${teacher.price}/hour</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{teacher.instrument} Instructor</p>
                    <div className="flex items-center text-sm mb-3">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{teacher.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Next available: {teacher.availability[0]}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
