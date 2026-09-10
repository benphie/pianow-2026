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
import { useToast } from "@/hooks/use-toast"

const instruments = [
  // String Instruments
  {
    id: 1,
    name: "Yamaha V5SG Violin Outfit",
    price: 299.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "String",
    type: "Violin",
  },
  {
    id: 2,
    name: "Cecilio CVN-300 Violin",
    price: 149.99,
    image: "/placeholder.jpg",
    brand: "Cecilio",
    category: "String",
    type: "Violin",
  },
  {
    id: 3,
    name: "Yamaha VC5SG Viola Outfit",
    price: 399.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "String",
    type: "Viola",
  },
  {
    id: 4,
    name: "Cecilio CCO-100 Cello",
    price: 499.99,
    image: "/placeholder.jpg",
    brand: "Cecilio",
    category: "String",
    type: "Cello",
  },
  {
    id: 5,
    name: "Yamaha YBS-62 Baritone Saxophone",
    price: 4999.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "String",
    type: "Double Bass",
  },
  {
    id: 6,
    name: "Rogue RM-100A Mandolin",
    price: 79.99,
    image: "/placeholder.jpg",
    brand: "Rogue",
    category: "String",
    type: "Mandolin",
  },
  {
    id: 7,
    name: "Oscar Schmidt OS35CE Ukulele",
    price: 89.99,
    image: "/placeholder.jpg",
    brand: "Oscar Schmidt",
    category: "String",
    type: "Ukulele",
  },
  {
    id: 8,
    name: "Kala KA-15S Soprano Ukulele",
    price: 59.99,
    image: "/placeholder.jpg",
    brand: "Kala",
    category: "String",
    type: "Ukulele",
  },
  {
    id: 9,
    name: "Fender CD-60SCE Dreadnought Acoustic",
    price: 229.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    category: "String",
    type: "Banjo",
  },
  // Woodwind Instruments
  {
    id: 10,
    name: "Yamaha YAS-280 Alto Saxophone",
    price: 1299.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Woodwind",
    type: "Saxophone",
  },
  {
    id: 11,
    name: "Yamaha YTS-280 Tenor Saxophone",
    price: 1499.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Woodwind",
    type: "Saxophone",
  },
  {
    id: 12,
    name: "Selmer AS42 Alto Saxophone",
    price: 1999.99,
    image: "/placeholder.jpg",
    brand: "Selmer",
    category: "Woodwind",
    type: "Saxophone",
  },
  {
    id: 13,
    name: "Yamaha YFL-222 Flute",
    price: 399.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Woodwind",
    type: "Flute",
  },
  {
    id: 14,
    name: "Pearl PFP-665E Flute",
    price: 599.99,
    image: "/placeholder.jpg",
    brand: "Pearl",
    category: "Woodwind",
    type: "Flute",
  },
  {
    id: 15,
    name: "Yamaha YCL-255 Clarinet",
    price: 499.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Woodwind",
    type: "Clarinet",
  },
  {
    id: 16,
    name: "Buffet Crampon E11 Clarinet",
    price: 1299.99,
    image: "/placeholder.jpg",
    brand: "Buffet Crampon",
    category: "Woodwind",
    type: "Clarinet",
  },
  {
    id: 17,
    name: "Yamaha YOB-241 Oboe",
    price: 1999.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Woodwind",
    type: "Oboe",
  },
  {
    id: 18,
    name: "Yamaha YBH-301 Bassoon",
    price: 3999.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Woodwind",
    type: "Bassoon",
  },
  // Brass Instruments
  {
    id: 19,
    name: "Yamaha YTR-2330 Trumpet",
    price: 799.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Brass",
    type: "Trumpet",
  },
  {
    id: 20,
    name: "Bach TR300 Trumpet",
    price: 1299.99,
    image: "/placeholder.jpg",
    brand: "Bach",
    category: "Brass",
    type: "Trumpet",
  },
  {
    id: 21,
    name: "Yamaha YSL-354 Trombone",
    price: 899.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Brass",
    type: "Trombone",
  },
  {
    id: 22,
    name: "Yamaha YFH-631G French Horn",
    price: 2999.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Brass",
    type: "French Horn",
  },
  {
    id: 23,
    name: "Yamaha YEP-321 Euphonium",
    price: 1999.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Brass",
    type: "Euphonium",
  },
  {
    id: 24,
    name: "Yamaha YBB-321 Tuba",
    price: 3999.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Brass",
    type: "Tuba",
  },
  // Other Instruments
  {
    id: 25,
    name: "Yamaha PSR-E373 Portable Keyboard",
    price: 199.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Keyboard",
    type: "Synthesizer",
  },
  {
    id: 26,
    name: "Korg microKORG Synthesizer",
    price: 499.99,
    image: "/placeholder.jpg",
    brand: "Korg",
    category: "Keyboard",
    type: "Synthesizer",
  },
  {
    id: 27,
    name: "Roland JUNO-DS61 Synthesizer",
    price: 599.99,
    image: "/placeholder.jpg",
    brand: "Roland",
    category: "Keyboard",
    type: "Synthesizer",
  },
  {
    id: 28,
    name: "Hohner Special 20 Harmonica",
    price: 44.99,
    image: "/placeholder.jpg",
    brand: "Hohner",
    category: "Other",
    type: "Harmonica",
  },
  {
    id: 29,
    name: "Meinl NINO Cajon",
    price: 99.99,
    image: "/placeholder.jpg",
    brand: "Meinl",
    category: "Percussion",
    type: "Cajon",
  },
  {
    id: 30,
    name: "LP Aspire Bongos",
    price: 79.99,
    image: "/placeholder.jpg",
    brand: "LP",
    category: "Percussion",
    type: "Bongos",
  },
]

