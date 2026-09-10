"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, Shield, Smartphone, Wallet, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [mobileProvider, setMobileProvider] = useState<"mtn_uganda" | "airtel_uganda" | "mpesa">("mtn_uganda")
  const [mobilePhone, setMobilePhone] = useState("")
  const [mobileName, setMobileName] = useState("")
  const [espeesHandle, setEspeesHandle] = useState("")
  const [espeesPin, setEspeesPin] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const cartItems = [
    { name: "Yamaha P-125 Digital Piano", price: 899, quantity: 1 },
    { name: "Audio-Technica ATH-M50x", price: 169, quantity: 2 },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
      sessionStorage.setItem("pianow_last_payment_method", methodLabel)
    } catch (err) {}

    setTimeout(() => {
      router.push(`/checkout/success?method=${encodeURIComponent(methodLabel)}`)
    }, 1200)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" required />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod === "mpesa" ? "mobile" : paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <Label htmlFor="card" className="font-medium cursor-pointer">Credit/Debit Card</Label>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, American Express</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Smartphone className="h-5 w-5 text-emerald-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Label htmlFor="mobile" className="font-medium cursor-pointer">Mobile Money</Label>
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
                        <Label htmlFor="espees" className="font-medium cursor-pointer">Espees Wallet</Label>
                        <span className="text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded">KingsChat / Espees Pay</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Instant checkout using your Espees account balance</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3.5 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">P</div>
                    <div className="flex-1">
                      <Label htmlFor="paypal" className="font-medium cursor-pointer">PayPal</Label>
                      <p className="text-xs text-muted-foreground">Safe, fast checkout with your PayPal balance or linked bank</p>
                    </div>
                  </div>
                </RadioGroup>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="mt-5 p-4 bg-muted/20 border rounded-lg space-y-4">
                    <h4 className="text-sm font-semibold text-foreground">Card Details</h4>
                    <div>
                      <Label htmlFor="cardNumber" className="text-xs font-medium">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-xs font-medium">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-1" required />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-xs font-medium">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardholder" className="text-xs font-medium">Cardholder Name</Label>
                      <Input id="cardholder" placeholder="Name as displayed on card" className="mt-1" required />
                    </div>
                  </div>
                )}

                {/* Mobile Money Details (MTN Uganda, Airtel Uganda, M-Pesa) */}
                {(paymentMethod === "mobile" || paymentMethod === "mpesa") && (
                  <div className="mt-5 p-4 bg-muted/20 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Select Mobile Money Provider</h4>
                      <span className="text-xs text-muted-foreground">East Africa / Uganda</span>
                    </div>

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
                    <div>
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
                        className="mt-1"
                      />
                    </div>

                    {/* Phone Input with Country Code */}
                    <div>
                      <Label htmlFor="mobilePhone" className="text-xs font-medium">
                        {mobileProvider === "mtn_uganda" && "MTN Uganda Phone Number"}
                        {mobileProvider === "airtel_uganda" && "Airtel Uganda Phone Number"}
                        {mobileProvider === "mpesa" && "M-Pesa Phone Number"}
                      </Label>
                      <div className="flex mt-1">
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
                          required
                        />
                      </div>
                    </div>

                    {/* Prompt Guide Notification */}
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
                  </div>
                )}

                {/* Espees Wallet Details */}
                {paymentMethod === "espees" && (
                  <div className="mt-5 p-4 bg-gradient-to-br from-purple-50/70 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800/60 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          ESP
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">Espees Wallet Checkout</h4>
                          <p className="text-[11px] text-muted-foreground">KingsChat & Loveworld Digital Wallet</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        1 Espee ≈ $1.00 USD
                      </span>
                    </div>

                    <div>
                      <Label htmlFor="espeesHandle" className="text-xs font-medium">Espees Username or Registered Email/Phone</Label>
                      <Input
                        id="espeesHandle"
                        value={espeesHandle}
                        onChange={(e) => setEspeesHandle(e.target.value)}
                        placeholder="e.g. @johndoe or user@kingschat.online"
                        className="mt-1 bg-white dark:bg-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="espeesPin" className="text-xs font-medium">Espees Wallet PIN / Passcode</Label>
                      <Input
                        id="espeesPin"
                        type="password"
                        value={espeesPin}
                        onChange={(e) => setEspeesPin(e.target.value)}
                        placeholder="••••••"
                        className="mt-1 bg-white dark:bg-gray-900"
                        maxLength={8}
                        required
                      />
                    </div>

                    <div className="p-3 bg-white/80 dark:bg-gray-900/80 rounded-md border border-purple-100 dark:border-purple-900/40 text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-purple-900 dark:text-purple-300">
                        <Shield className="h-3.5 w-3.5 text-purple-600" />
                        <span>Zero Processing Fees & Instant Transfer</span>
                      </div>
                      <p>
                        Funds will be automatically deducted from your Espees account balance upon confirming order.
                      </p>
                    </div>
                  </div>
                )}

                {/* PayPal Details */}
                {paymentMethod === "paypal" && (
                  <div className="mt-5 p-4 bg-muted/20 border rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        P
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">PayPal Checkout</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      After clicking &ldquo;Complete Order&rdquo;, you will be securely redirected to PayPal to complete your purchase using your PayPal balance or linked card.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Secure checkout with SSL encryption</span>
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium" size="lg" disabled={isProcessing}>
                  {isProcessing ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
