"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Transaction } from "@/app/page"

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transaction: Omit<Transaction, "_id">) => void
  categories: string[]
  initialData?: Transaction | null
}

export function TransactionForm({ isOpen, onClose, onSubmit, categories, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        date: initialData.date,
        description: initialData.description,
        category: initialData.category,
        type: initialData.type,
      })
    } else {
      setFormData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "",
        type: "expense",
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      description: formData.description.trim(),
      category: formData.category,
      type: formData.type,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: "income" | "expense") => setFormData((prev) => ({ ...prev, type: value }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Add"} Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
// This component provides a form to add or edit transactions with validation
// It includes fields for amount, date, category, type (income/expense), and description
// The form validates inputs and displays error messages for invalid fields
// It uses a controlled form approach with local state to manage input values
// The form can be opened or closed via props, and it calls the onSubmit callback with
// the transaction data when submitted