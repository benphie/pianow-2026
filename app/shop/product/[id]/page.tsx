"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Music, Headphones, Volume2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Comprehensive instrument database
const instruments = {
  "1": {
    id: "1",
    name: "Yamaha P-125 Digital Piano",
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 245,
    inStock: true,
    stockCount: 12,
    category: "Digital Piano",
    brand: "Yamaha",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600", 
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Yamaha P-125 is a compact digital piano that combines incredible piano performance with user-friendly functionality that makes it ideal for aspiring pianists. The P-125 features the authentic sound and feel you need to grow as a player, from the very first lesson to your most advanced performances.",
    features: [
      "88 weighted keys with Graded Hammer Standard (GHS) action",
      "Pure CF Sound Engine delivers authentic acoustic piano sound",
      "192-note polyphony for complex pieces and performances",
      "Built-in metronome and recording function",
      "Sustain pedal included",
      "Compact and portable design perfect for home or stage",
      "USB connectivity for music software integration",
      "Dual and split voice modes for enhanced playing"
    ],
    specifications: {
      "Keyboard": "88 keys, Graded Hammer Standard (GHS) weighted action",
      "Sound Engine": "Pure CF Sound Engine",
      "Voices": "24 voices including acoustic piano, electric piano, organ, harpsichord and others",
      "Polyphony": "192 notes",
      "Pedals": "Sustain pedal (included), compatible with FC3A, FC4A or FC5 footswitches",
      "Dimensions": '52.2" x 11.6" x 6.4" (1326 x 295 x 164 mm)',
      "Weight": "25.8 lbs (11.7 kg)",
      "Power": "16W (8W + 8W) amplifier system",
      "Connectivity": "USB to Host, Headphone jack, Sustain pedal jack",
      "Warranty": "2 years manufacturer warranty"
    },
    relatedProducts: ["2", "3", "4"]
  },
  "2": {
    id: "2",
    name: "Yamaha P-45 Digital Piano",
    price: 549,
    originalPrice: 649,
    rating: 4.6,
    reviews: 189,
    inStock: true,
    stockCount: 8,
    category: "Digital Piano",
    brand: "Yamaha",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Yamaha P-45 is an affordable digital piano that doesn't compromise on quality. Perfect for beginners and intermediate players, it offers authentic piano sound and feel at an unbeatable price.",
    features: [
      "88 weighted keys with Graded Hammer Standard (GHS) action",
      "AWM Stereo Sampling for realistic piano sound",
      "64-note polyphony",
      "10 voices including grand piano, electric piano, and more",
      "Dual and duo modes",
      "Compact and lightweight design",
      "Sustain pedal included"
    ],
    specifications: {
      "Keyboard": "88 keys, Graded Hammer Standard (GHS) weighted action",
      "Sound Engine": "AWM Stereo Sampling",
      "Voices": "10 voices",
      "Polyphony": "64 notes",
      "Pedals": "Sustain pedal (included)",
      "Dimensions": "52.2\" x 11.6\" x 6.4\" (1326 x 295 x 164 mm)",
      "Weight": "25.8 lbs (11.7 kg)",
      "Power": "6W (3W + 3W) amplifier system",
      "Connectivity": "Headphone jack, Sustain pedal jack",
      "Warranty": "2 years manufacturer warranty"
    },
    relatedProducts: ["1", "3", "5"]
  },
  "3": {
    id: "3",
    name: "Casio PX-160 Digital Piano",
    price: 649,
    originalPrice: 799,
    rating: 4.7,
    reviews: 156,
    inStock: true,
    stockCount: 15,
    category: "Digital Piano",
    brand: "Casio",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Casio PX-160 delivers professional piano performance with its Tri-Sensor Scaled Hammer Action II keyboard and AiR Sound Source. Perfect for serious students and performers.",
    features: [
      "88 keys with Tri-Sensor Scaled Hammer Action II",
      "AiR Sound Source with 128-note polyphony",
      "18 built-in voices",
      "Dual and split voice modes",
      "Built-in metronome and recording function",
      "USB connectivity",
      "Sustain pedal included",
      "Chorus, reverb, and brilliance effects"
    ],
    specifications: {
      "Keyboard": "88 keys, Tri-Sensor Scaled Hammer Action II",
      "Sound Engine": "AiR Sound Source",
      "Voices": "18 voices",
      "Polyphony": "128 notes",
      "Pedals": "Sustain pedal (included)",
      "Dimensions": "52.2\" x 11.6\" x 6.4\" (1326 x 295 x 164 mm)",
      "Weight": "25.8 lbs (11.7 kg)",
      "Power": "8W (4W + 4W) amplifier system",
      "Connectivity": "USB to Host, Headphone jack, Sustain pedal jack",
      "Warranty": "3 years manufacturer warranty"
    },
    relatedProducts: ["1", "2", "6"]
  },
  "4": {
    id: "4",
    name: "Roland FP-30X Digital Piano",
    price: 799,
    originalPrice: 899,
    rating: 4.9,
    reviews: 203,
    inStock: true,
    stockCount: 6,
    category: "Digital Piano",
    brand: "Roland",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Roland FP-30X combines authentic piano sound with modern connectivity. Features Roland's PHA-4 Standard keyboard and SuperNATURAL piano sound engine.",
    features: [
      "88 keys with PHA-4 Standard keyboard",
      "SuperNATURAL piano sound engine",
      "256-note polyphony",
      "56 voices including acoustic and electric pianos",
      "Bluetooth audio and MIDI connectivity",
      "Reverb, chorus, and brilliance effects",
      "Dual and split voice modes",
      "Built-in metronome and recording"
    ],
    specifications: {
      "Keyboard": "88 keys, PHA-4 Standard keyboard",
      "Sound Engine": "SuperNATURAL piano sound engine",
      "Voices": "56 voices",
      "Polyphony": "256 notes",
      "Pedals": "Sustain pedal (included)",
      "Dimensions": "52.2\" x 11.6\" x 6.4\" (1326 x 295 x 164 mm)",
      "Weight": "26.5 lbs (12.0 kg)",
      "Power": "11W (5.5W + 5.5W) amplifier system",
      "Connectivity": "Bluetooth Audio/MIDI, USB to Host, Headphone jack",
      "Warranty": "2 years manufacturer warranty"
    },
    relatedProducts: ["1", "3", "7"]
  },
  "5": {
    id: "5",
    name: "Fender Player Stratocaster Electric Guitar",
    price: 699,
    originalPrice: 799,
    rating: 4.8,
    reviews: 312,
    inStock: true,
    stockCount: 9,
    category: "Electric Guitar",
    brand: "Fender",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Fender Player Stratocaster delivers the classic Strat sound and feel that has defined popular music for decades. Perfect for players of all levels.",
    features: [
      "Alder body with modern C-shaped maple neck",
      "3 single-coil Player Series pickups",
      "5-way pickup selector switch",
      "Synchronized tremolo bridge",
      "22 medium jumbo frets",
      "Chrome hardware",
      "Available in multiple colors",
      "Includes gig bag"
    ],
    specifications: {
      "Body": "Alder",
      "Neck": "Maple, Modern C-shaped",
      "Fingerboard": "Maple or Pau Ferro",
      "Frets": "22 medium jumbo",
      "Pickups": "3 Player Series single-coil",
      "Controls": "Master volume, tone 1, tone 2",
      "Bridge": "Synchronized tremolo",
      "Scale Length": "25.5 inches",
      "Nut Width": "1.685 inches",
      "Warranty": "2 years manufacturer warranty"
    },
    relatedProducts: ["6", "7", "8"]
  },
  "6": {
    id: "6",
    name: "Gibson Les Paul Studio Electric Guitar",
    price: 1299,
    originalPrice: 1499,
    rating: 4.9,
    reviews: 187,
    inStock: true,
    stockCount: 4,
    category: "Electric Guitar",
    brand: "Gibson",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Gibson Les Paul Studio delivers the legendary Les Paul tone and playability in a streamlined package. Perfect for rock, blues, and jazz players.",
    features: [
      "Mahogany body with maple cap",
      "Mahogany neck with rosewood fingerboard",
      "2 humbucking pickups",
      "3-way pickup selector switch",
      "Tune-o-matic bridge and stopbar tailpiece",
      "22 frets with medium jumbo profile",
      "Chrome hardware",
      "Includes hardshell case"
    ],
    specifications: {
      "Body": "Mahogany with maple cap",
      "Neck": "Mahogany, set-in",
      "Fingerboard": "Rosewood",
      "Frets": "22 medium jumbo",
      "Pickups": "2 humbucking",
      "Controls": "2 volume, 2 tone, 3-way switch",
      "Bridge": "Tune-o-matic with stopbar tailpiece",
      "Scale Length": "24.75 inches",
      "Nut Width": "1.695 inches",
      "Warranty": "Lifetime warranty"
    },
    relatedProducts: ["5", "7", "9"]
  },
  "7": {
    id: "7",
    name: "Yamaha FG800 Acoustic Guitar",
    price: 199,
    originalPrice: 249,
    rating: 4.6,
    reviews: 445,
    inStock: true,
    stockCount: 22,
    category: "Acoustic Guitar",
    brand: "Yamaha",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Yamaha FG800 is a fantastic entry-level acoustic guitar that delivers great sound and playability at an affordable price. Perfect for beginners and intermediate players.",
    features: [
      "Solid spruce top with nato back and sides",
      "Nato neck with rosewood fingerboard",
      "20 frets with traditional dot inlays",
      "Die-cast tuners for stable tuning",
      "Gloss natural finish",
      "D'Addario strings included",
      "Includes gig bag",
      "Perfect for fingerpicking and strumming"
    ],
    specifications: {
      "Top": "Solid spruce",
      "Back & Sides": "Nato",
      "Neck": "Nato",
      "Fingerboard": "Rosewood",
      "Frets": "20",
      "Scale Length": "25 inches",
      "Nut Width": "1.69 inches",
      "Tuners": "Die-cast",
      "Finish": "Gloss natural",
      "Warranty": "1 year manufacturer warranty"
    },
    relatedProducts: ["8", "9", "10"]
  },
  "8": {
    id: "8",
    name: "Pearl Vision VML Drum Kit",
    price: 899,
    originalPrice: 1099,
    rating: 4.7,
    reviews: 134,
    inStock: true,
    stockCount: 7,
    category: "Drum Kit",
    brand: "Pearl",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Pearl Vision VML drum kit delivers professional sound and build quality at an affordable price. Perfect for intermediate to advanced drummers.",
    features: [
      "6-ply poplar shells with VML bearing edges",
      "22\" bass drum, 10\" and 12\" rack toms, 16\" floor tom",
      "14\" snare drum with 20-strand snare wires",
      "Pearl 800 series hardware included",
      "Remo heads pre-installed",
      "Available in multiple finishes",
      "Professional sound and projection",
      "Perfect for live performance and recording"
    ],
    specifications: {
      "Shells": "6-ply poplar with VML bearing edges",
      "Bass Drum": "22\" x 18\"",
      "Rack Toms": "10\" x 8\", 12\" x 9\"",
      "Floor Tom": "16\" x 16\"",
      "Snare": "14\" x 5.5\"",
      "Hardware": "Pearl 800 series",
      "Heads": "Remo pre-installed",
      "Finish": "Multiple options available",
      "Warranty": "2 years manufacturer warranty"
    },
    relatedProducts: ["9", "10", "11"]
  },
  "9": {
    id: "9",
    name: "Audio-Technica ATH-M50x Professional Headphones",
    price: 169,
    originalPrice: 199,
    rating: 4.8,
    reviews: 523,
    inStock: true,
    stockCount: 18,
    category: "Audio Equipment",
    brand: "Audio-Technica",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Audio-Technica ATH-M50x are critically acclaimed professional monitor headphones that deliver exceptional clarity and accuracy for mixing and mastering.",
    features: [
      "45mm large-aperture drivers with rare earth magnets",
      "Circumaural design for excellent sound isolation",
      "Detachable cable (1.2m - 3.0m coiled cable included)",
      "Professional-grade earpads and headband material",
      "Collapsible design for easy transport",
      "Exceptional clarity throughout an extended frequency range",
      "Perfect for studio monitoring and critical listening",
      "Used by professionals worldwide"
    ],
    specifications: {
      "Driver": "45mm large-aperture drivers",
      "Frequency Response": "15 - 28,000 Hz",
      "Impedance": "38 ohms",
      "Sensitivity": "99 dB",
      "Cable": "Detachable 1.2m - 3.0m coiled",
      "Connector": "3.5mm (1/8\") gold-plated",
      "Weight": "285g (without cable)",
      "Type": "Closed-back dynamic",
      "Warranty": "2 years manufacturer warranty"
    },
    relatedProducts: ["10", "11", "12"]
  },
  "10": {
    id: "10",
    name: "Focusrite Scarlett 2i2 Audio Interface",
    price: 179,
    originalPrice: 219,
    rating: 4.9,
    reviews: 267,
    inStock: true,
    stockCount: 14,
    category: "Audio Equipment",
    brand: "Focusrite",
    images: [
      "/placeholder.svg?height=500&width=600",
      "/placeholder.svg?height=500&width=600"
    ],
    description: "The Focusrite Scarlett 2i2 is the world's best-selling audio interface, perfect for home recording and music production. Delivers professional-quality sound.",
    features: [
      "2 Focusrite preamps with 48V phantom power",
      "24-bit/192kHz AD/DA conversion",
      "USB 2.0 connectivity",
      "2 balanced outputs with monitor control",
      "Direct monitoring for zero-latency recording",
      "Includes Pro Tools First and Ableton Live Lite",
      "Perfect for vocals, instruments, and podcasting",
      "Plug-and-play operation"
    ],
    specifications: {
      "Inputs": "2 XLR/TRS combo inputs",
      "Outputs": "2 balanced TRS outputs",
      "Phantom Power": "48V",
      "Sample Rate": "Up to 192kHz",
      "Bit Depth": "Up to 24-bit",
      "Connectivity": "USB 2.0",
      "Latency": "2.74ms (buffer size 32 samples)",
      "Software": "Pro Tools First, Ableton Live Lite",
      "Warranty": "3 years manufacturer warranty"
    },
    relatedProducts: ["9", "11", "12"]
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [selectedQuantity, setSelectedQuantity] = useState("1")
  const [selectedImage, setSelectedImage] = useState(0)

  const productId = params?.id as string
  const product = instruments[productId]

  // If product doesn't exist, show error message
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, the product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  const addToCart = () => {
    const quantity = Number.parseInt(selectedQuantity)
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("pianow_cart") || "[]")
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)
    
    if (existingItemIndex >= 0) {
      // Add to existing quantity
      existingCart[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity
      })
    }
    
    // Save updated cart
    localStorage.setItem("pianow_cart", JSON.stringify(existingCart))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pianow_cart_updated", { detail: existingCart }))
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) has been added to your cart`
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={product.images[selectedImage] || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img 
                  src={image || "/placeholder.svg"} 
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="secondary">{product.brand}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground ml-1">({product.reviews} reviews)</span>
              </div>
              {product.inStock && (
                <Badge variant="secondary">In Stock ({product.stockCount} left)</Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              {product.originalPrice && (
                <span className="text-2xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-green-600">${product.price}</span>
              {product.originalPrice && (
                <Badge className="bg-red-600">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={addToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col items-center">
                <Truck className="h-5 w-5 mb-1" />
                <span className="text-xs">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-5 w-5 mb-1" />
                <span className="text-xs">{product.specifications.Warranty || "2 Year Warranty"}</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="h-5 w-5 mb-1" />
                <span className="text-xs">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{product.description}</p>
                <h3 className="font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground col-span-2">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold">{product.rating}</div>
                      <div>
                        <div className="flex items-center">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-5 w-5 ${
                                star <= Math.floor(product.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Based on {product.reviews} reviews
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Customer reviews and ratings will be displayed here. This is a placeholder for the review system.
                    </p>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {product.relatedProducts.map((relatedId) => {
              const relatedProduct = instruments[relatedId]
              if (!relatedProduct) return null
              
              return (
                <Card key={relatedId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                      <img 
                        src={relatedProduct.images[0] || "/placeholder.svg"} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${relatedProduct.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}