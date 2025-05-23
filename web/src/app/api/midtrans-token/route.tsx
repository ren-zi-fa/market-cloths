import { NextRequest, NextResponse } from 'next/server'
import midtransClient from 'midtrans-client'

export async function POST(req: NextRequest) {
   const body = await req.json()

   const snap = new midtransClient.Snap({
      isProduction: false, // Ganti ke true di production
      serverKey: process.env.SERVER_KEY as string
   })

   const parameter = {
      transaction_details: {
         order_id: 'ORDER-' + Date.now(),
         gross_amount: body.amount
      },
      credit_card: {
         secure: true
      },
      customer_details: {
         first_name: body.name,
         email: body.email
      }
   }

   try {
      const token = await snap.createTransaction(parameter)
      return NextResponse.json({ token: token.token })
   } catch (err) {
      return NextResponse.json(
         { error: 'Gagal membuat transaksi',err },
         { status: 500 }
      )
   }
}
