"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Star, ShoppingCart, Search, Filter, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 4000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const products = [
    // Yamaha Pianos
    {
      id: 1,
      name: "Yamaha CP88 Stage Piano",
      brand: "Yamaha",
      price: 2499,
      originalPrice: 2799,
      image: "/PHOTOS FOR THE APP/YAMAHA CP88/Yamaha CP88.avif",
      rating: 4.9,
      reviews: 156,
      badge: "Professional",
      category: "Stage Piano",
      mainCategory: "Pianos"
    },
    {
      id: 2,
      name: "Yamaha P-125 Digital Piano",
      brand: "Yamaha",
      price: 899,
      originalPrice: 1099,
      image: "/PHOTOS FOR THE APP/P 125/P125a.jpg",
      rating: 4.8,
      reviews: 245,
      badge: "Best Seller",
      category: "Digital Piano",
      mainCategory: "Pianos"
    },
    {
      id: 3,
      name: "Yamaha NP-32 Portable Piano",
      brand: "Yamaha",
      price: 299,
      image: "/PHOTOS FOR THE APP/YAMAHA NP 32/Yamaha NP-32.avif",
      rating: 4.6,
      reviews: 189,
      badge: "Portable",
      category: "Portable Piano"
    },
    {
      id: 4,
      name: "Yamaha PSR-E473 Keyboard",
      brand: "Yamaha",
      price: 399,
      image: "/PHOTOS FOR THE APP/YAMAHA PSR E 473/Yamaha PSR-E473.jpg",
      rating: 4.5,
      reviews: 312,
      badge: "Beginner",
      category: "Keyboard"
    },
    {
      id: 5,
      name: "Yamaha YDP-145 Digital Piano",
      brand: "Yamaha",
      price: 1299,
      image: "/PHOTOS FOR THE APP/YAMAHA YDP 145/Yamaha YDP-145 Arius.avif",
      rating: 4.7,
      reviews: 178,
      badge: "Home Piano",
      category: "Digital Piano"
    },

    // Casio Pianos
    {
      id: 6,
      name: "Casio Privia PX-870 Digital Piano",
      brand: "Casio",
      price: 899,
      originalPrice: 1099,
      image: "/PHOTOS FOR THE APP/CASIO PRIVIA PX 870/Casio Privia PX-870.avif",
      rating: 4.7,
      reviews: 203,
      badge: "Best Seller",
      category: "Digital Piano"
    },
    {
      id: 7,
      name: "Casio Privia PX-S1100 Digital Piano",
      brand: "Casio",
      price: 1199,
      image: "/PHOTOS FOR THE APP/CASIO PRIVIA PXS1100/Casio Privia PX-S1100.avif",
      rating: 4.8,
      reviews: 134,
      badge: "Slim Design",
      category: "Digital Piano"
    },
    {
      id: 8,
      name: "Casio CT-X700 Keyboard",
      brand: "Casio",
      price: 199,
      image: "/PHOTOS FOR THE APP/casio CT x700/Casio CT-X700.avif",
      rating: 4.4,
      reviews: 267,
      badge: "Value",
      category: "Keyboard"
    },
    {
      id: 9,
      name: "Casio LK-S450 Lighted Keyboard",
      brand: "Casio",
      price: 299,
      image: "/PHOTOS FOR THE APP/CASIO LK S450/Casio LK-S450.avif",
      rating: 4.5,
      reviews: 198,
      badge: "Learning",
      category: "Keyboard"
    },

    // Kawai Pianos
    {
      id: 10,
      name: "Kawai ES920 Digital Piano",
      brand: "Kawai",
      price: 1899,
      originalPrice: 2199,
      image: "/PHOTOS FOR THE APP/KAWAI ES920/Kawai ES920a.jpg",
      rating: 4.8,
      reviews: 127,
      badge: "Premium",
      category: "Digital Piano"
    },
    {
      id: 11,
      name: "Kawai ES120 Digital Piano",
      brand: "Kawai",
      price: 999,
      image: "/PHOTOS FOR THE APP/KAWAI ES120/Kawai ES120a.jpg",
      rating: 4.6,
      reviews: 156,
      badge: "Compact",
      category: "Digital Piano"
    },
    {
      id: 12,
      name: "Kawai KDP-120 Digital Piano",
      brand: "Kawai",
      price: 1299,
      image: "/PHOTOS FOR THE APP/KAWAI KDP 120/Kawai KDP120.jpg",
      rating: 4.7,
      reviews: 89,
      badge: "Furniture Style",
      category: "Digital Piano"
    },

    // Roland Pianos
    {
      id: 13,
      name: "Roland FP-30X Digital Piano",
      brand: "Roland",
      price: 799,
      image: "/PHOTOS FOR THE APP/ROLAND FP 30X/Roland FP-30X.jpg",
      rating: 4.6,
      reviews: 189,
      badge: "Compact",
      category: "Digital Piano"
    },
    {
      id: 14,
      name: "Roland RD-2000 Stage Piano",
      brand: "Roland",
      price: 2899,
      image: "/PHOTOS FOR THE APP/ROLAND RD 2000/Roland RD-2000.jpg",
      rating: 4.9,
      reviews: 67,
      badge: "Professional",
      category: "Stage Piano"
    },
    {
      id: 15,
      name: "Roland RD-88 Stage Piano",
      brand: "Roland",
      price: 1899,
      image: "/PHOTOS FOR THE APP/ROLAND RD 88/Roland RD-88.jpg",
      rating: 4.8,
      reviews: 98,
      badge: "Portable Pro",
      category: "Stage Piano"
    },
    {
      id: 16,
      name: "Roland RP-107 Digital Piano",
      brand: "Roland",
      price: 999,
      image: "/PHOTOS FOR THE APP/ROLAND RP 107/Roland RP-107.jpg",
      rating: 4.5,
      reviews: 145,
      badge: "Home Piano",
      category: "Digital Piano"
    },

    // Korg Pianos
    {
      id: 17,
      name: "Korg Grand Stage 88",
      brand: "Korg",
      price: 3299,
      originalPrice: 3599,
      image: "/PHOTOS FOR THE APP/KORG GRAND STAGE 88/Korg Grandstage 88.jpg",
      rating: 4.9,
      reviews: 89,
      badge: "Flagship",
      category: "Stage Piano"
    },
    {
      id: 18,
      name: "Korg B2 Digital Piano",
      brand: "Korg",
      price: 599,
      image: "/PHOTOS FOR THE APP/KORG B2/Korg B2.png",
      rating: 4.4,
      reviews: 178,
      badge: "Entry Level",
      category: "Digital Piano"
    },
    {
      id: 19,
      name: "Korg D1 Digital Piano",
      brand: "Korg",
      price: 799,
      image: "/PHOTOS FOR THE APP/KORG D1/Korg D1a.jpg",
      rating: 4.6,
      reviews: 123,
      badge: "Slim Design",
      category: "Digital Piano"
    },
    {
      id: 20,
      name: "Korg LP-380 Digital Piano",
      brand: "Korg",
      price: 1499,
      image: "/PHOTOS FOR THE APP/KORG LP380/Korg LP-380U.png",
      rating: 4.7,
      reviews: 67,
      badge: "Furniture Style",
      category: "Digital Piano"
    },

    // Other Brands
    {
      id: 21,
      name: "Kurzweil SP1 Stage Piano",
      brand: "Kurzweil",
      price: 899,
      image: "/PHOTOS FOR THE APP/Kurzweil SP1.jpg",
      rating: 4.5,
      reviews: 89,
      badge: "Stage Ready",
      category: "Stage Piano"
    },
    {
      id: 22,
      name: "Kurzweil SP6 Stage Piano",
      brand: "Kurzweil",
      price: 1299,
      image: "/PHOTOS FOR THE APP/KURZWEIL SP6/SP6.jpg",
      rating: 4.7,
      reviews: 56,
      badge: "Professional",
      category: "Stage Piano",
      mainCategory: "Pianos"
    },
    // Guitars
    {
      id: 23,
      name: "Fender Player Stratocaster",
      brand: "Fender",
      price: 799.99,
      image: "/placeholder.jpg",
      rating: 4.7,
      reviews: 234,
      badge: "Popular",
      category: "Electric Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 24,
      name: "Gibson Les Paul Standard '60s",
      brand: "Gibson",
      price: 2499.99,
      image: "/placeholder.jpg",
      rating: 4.9,
      reviews: 189,
      badge: "Premium",
      category: "Electric Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 25,
      name: "Martin D-28 Acoustic Guitar",
      brand: "Martin",
      price: 2999.99,
      image: "/placeholder.jpg",
      rating: 4.8,
      reviews: 156,
      badge: "Classic",
      category: "Acoustic Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 26,
      name: "Taylor 814ce Acoustic Guitar",
      brand: "Taylor",
      price: 3999.99,
      image: "/placeholder.jpg",
      rating: 4.9,
      reviews: 203,
      badge: "Premium",
      category: "Acoustic Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 27,
      name: "Yamaha FG830 Acoustic Guitar",
      brand: "Yamaha",
      price: 199.99,
      image: "/placeholder.jpg",
      rating: 4.6,
      reviews: 312,
      badge: "Best Value",
      category: "Acoustic Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 28,
      name: "Ibanez RG550 Electric Guitar",
      brand: "Ibanez",
      price: 999.99,
      image: "/placeholder.jpg",
      rating: 4.7,
      reviews: 178,
      badge: "Professional",
      category: "Electric Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 29,
      name: "Epiphone Les Paul Standard",
      brand: "Epiphone",
      price: 599.99,
      image: "/placeholder.jpg",
      rating: 4.5,
      reviews: 267,
      badge: "Best Seller",
      category: "Electric Guitar",
      mainCategory: "Guitars"
    },
    {
      id: 30,
      name: "PRS SE Custom 24",
      brand: "PRS",
      price: 899.99,
      image: "/placeholder.jpg",
      rating: 4.8,
      reviews: 145,
      badge: "Popular",
      category: "Electric Guitar",
      mainCategory: "Guitars"
    },
    // Drums
    {
      id: 31,
      name: "Roland TD-17KVX Electronic Drum Kit",
      brand: "Roland",
      price: 1699.99,
      image: "/placeholder.jpg",
      rating: 4.8,
      reviews: 198,
      badge: "Professional",
      category: "Electronic Drums",
      mainCategory: "Drums"
    },
    {
      id: 32,
      name: "Alesis Nitro Mesh Electronic Drum Kit",
      brand: "Alesis",
      price: 379.99,
      image: "/placeholder.jpg",
      rating: 4.5,
      reviews: 423,
      badge: "Best Value",
      category: "Electronic Drums",
      mainCategory: "Drums"
    },
    {
      id: 33,
      name: "Pearl Export EXX 5-Piece Drum Set",
      brand: "Pearl",
      price: 699.99,
      image: "/placeholder.jpg",
      rating: 4.6,
      reviews: 267,
      badge: "Popular",
      category: "Acoustic Drums",
      mainCategory: "Drums"
    },
    {
      id: 34,
      name: "DW Performance Series 4-Piece Shell Pack",
      brand: "DW",
      price: 1999.99,
      image: "/placeholder.jpg",
      rating: 4.9,
      reviews: 134,
      badge: "Premium",
      category: "Acoustic Drums",
      mainCategory: "Drums"
    },
    {
      id: 35,
      name: "Yamaha Stage Custom Birch 5-Piece",
      brand: "Yamaha",
      price: 899.99,
      image: "/placeholder.jpg",
      rating: 4.7,
      reviews: 189,
      badge: "Professional",
      category: "Acoustic Drums",
      mainCategory: "Drums"
    },
    {
      id: 36,
      name: "Roland TD-27KV Electronic Drum Kit",
      brand: "Roland",
      price: 2499.99,
      image: "/placeholder.jpg",
      rating: 4.9,
      reviews: 98,
      badge: "Flagship",
      category: "Electronic Drums",
      mainCategory: "Drums"
    },
    // Audio Equipment
    {
      id: 37,
      name: "Shure SM58 Microphone",
      brand: "Shure",
      price: 99.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 1234,
      badge: "Classic",
      category: "Microphone",
      mainCategory: "Audio Equipment"
    },
    {
      id: 38,
      name: "Audio-Technica ATH-M50x Headphones",
      brand: "Audio-Technica",
      price: 149.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 856,
      badge: "Best Seller",
      category: "Headphones",
      mainCategory: "Audio Equipment"
    },
    {
      id: 39,
      name: "Focusrite Scarlett 2i2 Audio Interface",
      brand: "Focusrite",
      price: 169.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 678,
      badge: "Popular",
      category: "Audio Interface",
      mainCategory: "Audio Equipment"
    },
    {
      id: 40,
      name: "Rode NT1-A Condenser Microphone",
      brand: "Rode",
      price: 229.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 445,
      badge: "Professional",
      category: "Microphone",
      mainCategory: "Audio Equipment"
    },
    {
      id: 41,
      name: "JBL EON615 Powered Speaker",
      brand: "JBL",
      price: 399.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 234,
      badge: "Portable",
      category: "Speaker",
      mainCategory: "Audio Equipment"
    },
    {
      id: 42,
      name: "Yamaha MG10XU Mixing Console",
      brand: "Yamaha",
      price: 199.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      reviews: 312,
      badge: "Compact",
      category: "Mixer",
      mainCategory: "Audio Equipment"
    },
    {
      id: 43,
      name: "Sony WH-1000XM4 Wireless Headphones",
      brand: "Sony",
      price: 349.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 567,
      badge: "Wireless",
      category: "Headphones",
      mainCategory: "Audio Equipment"
    },
    {
      id: 44,
      name: "PreSonus AudioBox USB 96",
      brand: "PreSonus",
      price: 99.99,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 289,
      badge: "Entry Level",
      category: "Audio Interface",
      mainCategory: "Audio Equipment"
    },
    // Accessories
    {
      id: 45,
      name: "Fender Deluxe Guitar Stand",
      brand: "Fender",
      price: 29.99,
      image: "/placeholder.jpg",
      rating: 4.5,
      reviews: 456,
      badge: "Essential",
      category: "Guitar Accessories",
      mainCategory: "Accessories"
    },
    {
      id: 46,
      name: "D'Addario EXL110 Electric Guitar Strings",
      brand: "D'Addario",
      price: 9.99,
      image: "/placeholder.jpg",
      rating: 4.7,
      reviews: 1234,
      badge: "Best Seller",
      category: "Guitar Accessories",
      mainCategory: "Accessories"
    },
    {
      id: 47,
      name: "Boss TU-3 Chromatic Tuner",
      brand: "Boss",
      price: 99.99,
      image: "/placeholder.jpg",
      rating: 4.8,
      reviews: 789,
      badge: "Professional",
      category: "Guitar Accessories",
      mainCategory: "Accessories"
    },
    {
      id: 48,
      name: "On-Stage KS7350 Keyboard Stand",
      brand: "On-Stage",
      price: 39.99,
      image: "/placeholder.jpg",
      rating: 4.4,
      reviews: 234,
      badge: "Sturdy",
      category: "Piano Accessories",
      mainCategory: "Accessories"
    },
    {
      id: 49,
      name: "Vic Firth 5A Drumsticks (Pair)",
      brand: "Vic Firth",
      price: 12.99,
      image: "/placeholder.jpg",
      rating: 4.6,
      reviews: 567,
      badge: "Popular",
      category: "Drum Accessories",
      mainCategory: "Accessories"
    },
    {
      id: 50,
      name: "Zildjian A Custom 14\" Hi-Hat Cymbals",
      brand: "Zildjian",
      price: 299.99,
      image: "/placeholder.jpg",
      rating: 4.8,
      reviews: 345,
      badge: "Premium",
      category: "Drum Accessories",
      mainCategory: "Accessories"
    }
  ]

  // Update existing products to include mainCategory
  const updatedProducts = products.map(product => {
    if (!product.mainCategory) {
      return { ...product, mainCategory: "Pianos" }
    }
    return product
  })

  const brands = [...new Set(updatedProducts.map(p => p.brand))]
  const categories = [...new Set(updatedProducts.map(p => p.mainCategory))]

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

  // Filter and search products
  const filteredProducts = updatedProducts
    .filter((product) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.mainCategory && product.mainCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      
      // Category filter (using mainCategory)
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.mainCategory)

      return matchesSearch && matchesPrice && matchesBrand && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
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
            setPriceRange([0, 4000])
            setSelectedBrands([])
            setSelectedCategories([])
            setSearchQuery("")
          }}
        >
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={4000}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
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
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Products</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Discover our complete collection of musical instruments, equipment, and accessories from top brands
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <FilterSidebar />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setPriceRange([0, 3500])
                  setSelectedBrands([])
                  setSelectedCategories([])
                  setSearchQuery("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=192&width=300"
                }}
              />
              <Badge className="absolute top-2 left-2">{product.badge}</Badge>
              <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
                {product.brand}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-xl font-bold">${product.price}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.reviews})</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{product.category}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href={`/shop/product/${product.id}`}>
                  <Button className="w-full group-hover:bg-purple-600 transition-colors">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </Link>
                <Link href={`/shop/product/${product.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}