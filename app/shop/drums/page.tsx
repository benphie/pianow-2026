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
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast" // Import useToast

const drums = [
  // Electronic Drums
  {
    id: 1,
    name: "Roland TD-17KVX Electronic Drum Kit",
    price: 1699.99,
    image: "/placeholder.jpg",
    brand: "Roland",
    type: "Electronic",
    pieces: 5,
    cymbals: 3,
  },
  {
    id: 2,
    name: "Alesis Nitro Mesh Electronic Drum Kit",
    price: 379.99,
    image: "/placeholder.jpg",
    brand: "Alesis",
    type: "Electronic",
    pieces: 4,
    cymbals: 3,
  },
  {
    id: 3,
    name: "Roland TD-1DMK Electronic Drum Kit",
    price: 499.99,
    image: "/placeholder.jpg",
    brand: "Roland",
    type: "Electronic",
    pieces: 4,
    cymbals: 2,
  },
  {
    id: 4,
    name: "Alesis Surge Mesh Electronic Kit",
    price: 549.99,
    image: "/placeholder.jpg",
    brand: "Alesis",
    type: "Electronic",
    pieces: 5,
    cymbals: 3,
  },
  {
    id: 5,
    name: "Roland TD-27KV Electronic Drum Kit",
    price: 2499.99,
    image: "/placeholder.jpg",
    brand: "Roland",
    type: "Electronic",
    pieces: 5,
    cymbals: 3,
  },
  {
    id: 6,
    name: "Yamaha DTX6K-X Electronic Drum Kit",
    price: 899.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    type: "Electronic",
    pieces: 4,
    cymbals: 3,
  },
  // Acoustic Drums
  {
    id: 7,
    name: "Pearl Export EXX 5-Piece Drum Set",
    price: 699.99,
    image: "/placeholder.jpg",
    brand: "Pearl",
    type: "Acoustic",
    pieces: 5,
    cymbals: 0,
  },
  {
    id: 8,
    name: "DW Performance Series 4-Piece Shell Pack",
    price: 1999.99,
    image: "/placeholder.jpg",
    brand: "DW",
    type: "Acoustic",
    pieces: 4,
    cymbals: 0,
  },
  {
    id: 9,
    name: "Yamaha Stage Custom Birch 5-Piece",
    price: 899.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    type: "Acoustic",
    pieces: 5,
    cymbals: 0,
  },
  {
    id: 10,
    name: "Tama Imperialstar 5-Piece Complete Kit",
    price: 649.99,
    image: "/placeholder.jpg",
    brand: "Tama",
    type: "Acoustic",
    pieces: 5,
    cymbals: 3,
  },
  {
    id: 11,
    name: "Gretsch Catalina Maple 7-Piece Shell Pack",
    price: 1299.99,
    image: "/placeholder.jpg",
    brand: "Gretsch",
    type: "Acoustic",
    pieces: 7,
    cymbals: 0,
  },
  {
    id: 12,
    name: "Ludwig Breakbeats 4-Piece Kit",
    price: 399.99,
    image: "/placeholder.jpg",
    brand: "Ludwig",
    type: "Acoustic",
    pieces: 4,
    cymbals: 0,
  },
  {
    id: 13,
    name: "Pearl Decade Maple 5-Piece Shell Pack",
    price: 799.99,
    image: "/placeholder.jpg",
    brand: "Pearl",
    type: "Acoustic",
    pieces: 5,
    cymbals: 0,
  },
  {
    id: 14,
    name: "Mapex Armory 5-Piece Shell Pack",
    price: 999.99,
    image: "/placeholder.jpg",
    brand: "Mapex",
    type: "Acoustic",
    pieces: 5,
    cymbals: 0,
  },
  {
    id: 15,
    name: "Sonor AQ2 Studio 5-Piece Shell Pack",
    price: 1199.99,
    image: "/placeholder.jpg",
    brand: "Sonor",
    type: "Acoustic",
    pieces: 5,
    cymbals: 0,
  },
  // Percussion
  {
    id: 16,
    name: "LP Aspire Conga Set",
    price: 299.99,
    image: "/placeholder.jpg",
    brand: "LP",
    type: "Percussion",
    pieces: 2,
    cymbals: 0,
  },
  {
    id: 17,
    name: "Meinl Cajon Box Drum",
    price: 149.99,
    image: "/placeholder.jpg",
    brand: "Meinl",
    type: "Percussion",
    pieces: 1,
    cymbals: 0,
  },
  {
    id: 18,
    name: "Remo Djembe Drum",
    price: 199.99,
    image: "/placeholder.jpg",
    brand: "Remo",
    type: "Percussion",
    pieces: 1,
    cymbals: 0,
  },
]

