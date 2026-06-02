"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const lessonDetails = {
    teacher: "Sarah Johnson",
    instrument: "Piano",
    date: "December 15, 2024",
    time: "2:00 PM",
    duration: "1 hour",
    price: 75,
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment successful!",
        description: "Your lesson has been booked successfully.",
      })
      router.push("/lessons/payment/success")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Complete Your Booking</h1>
        <p className="text-xl text-muted-foreground">Choose your payment method to secure your lesson</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Payment Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you'd like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5" />
                  <Label htmlFor="card" className="flex-1">
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  <Smartphone className="h-5 w-5" />
                  <Label htmlFor="mpesa" className="flex-1">
                    M-Pesa
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <DollarSign className="h-5 w-5" />
                  <Label htmlFor="paypal" className="flex-1">
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Smartphone className="h-5 w-5" />
                  <Label htmlFor="mobile" className="flex-1">
                    Mobile Money
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="espees" id="espees" />
                  <DollarSign className="h-5 w-5" />
                  <Label htmlFor="espees" className="flex-1">
                    Espees Wallet
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          {paymentMethod === "card" && (
            <Card>
              <CardHeader>
                <CardTitle>Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" placeholder="John Doe" />
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "mpesa" && (
            <Card>
              <CardHeader>
                <CardTitle>M-Pesa Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+254 700 000 000" />
                </div>
                <p className="text-sm text-muted-foreground">You will receive a payment request on your phone</p>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "mobile" && (
            <Card>
              <CardHeader>
                <CardTitle>Mobile Money</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <select className="w-full p-2 border rounded">
                    <option>Select Provider</option>
                    <option>MTN Mobile Money</option>
                    <option>Airtel Money</option>
                    <option>Tigo Cash</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input id="mobileNumber" placeholder="Enter your mobile number" />
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "paypal" && (
            <Card>
              <CardHeader>
                <CardTitle>PayPal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to PayPal to complete your payment
                </p>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "espees" && (
            <Card>
              <CardHeader>
                <CardTitle>Espees Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="espeesEmail">Espees Wallet Email</Label>
                  <Input id="espeesEmail" placeholder="your@email.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="espeesPassword">Espees Wallet Password</Label>
                  <Input id="espeesPassword" placeholder="Enter your password" type="password" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to Espees Wallet to complete your payment
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Lesson Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teacher</span>
                <span>{lessonDetails.teacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Instrument</span>
                <span>{lessonDetails.instrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{lessonDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{lessonDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{lessonDetails.duration}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${lessonDetails.price}</span>
            </div>

            <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay $${lessonDetails.price}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
