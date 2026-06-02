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

const guitars = [
  // Electric Guitars
  {
    id: 1,
    name: "Fender Player Stratocaster",
    price: 799.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    type: "Electric",
    strings: 6,
    bodyWood: "Alder",
  },
  {
    id: 2,
    name: "Gibson Les Paul Standard '60s",
    price: 2499.99,
    image: "/placeholder.jpg",
    brand: "Gibson",
    type: "Electric",
    strings: 6,
    bodyWood: "Mahogany",
  },
  {
    id: 3,
    name: "Ibanez RG550 Electric Guitar",
    price: 999.99,
    image: "/placeholder.jpg",
    brand: "Ibanez",
    type: "Electric",
    strings: 6,
    bodyWood: "Basswood",
  },
  {
    id: 4,
    name: "Fender Player Telecaster",
    price: 749.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    type: "Electric",
    strings: 6,
    bodyWood: "Alder",
  },
  {
    id: 5,
    name: "Epiphone Les Paul Standard",
    price: 599.99,
    image: "/placeholder.jpg",
    brand: "Epiphone",
    type: "Electric",
    strings: 6,
    bodyWood: "Mahogany",
  },
  {
    id: 6,
    name: "PRS SE Custom 24",
    price: 899.99,
    image: "/placeholder.jpg",
    brand: "PRS",
    type: "Electric",
    strings: 6,
    bodyWood: "Mahogany",
  },
  {
    id: 7,
    name: "Fender American Professional Stratocaster",
    price: 1699.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    type: "Electric",
    strings: 6,
    bodyWood: "Alder",
  },
  {
    id: 8,
    name: "Gibson SG Standard",
    price: 1499.99,
    image: "/placeholder.jpg",
    brand: "Gibson",
    type: "Electric",
    strings: 6,
    bodyWood: "Mahogany",
  },
  {
    id: 9,
    name: "Jackson JS22 Dinky",
    price: 199.99,
    image: "/placeholder.jpg",
    brand: "Jackson",
    type: "Electric",
    strings: 6,
    bodyWood: "Basswood",
  },
  {
    id: 10,
    name: "Squier Classic Vibe Stratocaster",
    price: 429.99,
    image: "/placeholder.jpg",
    brand: "Squier",
    type: "Electric",
    strings: 6,
    bodyWood: "Pine",
  },
  // Acoustic Guitars
  {
    id: 11,
    name: "Martin D-28 Acoustic Guitar",
    price: 2999.99,
    image: "/placeholder.jpg",
    brand: "Martin",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Rosewood",
  },
  {
    id: 12,
    name: "Taylor 814ce Acoustic Guitar",
    price: 3999.99,
    image: "/placeholder.jpg",
    brand: "Taylor",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Rosewood",
  },
  {
    id: 13,
    name: "Yamaha FG830 Acoustic Guitar",
    price: 199.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Rosewood",
  },
  {
    id: 14,
    name: "Fender CD-60S Acoustic Guitar",
    price: 229.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Mahogany",
  },
  {
    id: 15,
    name: "Taylor GS Mini Acoustic Guitar",
    price: 599.99,
    image: "/placeholder.jpg",
    brand: "Taylor",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Sapele",
  },
  {
    id: 16,
    name: "Martin LX1E Little Martin",
    price: 449.99,
    image: "/placeholder.jpg",
    brand: "Martin",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Mahogany",
  },
  {
    id: 17,
    name: "Seagull S6 Original Acoustic",
    price: 499.99,
    image: "/placeholder.jpg",
    brand: "Seagull",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Cedar",
  },
  {
    id: 18,
    name: "Epiphone Hummingbird Pro",
    price: 399.99,
    image: "/placeholder.jpg",
    brand: "Epiphone",
    type: "Acoustic",
    strings: 6,
    bodyWood: "Mahogany",
  },
  // Classical Guitars
  {
    id: 19,
    name: "Cordoba C5 Classical Guitar",
    price: 399.99,
    image: "/placeholder.jpg",
    brand: "Cordoba",
    type: "Classical",
    strings: 6,
    bodyWood: "Cedar",
  },
  {
    id: 20,
    name: "Yamaha C40 Classical Guitar",
    price: 149.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    type: "Classical",
    strings: 6,
    bodyWood: "Spruce",
  },
  {
    id: 21,
    name: "Alhambra 1C Classical Guitar",
    price: 299.99,
    image: "/placeholder.jpg",
    brand: "Alhambra",
    type: "Classical",
    strings: 6,
    bodyWood: "Cedar",
  },
  // Bass Guitars
  {
    id: 22,
    name: "Fender Player Precision Bass",
    price: 749.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    type: "Bass",
    strings: 4,
    bodyWood: "Alder",
  },
  {
    id: 23,
    name: "Squier Classic Vibe Jazz Bass",
    price: 429.99,
    image: "/placeholder.jpg",
    brand: "Squier",
    type: "Bass",
    strings: 4,
    bodyWood: "Pine",
  },
  {
    id: 24,
    name: "Ibanez SR300E Bass Guitar",
    price: 349.99,
    image: "/placeholder.jpg",
    brand: "Ibanez",
    type: "Bass",
    strings: 4,
    bodyWood: "Basswood",
  },
]

