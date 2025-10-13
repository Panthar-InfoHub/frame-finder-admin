"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarDefault({ data }) {

  const formattedData = Object.entries(data).map(([key, value]) => (
    { name: key, count: value }
  ))

  console.debug(" radar chart data ==>  ", formattedData)

  return (
    <Card className=" w-full md:w-1/2" >
      <CardHeader>
        <CardTitle> Product Count </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[450px] h-full w-full"
        >
          <RadarChart data={formattedData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="name" />
            <PolarGrid />
            <Radar
              dataKey="count"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
