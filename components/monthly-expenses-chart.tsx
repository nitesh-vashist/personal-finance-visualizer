"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { Transaction } from "@/app/page"

interface MonthlyExpensesChartProps {
  transactions: Transaction[]
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  // Process data for monthly expenses
  const monthlyData = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthName,
            expenses: 0,
            sortKey: monthKey,
          }
        }

        acc[monthKey].expenses += transaction.amount
        return acc
      },
      {} as Record<string, { month: string; expenses: number; sortKey: string }>,
    )

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(-6) // Show last 6 months

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Your spending trends over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No expense data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Expenses"]}
                />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
