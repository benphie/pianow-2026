"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const practiceData = [
  { day: "Mon", piano: 45, guitar: 30, drums: 20 },
  { day: "Tue", piano: 60, guitar: 25, drums: 35 },
  { day: "Wed", piano: 30, guitar: 40, drums: 25 },
  { day: "Thu", piano: 50, guitar: 35, drums: 30 },
  { day: "Fri", piano: 40, guitar: 45, drums: 40 },
  { day: "Sat", piano: 70, guitar: 55, drums: 50 },
  { day: "Sun", piano: 65, guitar: 50, drums: 45 },
]

const progressData = [
  { month: "Jan", completed: 8, inProgress: 3 },
  { month: "Feb", completed: 12, inProgress: 4 },
  { month: "Mar", completed: 18, inProgress: 5 },
  { month: "Apr", completed: 25, inProgress: 6 },
  { month: "May", completed: 32, inProgress: 4 },
  { month: "Jun", completed: 38, inProgress: 7 },
]

const skillData = [
  { name: "Piano", value: 85, color: "#8884d8" },
  { name: "Guitar", value: 70, color: "#82ca9d" },
  { name: "Drums", value: 60, color: "#ffc658" },
  { name: "Voice", value: 45, color: "#ff7c7c" },
]

export default function FigmaChart() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Practice Time Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Practice Time</CardTitle>
          <CardDescription>Minutes practiced per day by instrument</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={practiceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="piano" stackId="a" fill="#8884d8" name="Piano" />
              <Bar dataKey="guitar" stackId="a" fill="#82ca9d" name="Guitar" />
              <Bar dataKey="drums" stackId="a" fill="#ffc658" name="Drums" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skill Level Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Levels</CardTitle>
          <CardDescription>Current proficiency by instrument</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {skillData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>Lessons completed vs in progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" name="Completed Lessons" />
              <Line type="monotone" dataKey="inProgress" stroke="#82ca9d" name="In Progress" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
