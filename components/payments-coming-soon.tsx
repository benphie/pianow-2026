import type React from "react"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Shown wherever a payment would happen until a real payment provider is connected.
// Card numbers and wallet PINs must only ever be entered on the provider's own form.
export default function PaymentsComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Online payments are coming soon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">{children}</CardContent>
    </Card>
  )
}
