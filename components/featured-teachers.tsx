import Link from "next/link"

const teachers = [
  {
    id: 1,
    name: "Sarah Johnson",
    instrument: "Piano",
    experience: "15+ years teaching",
    specialties: ["Classical", "Jazz", "Beginner-friendly"],
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    instrument: "Guitar",
    experience: "12+ years teaching",
    specialties: ["Rock", "Blues", "Acoustic"],
  },
  {
    id: 3,
    name: "Alex Thompson",
    instrument: "Drums",
    experience: "10+ years teaching",
    specialties: ["Rock", "Jazz", "Latin"],
  },
]

const initials = (name: string) =>
  name
    .split(" ")
    .map(part => part[0])
    .join("")

export default function FeaturedTeachers() {
  return (
    <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
      {teachers.map(teacher => (
        <li key={teacher.id} className="flex gap-5">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100 font-display text-2xl font-semibold text-purple-800 ring-2 ring-gold-400 ring-offset-2 ring-offset-background dark:bg-purple-900 dark:text-purple-100"
          >
            {initials(teacher.name)}
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold">{teacher.name}</h3>
            <p className="mt-1 text-muted-foreground">
              {teacher.instrument}, {teacher.experience}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{teacher.specialties.join(", ")}</p>
            <Link
              href={`/teachers/${teacher.id}`}
              className="mt-3 inline-block font-semibold text-purple-700 underline-offset-4 hover:underline dark:text-purple-300"
            >
              View profile<span className="sr-only"> of {teacher.name}</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
