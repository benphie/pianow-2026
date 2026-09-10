"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShoppingCart, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast" // Import useToast

const pianos = [
  // Yamaha Pianos
  {
    id: 1,
    name: "Yamaha CP88 Stage Piano",
    price: 2499,
    originalPrice: 2799,
    image: "/PHOTOS FOR THE APP/YAMAHA CP88/Yamaha CP88.avif",
    brand: "Yamaha",
    type: "Stage Piano",
    keys: 88,
    weighted: true,
    rating: 4.9,
    reviews: 156,
    badge: "Professional",
  },
  {
    id: 2,
    name: "Yamaha P-125 Digital Piano",
    price: 899,
    originalPrice: 1099,
    image: "/PHOTOS FOR THE APP/P 125/P125a.jpg",
    brand: "Yamaha",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.8,
    reviews: 245,
    badge: "Best Seller",
  },
  {
    id: 3,
    name: "Yamaha NP-32 Portable Piano",
    price: 299,
    image: "/PHOTOS FOR THE APP/YAMAHA NP 32/Yamaha NP-32.avif",
    brand: "Yamaha",
    type: "Portable Piano",
    keys: 76,
    weighted: false,
    rating: 4.6,
    reviews: 189,
    badge: "Portable",
  },
  {
    id: 4,
    name: "Yamaha PSR-E473 Keyboard",
    price: 399,
    image: "/PHOTOS FOR THE APP/YAMAHA PSR E 473/Yamaha PSR-E473.jpg",
    brand: "Yamaha",
    type: "Keyboard",
    keys: 61,
    weighted: false,
    rating: 4.5,
    reviews: 312,
    badge: "Beginner",
  },
  {
    id: 5,
    name: "Yamaha YDP-145 Digital Piano",
    price: 1299,
    image: "/PHOTOS FOR THE APP/YAMAHA YDP 145/Yamaha YDP-145 Arius.avif",
    brand: "Yamaha",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.7,
    reviews: 178,
    badge: "Home Piano",
  },
  // Casio Pianos
  {
    id: 6,
    name: "Casio Privia PX-870 Digital Piano",
    price: 899,
    originalPrice: 1099,
    image: "/PHOTOS FOR THE APP/CASIO PRIVIA PX 870/Casio Privia PX-870.avif",
    brand: "Casio",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.7,
    reviews: 203,
    badge: "Best Seller",
  },
  {
    id: 7,
    name: "Casio Privia PX-S1100 Digital Piano",
    price: 1199,
    image: "/PHOTOS FOR THE APP/CASIO PRIVIA PXS1100/Casio Privia PX-S1100.avif",
    brand: "Casio",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.8,
    reviews: 134,
    badge: "Slim Design",
  },
  {
    id: 8,
    name: "Casio CT-X700 Keyboard",
    price: 199,
    image: "/PHOTOS FOR THE APP/casio CT x700/Casio CT-X700.avif",
    brand: "Casio",
    type: "Keyboard",
    keys: 61,
    weighted: false,
    rating: 4.4,
    reviews: 267,
    badge: "Value",
  },
  {
    id: 9,
    name: "Casio LK-S450 Lighted Keyboard",
    price: 299,
    image: "/PHOTOS FOR THE APP/CASIO LK S450/Casio LK-S450.avif",
    brand: "Casio",
    type: "Keyboard",
    keys: 61,
    weighted: false,
    rating: 4.5,
    reviews: 198,
    badge: "Learning",
  },
  // Kawai Pianos
  {
    id: 10,
    name: "Kawai ES920 Digital Piano",
    price: 1899,
    originalPrice: 2199,
    image: "/PHOTOS FOR THE APP/KAWAI ES920/Kawai ES920a.jpg",
    brand: "Kawai",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.8,
    reviews: 127,
    badge: "Premium",
  },
  {
    id: 11,
    name: "Kawai ES120 Digital Piano",
    price: 999,
    image: "/PHOTOS FOR THE APP/KAWAI ES120/Kawai ES120a.jpg",
    brand: "Kawai",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.6,
    reviews: 156,
    badge: "Compact",
  },
  {
    id: 12,
    name: "Kawai KDP-120 Digital Piano",
    price: 1299,
    image: "/PHOTOS FOR THE APP/KAWAI KDP 120/Kawai KDP120.jpg",
    brand: "Kawai",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.7,
    reviews: 89,
    badge: "Furniture Style",
  },
  // Roland Pianos
  {
    id: 13,
    name: "Roland FP-30X Digital Piano",
    price: 799,
    image: "/PHOTOS FOR THE APP/ROLAND FP 30X/Roland FP-30X.jpg",
    brand: "Roland",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.6,
    reviews: 189,
    badge: "Compact",
  },
  {
    id: 14,
    name: "Roland RD-2000 Stage Piano",
    price: 2899,
    image: "/PHOTOS FOR THE APP/ROLAND RD 2000/Roland RD-2000.jpg",
    brand: "Roland",
    type: "Stage Piano",
    keys: 88,
    weighted: true,
    rating: 4.9,
    reviews: 67,
    badge: "Professional",
  },
  {
    id: 15,
    name: "Roland RD-88 Stage Piano",
    price: 1899,
    image: "/PHOTOS FOR THE APP/ROLAND RD 88/Roland RD-88.jpg",
    brand: "Roland",
    type: "Stage Piano",
    keys: 88,
    weighted: true,
    rating: 4.8,
    reviews: 98,
    badge: "Portable Pro",
  },
  {
    id: 16,
    name: "Roland RP-107 Digital Piano",
    price: 999,
    image: "/PHOTOS FOR THE APP/ROLAND RP 107/Roland RP-107.jpg",
    brand: "Roland",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.5,
    reviews: 145,
    badge: "Home Piano",
  },
  // Korg Pianos
  {
    id: 17,
    name: "Korg Grand Stage 88",
    price: 3299,
    originalPrice: 3599,
    image: "/PHOTOS FOR THE APP/KORG GRAND STAGE 88/Korg Grandstage 88.jpg",
    brand: "Korg",
    type: "Stage Piano",
    keys: 88,
    weighted: true,
    rating: 4.9,
    reviews: 89,
    badge: "Flagship",
  },
  {
    id: 18,
    name: "Korg B2 Digital Piano",
    price: 599,
    image: "/PHOTOS FOR THE APP/KORG B2/Korg B2.png",
    brand: "Korg",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.4,
    reviews: 178,
    badge: "Entry Level",
  },
  {
    id: 19,
    name: "Korg D1 Digital Piano",
    price: 799,
    image: "/PHOTOS FOR THE APP/KORG D1/Korg D1a.jpg",
    brand: "Korg",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.6,
    reviews: 123,
    badge: "Slim Design",
  },
  {
    id: 20,
    name: "Korg LP-380 Digital Piano",
    price: 1499,
    image: "/PHOTOS FOR THE APP/KORG LP380/Korg LP-380U.png",
    brand: "Korg",
    type: "Digital Piano",
    keys: 88,
    weighted: true,
    rating: 4.7,
    reviews: 67,
    badge: "Furniture Style",
  },
  // Other Brands
  {
    id: 21,
    name: "Kurzweil SP1 Stage Piano",
    price: 899,
    image: "/PHOTOS FOR THE APP/Kurzweil SP1.jpg",
    brand: "Kurzweil",
    type: "Stage Piano",
    keys: 88,
    weighted: true,
    rating: 4.5,
    reviews: 89,
    badge: "Stage Ready",
  },
  {
    id: 22,
    name: "Kurzweil SP6 Stage Piano",
    price: 1299,
    image: "/PHOTOS FOR THE APP/KURZWEIL SP6/SP6.jpg",
    brand: "Kurzweil",
    type: "Stage Piano",
    keys: 88,
    weighted: true,
    rating: 4.7,
    reviews: 56,
    badge: "Professional",
  },
]

