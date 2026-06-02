import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Yamaha CP88 Stage Piano",
      price: 2499,
      originalPrice: 2799,
      image: "/PHOTOS FOR THE APP/YAMAHA CP88/Yamaha CP88.avif",
      rating: 4.9,
      reviews: 156,
      badge: "Professional",
    },
    {
      id: 2,
      name: "Casio Privia PX-870 Digital Piano",
      price: 899,
      originalPrice: 1099,
      image: "/PHOTOS FOR THE APP/CASIO PRIVIA PX 870/Casio Privia PX-870.avif",
      rating: 4.7,
      reviews: 203,
      badge: "Best Seller",
    },
    {
      id: 3,
      name: "Kawai ES920 Digital Piano",
      price: 1899,
      originalPrice: 2199,
      image: "/PHOTOS FOR THE APP/KAWAI ES920/Kawai ES920a.jpg",
      rating: 4.8,
      reviews: 127,
      badge: "Premium",
    },
    {
      id: 4,
      name: "Roland FP-30X Digital Piano",
      price: 799,
      image: "/PHOTOS FOR THE APP/ROLAND FP 30X/Roland FP-30X.jpg",
      rating: 4.6,
      reviews: 189,
      badge: "Compact",
    },
    {
      id: 5,
      name: "Korg Grand Stage 88",
      price: 3299,
      originalPrice: 3599,
      image: "/PHOTOS FOR THE APP/KORG GRAND STAGE 88/Korg Grandstage 88.jpg",
      rating: 4.9,
      reviews: 89,
      badge: "Flagship",
    },
    {
      id: 6,
      name: "Yamaha PSR-E473 Keyboard",
      price: 399,
      image: "/PHOTOS FOR THE APP/YAMAHA PSR E 473/Yamaha PSR-E473.jpg",
      rating: 4.5,
      reviews: 312,
      badge: "Beginner",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
            <Badge className="absolute top-2 left-2">{product.badge}</Badge>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2">{product.name}</CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through mr-2">${product.originalPrice}</span>
                )}
                <span className="text-xl font-bold">${product.price}</span>
              </div>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{product.rating}</span>
                <span className="text-muted-foreground ml-1">({product.reviews})</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href={`/shop/product/${product.id}`}>
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
  )
}
