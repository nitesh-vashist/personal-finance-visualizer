"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { Transaction, Budget } from "@/app/page"

interface BudgetComparisonProps {
  budgets: Budget[]
  transactions: Transaction[]
}

export function BudgetComparison({ budgets, transactions }: BudgetComparisonProps) {
  // Calculate actual spending for each budget so we can compare it with the budgeted amount
  const budgetComparison = budgets.map((budget) => {
    const budgetMonth = budget.month
    const actualSpending = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date)
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}`
        return t.type === "expense" && t.category === budget.category && transactionMonth === budgetMonth
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const percentage = budget.amount > 0 ? (actualSpending / budget.amount) * 100 : 0
    const remaining = budget.amount - actualSpending

    return {
      ...budget,
      actualSpending,
      percentage,
      remaining,
      status: percentage > 100 ? "over" : percentage > 80 ? "warning" : "good",
    }
  })

  // Prepare chart data
  const chartData = budgetComparison.map((item) => ({
    category: item.category,
    budget: item.amount,
    actual: item.actualSpending,
    month: new Date(item.month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }))

  const chartConfig = {
    budget: {
      label: "Budget",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Actual",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track your spending against your budgets</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetComparison.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No budgets set yet. Create your first budget to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgetComparison.map((item) => (
                <div key={`${item.category}-${item.month}`} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${item.actualSpending.toFixed(2)} / ${item.amount.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          item.status === "over"
                            ? "text-red-600"
                            : item.status === "warning"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {item.remaining >= 0
                          ? `$${item.remaining.toFixed(2)} remaining`
                          : `$${Math.abs(item.remaining).toFixed(2)} over budget`}
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min(item.percentage, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.percentage.toFixed(1)}% used</span>
                    <span
                      className={
                        item.status === "over"
                          ? "text-red-600"
                          : item.status === "warning"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }
                    >
                      {item.status === "over" ? "Over Budget" : item.status === "warning" ? "Near Limit" : "On Track"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual Spending</CardTitle>
            <CardDescription>Compare your budgets with actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `$${Number(value).toFixed(2)}`,
                      name === "budget" ? "Budget" : "Actual",
                    ]}
                  />
                  <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
