import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <Card className="mb-8">
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
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">What's Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You'll receive a confirmation email with tracking information</li>
                <li>• We'll notify you when your order ships</li>
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