const brands = ["Roland", "Pearl", "Alesis", "DW", "Yamaha", "Tama", "Gretsch", "Ludwig", "Mapex", "Sonor", "LP", "Meinl", "Remo"]
const types = ["Electronic", "Acoustic", "Percussion"]
const pieceOptions = ["1", "2", "4", "5", "6", "7"]

export default function DrumsPage() {
  const [priceRange, setPriceRange] = useState([0, 2500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPieces, setSelectedPieces] = useState<string[]>([])
  const [includeCymbals, setIncludeCymbals] = useState(false)
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

  const handlePiecesChange = (pieces: string) => {
    if (selectedPieces.includes(pieces)) {
      setSelectedPieces(selectedPieces.filter((p) => p !== pieces))
    } else {
      setSelectedPieces([...selectedPieces, pieces])
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
    toast({
      title: "Item added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const filteredDrums = drums
    .filter((drum) => {
      const matchesPrice = drum.price >= priceRange[0] && drum.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(drum.brand)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(drum.type)
      const matchesPieces = selectedPieces.length === 0 || selectedPieces.includes(drum.pieces.toString())
      const matchesCymbals = !includeCymbals || drum.cymbals > 0

      return matchesPrice && matchesBrand && matchesType && matchesPieces && matchesCymbals
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
            setPriceRange([0, 2500])
            setSelectedBrands([])
            setSelectedTypes([])
            setSelectedPieces([])
            setIncludeCymbals(false)
          }}
        >
          Clear All
        </Button>
      </div>

      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider
          defaultValue={[0, 2500]}
          max={2500}
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

      <Accordion type="multiple" defaultValue={["brands", "types", "pieces", "features"]} className="w-full">
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

        <AccordionItem value="pieces">
          <AccordionTrigger>Number of Pieces</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {pieceOptions.map((pieces) => (
                <div key={pieces} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pieces-${pieces}`}
                    checked={selectedPieces.includes(pieces)}
                    onCheckedChange={() => handlePiecesChange(pieces)}
                  />
                  <Label htmlFor={`pieces-${pieces}`}>{pieces} Pieces</Label>
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
                  id="cymbals"
                  checked={includeCymbals}
                  onCheckedChange={(checked) => setIncludeCymbals(checked as boolean)}
                />
                <Label htmlFor="cymbals">Includes Cymbals</Label>
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
        <h1 className="text-3xl font-bold mb-2">Drums & Percussion</h1>
        <p className="text-muted-foreground">
          Find the perfect drum kit for your style - from electronic to acoustic drum sets
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
              Showing {filteredDrums.length} of {drums.length} products
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
            {filteredDrums.map((drum) => (
              <Card key={drum.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/shop/product/${drum.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="relative h-[200px] w-full">
                      <Image src={drum.image || "/placeholder.svg"} alt={drum.name} fill className="object-cover" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{drum.brand}</div>
                    <Link
                      href={`/shop/product/${drum.id}`}
                      className="hover:underline"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <h3 className="font-medium line-clamp-2 h-12">{drum.name}</h3>
                    </Link>
                    <div className="text-sm text-muted-foreground mb-2">
                      {drum.pieces} Pieces • {drum.type}
                      {drum.cymbals > 0 && ` • ${drum.cymbals} Cymbals`}
                    </div>
                    <div className="mt-2 font-bold">${drum.price.toFixed(2)}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(drum)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredDrums.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 2500])
                  setSelectedBrands([])
                  setSelectedTypes([])
                  setSelectedPieces([])
                  setIncludeCymbals(false)
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
