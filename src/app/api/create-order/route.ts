import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, email, phone, address, items, totalAmount, reference, status } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 })
    }

    if (!reference) {
        return NextResponse.json({ message: 'Missing order reference' }, { status: 400 })
    }

    // Use a server-side client with the write token
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token: process.env.SANITY_API_TOKEN, // Needs to be added to .env.local
      useCdn: false,
    })

    // Use the client-provided reference (LB-XXX-XXX) as the Order ID
    const orderId = reference

    const doc = {
      _type: 'order',
      orderNumber: orderId,
      paymentReference: reference,
      customerName,
      email,
      phone,
      address,
      items: items.map((item: any) => ({
        _key: item._id || Math.random().toString(36).substring(7),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl,
        product: item._id ? { _type: 'reference', _ref: item._id, _weak: true } : undefined,
      })),
      totalAmount,
      status: status || 'paid',
      createdAt: new Date().toISOString(),
    }

    const result = await client.create(doc)
    return NextResponse.json({ message: 'Order created', id: result._id }, { status: 200 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json({ 
      message: 'Error creating order', 
      error: error.message || error,
      details: error.response?.body 
    }, { status: 500 })
  }
}
