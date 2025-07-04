import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let db: Db

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    db = client.db("personal-finance")
  }
  return db
}

export async function GET() {
  try {
    const database = await connectToDatabase()
    const budgets = await database.collection("budgets").find({}).sort({ month: -1 }).toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, amount, month } = body

    // Validation
    if (!category || !amount || !month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    const database = await connectToDatabase()

    // Check if budget already exists for this category and month
    const existingBudget = await database.collection("budgets").findOne({
      category,
      month,
    })

    if (existingBudget) {
      // Update existing budget
      await database.collection("budgets").updateOne({ category, month }, { $set: { amount } })
      return NextResponse.json({ message: "Budget updated successfully" })
    } else {
      // Insert new budget
      await database.collection("budgets").insertOne({
        category,
        amount,
        month,
      })
      return NextResponse.json({ message: "Budget created successfully" })
    }
  } catch (error) {
    console.error("Error creating or updating budget:", error)
    return NextResponse.json({ error: "Failed to create or update budget" }, { status: 500 })
  }
}
