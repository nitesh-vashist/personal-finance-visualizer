# 💸 Personal Finance Visualizer

A modern, full-featured web application to help you **track expenses**, **manage budgets**, and **gain insights** into your personal finances.

Built using **Next.js 14**, **React**, **Tailwind CSS**, **shadcn/ui**, and **MongoDB**, this app empowers users to take control of their money with clarity and ease.

---

## ✨ Features

- ✅ Add / Edit / Delete transactions with validation  
- ✅ Transaction list with filtering and search  
- ✅ 📊 Monthly expenses bar chart  
- ✅ 🥧 Category-wise pie chart  
- ✅ 📋 Dashboard with summary cards  
- ✅ 💰 Budget management and tracking  
- ✅ 📈 Budget vs actual comparison charts  
- ✅ 🔍 Spending insights and analytics  
- ✅ 🖥️ Responsive design with error handling  

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript  
- **UI Components**: shadcn/ui, Tailwind CSS  
- **Charts**: Recharts  
- **Database**: MongoDB  
- **Deployment**: Vercel  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nitesh-vashist/personal-finance-visualizer.git
cd personal-finance-visualizer
2. Install Dependencies

npm install
3. Set Up Environment Variables

cp .env.example .env.local
Update .env.local with your MongoDB connection string:


MONGODB_URI=your_mongodb_connection_string
4. Run the Development Server

npm run dev
Visit: http://localhost:3000

🗃️ Database Schema
Transactions Collection
Field	Type
amount	Number
date	String (YYYY-MM-DD)
description	String
category	String
type	'income' | 'expense'
createdAt	Date
updatedAt	Date

Budgets Collection
Field	Type
category	String
amount	Number
month	String (YYYY-MM)
createdAt	Date

🌐 Deployment
This application is deployed on Vercel.

🔗 Live URL: https://personal-finance-visualizer-ecru.vercel.app/

Crafted with care to bring financial clarity — because your money should work for you, not against you.

