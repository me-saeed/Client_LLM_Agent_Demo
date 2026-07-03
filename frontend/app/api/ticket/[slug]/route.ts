import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000'

const mapTicket = (ticket: Record<string, unknown>) => ({
  id: String(ticket._id),
  title: ticket.title,
  description: ticket.description,
  customerName: ticket.customerName,
  customerEmail: ticket.customerEmail,
  status: ticket.status,
  priority: ticket.priority,
  createdAt: ticket.createdAt,
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const url = `${BACKEND_URL}/api/tickets/${slug}`

    const res = await fetch(url, {
      cache: 'no-store',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      return NextResponse.json(
        { message: error.message ?? 'Failed to fetch ticket' },
        { status: res.status }
      )
    }

    const data = await res.json()
    const ticket = data.ticket ? mapTicket(data.ticket) : null

    return NextResponse.json({ ticket })
  } catch {
    return NextResponse.json(
      { message: 'Error connecting to ticket service' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const url = `${BACKEND_URL}/api/tickets/${slug}`

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      return NextResponse.json(
        { message: error.message ?? 'Failed to update ticket' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { message: 'Error connecting to ticket service' },
      { status: 500 }
    )
  }
}
