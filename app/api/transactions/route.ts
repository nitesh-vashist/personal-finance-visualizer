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
    const transactions = await database.collection("transactions").find({}).sort({ date: -1 }).toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, date, description, category, type } = body

    // Validation
    if (!amount || !date || !description || !category || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 })
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json({ error: "Type must be either income or expense" }, { status: 400 })
    }

    const database = await connectToDatabase()
    const result = await database.collection("transactions").insertOne({
      amount: Number.parseFloat(amount),
      date,
      description: description.trim(),
      category,
      type,
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "Transaction created successfully",
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
