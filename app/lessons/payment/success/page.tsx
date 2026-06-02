import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Clock, User, Music } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const lessonDetails = {
    bookingId: "BK-2024-001234",
    teacher: "Sarah Johnson",
    instrument: "Piano",
    date: "December 15, 2024",
    time: "2:00 PM",
    duration: "1 hour",
    price: 75,
    meetingLink: "https://meet.pianow.com/lesson/abc123",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">Your lesson has been booked successfully</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Confirmation</CardTitle>
            <CardDescription>Booking ID: {lessonDetails.bookingId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Instructor</p>
                  <p className="text-muted-foreground">{lessonDetails.teacher}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Instrument</p>
                  <p className="text-muted-foreground">{lessonDetails.instrument}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {lessonDetails.date} at {lessonDetails.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">{lessonDetails.duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Meeting Link</h3>
              <p className="text-sm text-muted-foreground mb-2">Join your lesson using the link below:</p>
              <code className="block p-2 bg-white rounded text-sm break-all">{lessonDetails.meetingLink}</code>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• You'll receive a confirmation email with all the details</li>
                <li>• A calendar invite will be sent to your email</li>
                <li>• Your instructor will contact you 24 hours before the lesson</li>
                <li>• Join the meeting link 5 minutes before your scheduled time</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/lessons">
            <Button variant="outline">Browse More Lessons</Button>
          </Link>
          <Link href="/lessons/tracker">
            <Button>View My Progress</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
