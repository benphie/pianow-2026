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

const accessories = [
  // Guitar Accessories
  {
    id: 1,
    name: "Fender Deluxe Guitar Stand",
    price: 29.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    category: "Guitar",
    type: "Stand",
  },
  {
    id: 2,
    name: "D'Addario EXL110 Electric Guitar Strings",
    price: 9.99,
    image: "/placeholder.jpg",
    brand: "D'Addario",
    category: "Guitar",
    type: "Strings",
  },
  {
    id: 3,
    name: "Boss TU-3 Chromatic Tuner",
    price: 99.99,
    image: "/placeholder.jpg",
    brand: "Boss",
    category: "Guitar",
    type: "Tuner",
  },
  {
    id: 4,
    name: "Ernie Ball Guitar Picks (12-pack)",
    price: 4.99,
    image: "/placeholder.jpg",
    brand: "Ernie Ball",
    category: "Guitar",
    type: "Picks",
  },
  {
    id: 5,
    name: "Fender Premium Guitar Cable 10ft",
    price: 24.99,
    image: "/placeholder.jpg",
    brand: "Fender",
    category: "Guitar",
    type: "Cable",
  },
  {
    id: 6,
    name: "Dunlop 535Q Cry Baby Wah Pedal",
    price: 149.99,
    image: "/placeholder.jpg",
    brand: "Dunlop",
    category: "Guitar",
    type: "Pedal",
  },
  {
    id: 7,
    name: "Martin Acoustic Guitar Strings",
    price: 12.99,
    image: "/placeholder.jpg",
    brand: "Martin",
    category: "Guitar",
    type: "Strings",
  },
  {
    id: 8,
    name: "Gator GW-76 Guitar Gig Bag",
    price: 49.99,
    image: "/placeholder.jpg",
    brand: "Gator",
    category: "Guitar",
    type: "Case",
  },
  // Piano/Keyboard Accessories
  {
    id: 9,
    name: "On-Stage KS7350 Keyboard Stand",
    price: 39.99,
    image: "/placeholder.jpg",
    brand: "On-Stage",
    category: "Piano",
    type: "Stand",
  },
  {
    id: 10,
    name: "Yamaha FC4A Sustain Pedal",
    price: 24.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Piano",
    type: "Pedal",
  },
  {
    id: 11,
    name: "Roland DP-10 Piano Pedal",
    price: 49.99,
    image: "/placeholder.jpg",
    brand: "Roland",
    category: "Piano",
    type: "Pedal",
  },
  {
    id: 12,
    name: "Gator GK-76 Keyboard Case",
    price: 89.99,
    image: "/placeholder.jpg",
    brand: "Gator",
    category: "Piano",
    type: "Case",
  },
  // Drum Accessories
  {
    id: 13,
    name: "Vic Firth 5A Drumsticks (Pair)",
    price: 12.99,
    image: "/placeholder.jpg",
    brand: "Vic Firth",
    category: "Drums",
    type: "Sticks",
  },
  {
    id: 14,
    name: "Zildjian A Custom 14\" Hi-Hat Cymbals",
    price: 299.99,
    image: "/placeholder.jpg",
    brand: "Zildjian",
    category: "Drums",
    type: "Cymbals",
  },
  {
    id: 15,
    name: "Pearl P-932 Double Bass Pedal",
    price: 199.99,
    image: "/placeholder.jpg",
    brand: "Pearl",
    category: "Drums",
    type: "Pedal",
  },
  {
    id: 16,
    name: "Remo Emperor Drumhead",
    price: 24.99,
    image: "/placeholder.jpg",
    brand: "Remo",
    category: "Drums",
    type: "Drumhead",
  },
  {
    id: 17,
    name: "DW 5000 Hi-Hat Stand",
    price: 249.99,
    image: "/placeholder.jpg",
    brand: "DW",
    category: "Drums",
    type: "Stand",
  },
  {
    id: 18,
    name: "Sabian AAX 16\" Crash Cymbal",
    price: 199.99,
    image: "/placeholder.jpg",
    brand: "Sabian",
    category: "Drums",
    type: "Cymbals",
  },
  // Audio Equipment
  {
    id: 19,
    name: "Shure SM58 Microphone",
    price: 99.99,
    image: "/placeholder.jpg",
    brand: "Shure",
    category: "Audio",
    type: "Microphone",
  },
  {
    id: 20,
    name: "Audio-Technica ATH-M50x Headphones",
    price: 149.99,
    image: "/placeholder.jpg",
    brand: "Audio-Technica",
    category: "Audio",
    type: "Headphones",
  },
  {
    id: 21,
    name: "Focusrite Scarlett Solo Audio Interface",
    price: 119.99,
    image: "/placeholder.jpg",
    brand: "Focusrite",
    category: "Audio",
    type: "Interface",
  },
  {
    id: 22,
    name: "Yamaha MG10XU Mixing Console",
    price: 249.99,
    image: "/placeholder.jpg",
    brand: "Yamaha",
    category: "Audio",
    type: "Mixer",
  },
  {
    id: 23,
    name: "JBL 305P Studio Monitors (Pair)",
    price: 299.99,
    image: "/placeholder.jpg",
    brand: "JBL",
    category: "Audio",
    type: "Monitors",
  },
  // General Accessories
  {
    id: 24,
    name: "K&M Music Stand",
    price: 49.99,
    image: "/placeholder.jpg",
    brand: "K&M",
    category: "General",
    type: "Stand",
  },
  {
    id: 25,
    name: "Metronome Pro Digital Metronome",
    price: 29.99,
    image: "/placeholder.jpg",
    brand: "Metronome Pro",
    category: "General",
    type: "Metronome",
  },
  {
    id: 26,
    name: "Hosa Pro Instrument Cable 10ft",
    price: 19.99,
    image: "/placeholder.jpg",
    brand: "Hosa",
    category: "General",
    type: "Cable",
  },
  {
    id: 27,
    name: "On-Stage WS8500 Music Stand Light",
    price: 24.99,
    image: "/placeholder.jpg",
    brand: "On-Stage",
    category: "General",
    type: "Light",
  },
]

