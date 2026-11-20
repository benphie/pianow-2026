import Link from "next/link"

// Matches lessons 1, 2 and 4 in the catalogue, so each card opens the lesson it shows.
// Still images are used because frames taken from the current lesson videos don't show the lessons.
const lessons = [
  {
    id: 1,
    title: "10 Steps to Improvise Jazz",
    duration: "60 minutes",
    level: "Intermediate",
    image: "/home/lesson-jazz.jpg",
  },
  {
    id: 2,
    title: "Improvising Beautiful Melodies On The Piano",
    duration: "45 minutes",
    level: "Intermediate",
    image: "/home/lesson-melodies.jpg",
  },
  {
    id: 4,
    title: "Dramatic Piano Playing with Arpeggios",
    duration: "50 minutes",
    level: "Intermediate",
    image: "/home/lesson-arpeggios.jpg",
  },
]

export default function NewReleases() {
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-8">
      {lessons.map(lesson => (
        <Link
          key={lesson.id}
          href={`/lessons/${lesson.id}`}
          className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-muted"
        >
          <img
            src={lesson.image}
            alt=""
            width={960}
            height={540}
            loading="lazy"
            className="aspect-video w-full rounded-md bg-purple-950 object-cover"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            {lesson.level}, {lesson.duration}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-300">
            {lesson.title}
          </h3>
        </Link>
      ))}
    </div>
  )
}
