import Link from "next/link"
import { Button } from "@/components/ui/button"
import PaymentsComingSoon from "@/components/payments-coming-soon"

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Lesson Payment</h1>

      <PaymentsComingSoon>
        <p>We can't take lesson payments on the site yet, so your lesson has not been booked and nothing will be charged.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/lessons">Browse Lessons</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/teachers">Find a Teacher</Link>
          </Button>
        </div>
      </PaymentsComingSoon>
    </div>
  )
}