const brands = ["Fender", "D'Addario", "Boss", "Ernie Ball", "Dunlop", "Martin", "Gator", "On-Stage", "Yamaha", "Roland", "Vic Firth", "Zildjian", "Pearl", "Remo", "DW", "Sabian", "Shure", "Audio-Technica", "Focusrite", "JBL", "K&M", "Metronome Pro", "Hosa"]
const categories = ["Guitar", "Piano", "Drums", "Audio", "General"]
const types = ["Stand", "Strings", "Tuner", "Picks", "Cable", "Pedal", "Case", "Sticks", "Cymbals", "Drumhead", "Microphone", "Headphones", "Interface", "Mixer", "Monitors", "Metronome", "Light"]

export default function AccessoriesPage() {
  const [priceRange, setPriceRange] = useState([0, 500])
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
    toast({
      title: "Item added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const filteredAccessories = accessories
    .filter((item) => {
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1]
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand)
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type)

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
            setPriceRange([0, 500])
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
          defaultValue={[0, 500]}
          max={500}
          step={10}
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
        <h1 className="text-3xl font-bold mb-2">Music Accessories</h1>
        <p className="text-muted-foreground">
          Everything you need to enhance your musical experience - from strings to stands, pedals to headphones
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
              Showing {filteredAccessories.length} of {accessories.length} products
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
            {filteredAccessories.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/shop/product/${item.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="relative h-[200px] w-full">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">{item.brand}</div>
                    <Link
                      href={`/shop/product/${item.id}`}
                      className="hover:underline"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <h3 className="font-medium line-clamp-2 h-12">{item.name}</h3>
                    </Link>
                    <div className="text-sm text-muted-foreground mb-2">
                      {item.category} • {item.type}
                    </div>
                    <div className="mt-2 font-bold">${item.price.toFixed(2)}</div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => addToCart(item)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredAccessories.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, 500])
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

