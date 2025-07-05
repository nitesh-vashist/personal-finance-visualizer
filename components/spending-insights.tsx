"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from "lucide-react"
import type { Transaction, Budget } from "@/app/page"

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  // Calculate insights based on transactions and budgets
  const currentMonth = new Date().toISOString().slice(0, 7)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  // Current month spending
  const currentMonthSpending = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  // Last month spending
  const lastMonthSpending = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(lastMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  // Spending trend
  const spendingTrend =
    lastMonthSpending > 0 ? ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100 : 0

  // Top spending categories this month
  const categorySpending = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Budget alerts
  const budgetAlerts = budgets
    .filter((budget) => budget.month === currentMonth)
    .map((budget) => {
      const spent = categorySpending[budget.category] || 0
      const percentage = (spent / budget.amount) * 100
      return { ...budget, spent, percentage }
    })
    .filter((budget) => budget.percentage > 80)

  // Average transaction amount
  const avgTransaction =
    transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0

  // Most frequent category
  const categoryFrequency = transactions.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostFrequentCategory = Object.entries(categoryFrequency).sort(([, a], [, b]) => b - a)[0]

  // Days since last transaction
  const lastTransactionDate =
    transactions.length > 0 ? Math.max(...transactions.map((t) => new Date(t.date).getTime())) : 0

  const daysSinceLastTransaction =
    lastTransactionDate > 0 ? Math.floor((Date.now() - lastTransactionDate) / (1000 * 60 * 60 * 24)) : 0

  const insights = [
    {
      title: "Monthly Spending Trend",
      value: `${spendingTrend >= 0 ? "+" : ""}${spendingTrend.toFixed(1)}%`,
      description: `Compared to last month (${lastMonthSpending > 0 ? `$${lastMonthSpending.toFixed(2)}` : "No data"})`,
      icon: spendingTrend > 0 ? TrendingUp : TrendingDown,
      color: spendingTrend > 0 ? "text-red-600" : "text-green-600",
      bgColor: spendingTrend > 0 ? "bg-red-50" : "bg-green-50",
    },
    {
      title: "Average Transaction",
      value: `$${avgTransaction.toFixed(2)}`,
      description: `Across ${transactions.length} transactions`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Most Active Category",
      value: mostFrequentCategory ? mostFrequentCategory[0] : "N/A",
      description: mostFrequentCategory ? `${mostFrequentCategory[1]} transactions` : "No transactions yet",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className={insight.bgColor}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{insight.title}</p>
                  <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
                <insight.icon className={`h-8 w-8 ${insight.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Budget Alerts
            </CardTitle>
            <CardDescription>Categories approaching or exceeding budget limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetAlerts.map((alert) => (
                <div key={alert.category} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium">{alert.category}</p>
                    <p className="text-sm text-muted-foreground">
                      ${alert.spent.toFixed(2)} of ${alert.amount.toFixed(2)} spent
                    </p>
                  </div>
                  <Badge variant={alert.percentage > 100 ? "destructive" : "secondary"}>
                    {alert.percentage.toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Spending Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories This Month</CardTitle>
          <CardDescription>
            Your biggest expense categories for{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses recorded this month</p>
          ) : (
            <div className="space-y-3">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{category}</p>
                      <p className="text-sm text-muted-foreground">
                        {((amount / currentMonthSpending) * 100).toFixed(1)}% of total spending
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Your financial activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">${currentMonthSpending.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total expenses</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
              <p className="text-2xl font-bold">
                {daysSinceLastTransaction === 0 ? "Today" : `${daysSinceLastTransaction} days ago`}
              </p>
              <p className="text-sm text-muted-foreground">Last transaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
