import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      name: "Yamaha P-125 Digital Piano",
      originalPrice: 899,
      salePrice: 699,
      discount: 22,
      image: "/yamaha-piano.png",
      rating: 4.8,
      reviews: 245,
      timeLeft: "2 days left",
      description: "88-key weighted action digital piano with authentic sound",
    },
    {
      id: 2,
      name: "Fender Player Stratocaster",
      originalPrice: 829,
      salePrice: 649,
      discount: 22,
      image: "/electric-guitar.png",
      rating: 4.9,
      reviews: 189,
      timeLeft: "5 days left",
      description: "Classic electric guitar with versatile pickup configuration",
    },
    {
      id: 3,
      name: "Audio-Technica ATH-M50x",
      originalPrice: 169,
      salePrice: 129,
      discount: 24,
      image: "/placeholder-3lbka.png",
      rating: 4.7,
      reviews: 567,
      timeLeft: "1 week left",
      description: "Professional monitor headphones for studio and mixing",
    },
    {
      id: 4,
      name: "Roland TD-17KV E-Drum Kit",
      originalPrice: 1199,
      salePrice: 999,
      discount: 17,
      image: "/roland-drums.png",
      rating: 4.6,
      reviews: 98,
      timeLeft: "3 days left",
      description: "Complete electronic drum kit with mesh heads and advanced sounds",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Special Deals & Sales</h1>
        <p className="text-xl text-muted-foreground">
          Limited-time offers on premium musical instruments and equipment
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {deals.map((deal) => (
          <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={deal.image || "/placeholder.svg"} alt={deal.name} className="w-full h-64 object-cover" />
              <Badge className="absolute top-4 left-4 bg-red-600 text-white">{deal.discount}% OFF</Badge>
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {deal.timeLeft}
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{deal.name}</CardTitle>
              <CardDescription>{deal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">${deal.salePrice}</span>
                  <span className="text-lg text-muted-foreground line-through">${deal.originalPrice}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{deal.rating}</span>
                  <span className="text-muted-foreground ml-1">({deal.reviews})</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href={`/shop/product/${deal.id}`}>
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Don't Miss Out!</h2>
        <p className="text-muted-foreground mb-6">
          Sign up for our newsletter to be the first to know about new deals and exclusive offers
        </p>
        <div className="flex max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 border rounded-l-md" />
          <Button className="rounded-l-none">Subscribe</Button>
        </div>
      </div>
    </div>
  )
}
