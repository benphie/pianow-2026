import FigmaChart from "@/components/figma-chart"

export default function FigmaChartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Learning Analytics</h1>
        <p className="text-xl text-muted-foreground">Track your musical progress with detailed charts and insights</p>
      </div>

      <FigmaChart />
    </div>
  )
}