const brands = ["Fender", "Martin", "Gibson", "Taylor", "Ibanez", "Yamaha", "Epiphone", "PRS", "Jackson", "Squier", "Cordoba", "Alhambra", "Seagull"]
const types = ["Electric", "Acoustic", "Classical", "Bass"]
const bodyWoods = ["Alder", "Rosewood", "Mahogany", "Basswood", "Maple", "Cedar", "Spruce", "Pine", "Sapele"]

export default function GuitarsPage() {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedWoods, setSelectedWoods] = useState<string[]>([])
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

  const handleWoodChange = (wood: string) => {
    if (selectedWoods.includes(wood)) {
      setSelectedWoods(selectedWoods.filter((w) => w !== wood))
    } else {
      setSelectedWoods([...selectedWoods, wood])
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

  const filteredGuitars = guitars
    .filter((guitar) => {
      const matchesPrice = guitar.price >= priceRange[0] && guitar.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(guitar.brand)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(guitar.type)
      const matchesWood = selectedWoods.length === 0 || selectedWoods.includes(guitar.bodyWood)

      return matchesPrice && matchesBrand && matchesType && matchesWood
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
            setPriceRange([0, 5000])
            setSelectedBrands([])
            setSelectedTypes([])
            setSelectedWoods([])
          }}
        >
          Clear All
        </Button>
      </div>

      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider
          defaultValue={[0, 5000]}
          max={5000}
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

      <Accordion type="multiple" defaultValue={["brands", "types", "woods"]} className="w-full">
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

        <AccordionItem value="woods">
          <AccordionTrigger>Body Wood</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {bodyWoods.map((wood) => (
                <div key={wood} className="flex items-center space-x-2">
                  <Checkbox
                    id={`wood-${wood}`}
                    checked={selectedWoods.includes(wood)}
                    onCheckedChange={() => handleWoodChange(wood)}
                  />
                  <Label htmlFor={`wood-${wood}`}>{wood}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="container px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Guitars</h1>
        <p className="text-muted-foreground">
          Explore our collection of electric, acoustic, and classical guitars from renowned brands
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
              Showing {filteredGuitars.length} of {guitars.length} products
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
            {filteredGuitars.map((guitar) => (
              <Card key={guitar.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/shop/product/${guitar.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="relative h-[200px] w-full">
                      <Image src={guitar.image || "/placeholder.svg"} alt={guitar.name} fill className="object-cover" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{guitar.brand}</div>
                    <Link
                      href={`/shop/product/${guitar.id}`}
                      className="hover:underline"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <h3 className="font-medium line-clamp-2 h-12">{guitar.name}</h3>
                    </Link>
                    <div className="text-sm text-muted-foreground mb-2">
                      {guitar.type} • {guitar.bodyWood} Body
                    </div>
                    <div className="mt-2 font-bold">${guitar.price.toFixed(2)}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(guitar)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredGuitars.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 5000])
                  setSelectedBrands([])
                  setSelectedTypes([])
                  setSelectedWoods([])
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
