import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, type Db, ObjectId } from "mongodb"

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const result = await database.collection("transactions").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          amount: Number.parseFloat(amount),
          date,
          description: description.trim(),
          category,
          type,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction updated successfully" })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const database = await connectToDatabase()
    const result = await database.collection("transactions").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}
