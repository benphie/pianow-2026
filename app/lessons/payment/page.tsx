"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Wallet, CheckCircle2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [mobileProvider, setMobileProvider] = useState<"mtn_uganda" | "airtel_uganda" | "mpesa">("mtn_uganda")
  const [mobilePhone, setMobilePhone] = useState("")
  const [mobileName, setMobileName] = useState("")
  const [espeesHandle, setEspeesHandle] = useState("")
  const [espeesPin, setEspeesPin] = useState("")
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

    let methodLabel = "Credit/Debit Card"
    if (paymentMethod === "mobile" || paymentMethod === "mpesa") {
      if (mobileProvider === "mtn_uganda") methodLabel = "MTN Mobile Money (Uganda)"
      else if (mobileProvider === "airtel_uganda") methodLabel = "Airtel Money (Uganda)"
      else methodLabel = "M-Pesa"
    } else if (paymentMethod === "espees") {
      methodLabel = "Espees Wallet"
    } else if (paymentMethod === "paypal") {
      methodLabel = "PayPal"
    }

    try {
      sessionStorage.setItem("pianow_last_lesson_payment", methodLabel)
    } catch (e) {}

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment successful!",
        description: `Your lesson has been booked successfully via ${methodLabel}.`,
      })
      router.push("/lessons/payment/success")
    }, 1200)
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
              <CardDescription>Choose how you&apos;d like to pay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod === "mpesa" ? "mobile" : paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <Label htmlFor="card" className="font-medium cursor-pointer">
                      Credit/Debit Card
                    </Label>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, American Express</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Smartphone className="h-5 w-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Label htmlFor="mobile" className="font-medium cursor-pointer">
                        Mobile Money
                      </Label>
                      <span className="text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">MTN Uganda</span>
                      <span className="text-[11px] font-semibold bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded">Airtel Uganda</span>
                      <span className="text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">M-Pesa</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Pay via MTN MoMo Uganda, Airtel Money Uganda, or Safaricom M-Pesa</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="espees" id="espees" />
                  <Wallet className="h-5 w-5 text-indigo-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="espees" className="font-medium cursor-pointer">
                        Espees Wallet
                      </Label>
                      <span className="text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded">KingsChat / Espees Pay</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Instant checkout using your Espees account balance</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">P</div>
                  <div className="flex-1">
                    <Label htmlFor="paypal" className="font-medium cursor-pointer">
                      PayPal
                    </Label>
                    <p className="text-xs text-muted-foreground">Safe, fast checkout with your PayPal balance or linked bank</p>
                  </div>
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

          {(paymentMethod === "mobile" || paymentMethod === "mpesa") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mobile Money Details</CardTitle>
                  <span className="text-xs text-muted-foreground">East Africa / Uganda</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Network Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileProvider("mtn_uganda")}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      mobileProvider === "mtn_uganda"
                        ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400 font-semibold shadow-xs"
                        : "border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center shadow-xs">
                      MTN
                    </span>
                    <span className="text-xs font-bold leading-tight">MTN Uganda</span>
                    <span className="text-[10px] text-muted-foreground">+256 (MoMo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileProvider("airtel_uganda")}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      mobileProvider === "airtel_uganda"
                        ? "border-red-500 bg-red-50/80 dark:bg-red-950/40 text-red-900 dark:text-red-200 ring-2 ring-red-400 font-semibold shadow-xs"
                        : "border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      airtel
                    </span>
                    <span className="text-xs font-bold leading-tight">Airtel Uganda</span>
                    <span className="text-[10px] text-muted-foreground">+256 (Money)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileProvider("mpesa")}
                    className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      mobileProvider === "mpesa"
                        ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400 font-semibold shadow-xs"
                        : "border-border hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      M
                    </span>
                    <span className="text-xs font-bold leading-tight">M-Pesa</span>
                    <span className="text-[10px] text-muted-foreground">+254 (Safaricom)</span>
                  </button>
                </div>

                {/* Subscriber Name */}
                <div className="space-y-2">
                  <Label htmlFor="mobileName" className="text-xs font-medium">Registered Account Name</Label>
                  <Input
                    id="mobileName"
                    value={mobileName}
                    onChange={(e) => setMobileName(e.target.value)}
                    placeholder={
                      mobileProvider === "mtn_uganda"
                        ? "Name registered on MTN SIM (e.g. John Okello)"
                        : mobileProvider === "airtel_uganda"
                        ? "Name registered on Airtel SIM (e.g. Sarah Namubiru)"
                        : "Name registered on M-Pesa account"
                    }
                  />
                </div>

                {/* Phone Input with Country Code */}
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone" className="text-xs font-medium">
                    {mobileProvider === "mtn_uganda" && "MTN Uganda Phone Number"}
                    {mobileProvider === "airtel_uganda" && "Airtel Uganda Phone Number"}
                    {mobileProvider === "mpesa" && "M-Pesa Phone Number"}
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-xs font-medium text-muted-foreground">
                      {mobileProvider === "mpesa" ? "+254 (KE)" : "+256 (UG)"}
                    </span>
                    <Input
                      id="mobilePhone"
                      value={mobilePhone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      placeholder={
                        mobileProvider === "mtn_uganda"
                          ? "770 123 456 (or 0770...)"
                          : mobileProvider === "airtel_uganda"
                          ? "700 123 456 (or 0700...)"
                          : "712 345 678 (or 0712...)"
                      }
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                {/* Push notification banner */}
                <div className="p-3 bg-muted/60 rounded-md border text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Instant Push Notification</span>
                  </div>
                  <p>
                    {mobileProvider === "mtn_uganda" &&
                      "A push prompt will appear on your MTN Uganda phone. Enter your MTN Mobile Money PIN to approve payment."}
                    {mobileProvider === "airtel_uganda" &&
                      "A USSD prompt will appear on your Airtel Uganda phone. Enter your Airtel Money PIN to confirm."}
                    {mobileProvider === "mpesa" &&
                      "An STK push will appear on your phone. Enter your M-Pesa PIN to complete the transaction."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "espees" && (
            <Card className="border-purple-200 dark:border-purple-800/60 bg-gradient-to-br from-purple-50/70 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      ESP
                    </div>
                    <div>
                      <CardTitle className="text-base">Espees Wallet Checkout</CardTitle>
                      <CardDescription className="text-[11px]">KingsChat & Loveworld Digital Wallet</CardDescription>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    1 Espee ≈ $1.00 USD
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="espeesHandle" className="text-xs font-medium">Espees Username or Registered Email/Phone</Label>
                  <Input
                    id="espeesHandle"
                    value={espeesHandle}
                    onChange={(e) => setEspeesHandle(e.target.value)}
                    placeholder="e.g. @johndoe or user@kingschat.online"
                    className="bg-white dark:bg-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="espeesPin" className="text-xs font-medium">Espees Wallet PIN / Passcode</Label>
                  <Input
                    id="espeesPin"
                    type="password"
                    value={espeesPin}
                    onChange={(e) => setEspeesPin(e.target.value)}
                    placeholder="••••••"
                    className="bg-white dark:bg-gray-900"
                    maxLength={8}
                  />
                </div>
                <div className="p-3 bg-white/80 dark:bg-gray-900/80 rounded-md border border-purple-100 dark:border-purple-900/40 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-purple-900 dark:text-purple-300">
                    <Shield className="h-3.5 w-3.5 text-purple-600" />
                    <span>Zero Processing Fees & Instant Transfer</span>
                  </div>
                  <p>
                    Funds will be deducted from your Espees account balance upon clicking Pay.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "paypal" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    P
                  </div>
                  <CardTitle>PayPal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You will be securely redirected to PayPal to complete your lesson booking.
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