const brands = ["Yamaha", "Roland", "Casio", "Korg", "Kawai", "Kurzweil"]
const types = ["Digital Piano", "Keyboard", "Stage Piano", "Portable Piano"]
const keyOptions = ["61", "76", "88"]

export default function PianosPage() {
  const [priceRange, setPriceRange] = useState([0, 3500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [weightedOnly, setWeightedOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const { toast } = useToast() // Initialize useToast

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const handleKeysChange = (keys: string) => {
    if (selectedKeys.includes(keys)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== keys))
    } else {
      setSelectedKeys([...selectedKeys, keys])
    }
  }

  const addToCart = (product: { id: number; name: string; price: number; image: string }) => {
    const existingCart = JSON.parse(localStorage.getItem("pianow_cart") || "[]")
    let updatedCart

    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex > -1) {
      updatedCart = existingCart.map((item: any, index: number) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
      )
    } else {
      updatedCart = [...existingCart, { ...product, quantity: 1 }]
    }

    localStorage.setItem("pianow_cart", JSON.stringify(updatedCart))
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pianow_cart_updated", { detail: updatedCart }))
    }
    toast({
      title: "Item added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const filteredPianos = pianos
    .filter((piano) => {
      const matchesPrice = piano.price >= priceRange[0] && piano.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(piano.brand)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(piano.type)
      const matchesKeys = selectedKeys.length === 0 || selectedKeys.includes(piano.keys.toString())
      const matchesWeighted = !weightedOnly || piano.weighted

      return matchesPrice && matchesBrand && matchesType && matchesKeys && matchesWeighted
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const FilterSidebar = () => (
    <div className="space-y-6 max-h-screen overflow-y-auto pr-2">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          className="mb-4 bg-transparent"
          onClick={() => {
            setPriceRange([0, 3500])
            setSelectedBrands([])
            setSelectedTypes([])
            setSelectedKeys([])
            setWeightedOnly(false)
          }}
        >
          Clear All
        </Button>
      </div>

      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider
          defaultValue={[0, 3500]}
          max={3500}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex items-center justify-between">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["brands", "types", "keys", "features"]} className="w-full">
        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {types.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeChange(type)}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keys">
          <AccordionTrigger>Number of Keys</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {keyOptions.map((keys) => (
                <div key={keys} className="flex items-center space-x-2">
                  <Checkbox
                    id={`keys-${keys}`}
                    checked={selectedKeys.includes(keys)}
                    onCheckedChange={() => handleKeysChange(keys)}
                  />
                  <Label htmlFor={`keys-${keys}`}>{keys} Keys</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weighted"
                  checked={weightedOnly}
                  onCheckedChange={(checked) => setWeightedOnly(checked as boolean)}
                />
                <Label htmlFor="weighted">Weighted Keys</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="container px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pianos & Keyboards</h1>
        <p className="text-muted-foreground">
          Discover our collection of digital pianos, keyboards, and synthesizers from top brands
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebar />
        </div>

        {/* Filters - Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden mb-4 bg-transparent">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <FilterSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-muted-foreground mb-4 sm:mb-0">
              Showing {filteredPianos.length} of {pianos.length} products
            </p>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
            {filteredPianos.map((piano) => (
              <Card key={piano.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/shop/product/${piano.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <img 
                        src={piano.image || "/placeholder.svg?height=200&width=300"} 
                        alt={piano.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{piano.brand}</div>
                    <Link
                      href={`/shop/product/${piano.id}`}
                      className="hover:underline"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <h3 className="font-medium line-clamp-2 h-12">{piano.name}</h3>
                    </Link>
                    <div className="text-sm text-muted-foreground mb-2">
                      {piano.keys} Keys • {piano.weighted ? "Weighted" : "Non-weighted"}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {piano.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${piano.originalPrice}
                          </span>
                        )}
                        <span className="font-bold">${piano.price}</span>
                      </div>
                      {piano.rating && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          ⭐ {piano.rating} ({piano.reviews})
                        </div>
                      )}
                    </div>
                    {piano.badge && (
                      <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded inline-block">
                        {piano.badge}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(piano)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredPianos.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 3500])
                  setSelectedBrands([])
                  setSelectedTypes([])
                  setSelectedKeys([])
                  setWeightedOnly(false)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
