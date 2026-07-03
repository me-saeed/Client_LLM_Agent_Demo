import { NextRequest, NextResponse } from 'next/server'
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.toString()
    const url = `${BACKEND_URL}/api/tickets${query ? `?${query}` : ''}`

    const res = await fetch(url, {
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      return NextResponse.json(
        { message: error.message ?? 'Failed to fetch tickets' },
        { status: res.status }
      )
    }
    const data = await res.json()

    const tickets = (data.tickets ?? []).map((ticket: Record<string, unknown>) => ({
      id: String(ticket._id),
      title: ticket.title,
      description: ticket.description,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
    }))

    return NextResponse.json({ tickets })
  } catch {
    return NextResponse.json(
      { message: 'Error connecting to ticket service' },
      { status: 500 }
    )
  }
}