const brands = ["Yamaha", "Cecilio", "Rogue", "Oscar Schmidt", "Kala", "Fender", "Selmer", "Pearl", "Buffet Crampon", "Bach", "Korg", "Roland", "Hohner", "Meinl", "LP"]
const categories = ["String", "Woodwind", "Brass", "Keyboard", "Percussion", "Other"]
const types = ["Violin", "Viola", "Cello", "Double Bass", "Mandolin", "Ukulele", "Banjo", "Saxophone", "Flute", "Clarinet", "Oboe", "Bassoon", "Trumpet", "Trombone", "French Horn", "Euphonium", "Tuba", "Synthesizer", "Harmonica", "Cajon", "Bongos"]

export default function InstrumentsPage() {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const { toast } = useToast()

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
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

  const filteredInstruments = instruments
    .filter((instrument) => {
      const matchesPrice = instrument.price >= priceRange[0] && instrument.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(instrument.brand)
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(instrument.category)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(instrument.type)

      return matchesPrice && matchesBrand && matchesCategory && matchesType
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
            setSelectedCategories([])
            setSelectedTypes([])
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

      <Accordion type="multiple" defaultValue={["categories", "types", "brands"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
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

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
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
      </Accordion>
    </div>
  )

  return (
    <div className="container px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Other Instruments</h1>
        <p className="text-muted-foreground">
          Discover a wide range of musical instruments - from strings and woodwinds to brass and percussion
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
              Showing {filteredInstruments.length} of {instruments.length} products
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
            {filteredInstruments.map((instrument) => (
              <Card key={instrument.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/shop/product/${instrument.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="relative h-[200px] w-full">
                      <Image src={instrument.image || "/placeholder.svg"} alt={instrument.name} fill className="object-cover" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{instrument.brand}</div>
                    <Link
                      href={`/shop/product/${instrument.id}`}
                      className="hover:underline"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <h3 className="font-medium line-clamp-2 h-12">{instrument.name}</h3>
                    </Link>
                    <div className="text-sm text-muted-foreground mb-2">
                      {instrument.category} • {instrument.type}
                    </div>
                    <div className="mt-2 font-bold">${instrument.price.toFixed(2)}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(instrument)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredInstruments.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 5000])
                  setSelectedBrands([])
                  setSelectedCategories([])
                  setSelectedTypes([])
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

