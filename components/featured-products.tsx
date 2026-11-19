import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Yamaha CP88 Stage Piano",
    price: 2499,
    originalPrice: 2799,
    image: "/PHOTOS FOR THE APP/YAMAHA CP88/Yamaha CP88.avif",
  },
  {
    id: 2,
    name: "Casio Privia PX-870 Digital Piano",
    price: 899,
    originalPrice: 1099,
    image: "/PHOTOS FOR THE APP/CASIO PRIVIA PX 870/Casio Privia PX-870.avif",
  },
  {
    id: 3,
    name: "Kawai ES920 Digital Piano",
    price: 1899,
    originalPrice: 2199,
    image: "/PHOTOS FOR THE APP/KAWAI ES920/Kawai ES920a.jpg",
  },
]

const dollars = (amount: number) => `$${amount.toLocaleString("en-US")}`

export default function FeaturedProducts() {
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-8">
      {products.map(product => (
        <Link
          key={product.id}
          href={`/shop/product/${product.id}`}
          className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-muted"
        >
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border bg-white p-6">
            <img src={product.image} alt={product.name} loading="lazy" className="max-h-full w-auto object-contain" />
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-300">
            {product.name}
          </h3>
          <p className="mt-1">
            <span className="font-semibold">{dollars(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                <span className="sr-only">was </span>
                {dollars(product.originalPrice)}
              </span>
            )}
          </p>
        </Link>
      ))}
    </div>
  )
}
