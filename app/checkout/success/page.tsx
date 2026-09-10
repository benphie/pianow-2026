"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, CreditCard, Smartphone, Wallet } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const [paymentMethod, setPaymentMethod] = useState<string>("Payment Completed")

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("pianow_last_payment_method")
      if (stored) {
        setPaymentMethod(stored)
      }
    } catch (e) {}
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <Card className="mb-8 text-left">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Order #ORD-2024-001234</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Items Ordered</p>
                  <p className="text-sm text-muted-foreground">
                    Yamaha P-125 Digital Piano, Audio-Technica ATH-M50x (×2)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 flex-shrink-0">
                  {paymentMethod.includes("Money") || paymentMethod.includes("M-Pesa") ? (
                    <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                  ) : paymentMethod.includes("Espees") ? (
                    <Wallet className="h-3.5 w-3.5 text-purple-600" />
                  ) : (
                    <CreditCard className="h-3.5 w-3.5 text-purple-600" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground font-medium text-foreground">
                    {paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">What&apos;s Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You&apos;ll receive a confirmation email with tracking information</li>
                <li>• We&apos;ll notify you when your order ships</li>
                <li>• You can track your package using the provided tracking number</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/lessons">
            <Button>Start Learning</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
