"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Yamaha P-125 Digital Piano",
      price: 899,
      image: "/yamaha-piano.png",
      rating: 4.8,
      reviews: 245,
      inStock: true,
      description: "88-key weighted action digital piano with authentic sound",
    },
    {
      id: 2,
      name: "Fender Player Stratocaster",
      price: 829,
      image: "/electric-guitar.png",
      rating: 4.9,
      reviews: 189,
      inStock: false,
      description: "Classic electric guitar with versatile pickup configuration",
    },
    {
      id: 3,
      name: "Audio-Technica ATH-M50x",
      price: 169,
      image: "/placeholder-3lbka.png",
      rating: 4.7,
      reviews: 567,
      inStock: true,
      description: "Professional monitor headphones for studio and mixing",
    },
  ])

  const removeFromWishlist = (id: number) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    })
  }

  const addToCart = (item: any) => {
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">
            Start adding items to your wishlist by clicking the heart icon on products you love
          </p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My Wishlist</h1>
        <p className="text-xl text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
              {!item.inStock && <Badge className="absolute top-2 left-2 bg-red-600">Out of Stock</Badge>}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">${item.price}</span>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{item.rating}</span>
                  <span className="text-muted-foreground ml-1">({item.reviews})</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" disabled={!item.inStock} onClick={() => addToCart(item)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Link href={`/shop/product/${item.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
