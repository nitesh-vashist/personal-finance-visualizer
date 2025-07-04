"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import type { Transaction } from "@/app/page"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
]

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  // Process data for category breakdown
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0
        }
        acc[transaction.category] += transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const chartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: 0, // Will be calculated below
    }))
    .sort((a, b) => b.amount - a.amount)

  const total = chartData.reduce((sum, item) => sum + item.amount, 0)

  // Calculate percentages
  chartData.forEach((item) => {
    item.percentage = total > 0 ? (item.amount / total) * 100 : 0
  })

  const chartConfig = chartData.reduce(
    (config, item, index) => {
      config[item.category] = {
        label: item.category,
        color: COLORS[index % COLORS.length],
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No expense data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) =>
                    percentage > 5 ? `${category} (${percentage.toFixed(1)}%)` : ""
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
