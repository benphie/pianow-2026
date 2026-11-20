import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeaturedTeachers from "@/components/featured-teachers"
import FeaturedProducts from "@/components/featured-products"
import NewReleases from "@/components/new-releases"
import { TryTheKeys } from "@/components/home/try-the-keys"

const textLink = "font-semibold text-purple-700 underline-offset-4 hover:underline dark:text-purple-300"

const places = [
  {
    title: "Lessons",
    text: "Video lessons from your first notes to jazz improvisation and worship playing.",
    href: "/lessons",
    linkText: "Find a lesson",
  },
  {
    title: "Teachers",
    text: "Meet the teachers behind the lessons, or apply to teach on PIANOW.",
    href: "/teachers",
    linkText: "Meet the teachers",
  },
  {
    title: "Live",
    text: "Join live lessons and workshops, and see what's coming up.",
    href: "/live",
    linkText: "See live sessions",
  },
  {
    title: "Shop",
    text: "Pianos, keyboards, guitars, drums and the gear that goes with them.",
    href: "/shop",
    linkText: "Visit the shop",
  },
]

function SectionHeading({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      <Link href={href} className={`shrink-0 ${textLink}`}>
        {linkText}
      </Link>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      <section className="container mx-auto px-4 pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Learn to play, one lesson at a time.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Video lessons from your first notes to jazz improvisation and worship playing, with teachers for piano,
              guitar and drums.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href="/lessons">Browse lessons</Link>
              </Button>
              <Link href="/shop" className={`text-base ${textLink}`}>
                Visit the shop
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/home/piano-practice-room.jpg"
              alt="A digital piano in a dimly lit practice room"
              width={1024}
              height={1024}
              className="aspect-square w-full rounded-md object-cover lg:aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      <section className="bg-purple-950 text-white">
        <div className="container mx-auto grid items-center gap-10 px-4 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-semibold text-white">Try the keys.</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-purple-200">
              Tap a key to hear it. The white keys are labelled in tonic sol-fa, from Do up to Do.
            </p>
          </div>
          <div className="lg:col-span-8">
            <TryTheKeys />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:py-24">
        <h2 className="text-3xl font-semibold sm:text-4xl">What you&apos;ll find here</h2>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {places.map(place => (
            <div key={place.title} className="border-t-2 border-gold-400 pt-5">
              <h3 className="font-display text-2xl font-semibold">{place.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{place.text}</p>
              <Link href={place.href} className={`mt-4 inline-block ${textLink}`}>
                {place.linkText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading title="New lessons" href="/lessons" linkText="All lessons" />
          <NewReleases />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:py-24">
        <SectionHeading title="Teachers" href="/teachers" linkText="All teachers" />
        <FeaturedTeachers />
      </section>

      <section className="bg-muted py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading title="From the shop" href="/shop" linkText="All products" />
          <FeaturedProducts />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold sm:text-5xl">Start with a free lesson.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Pick one, press play, and go at your own pace.</p>
          <Button asChild size="lg" className="mt-8 h-12 px-6 text-base">
            <Link href="/lessons">Browse lessons</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
