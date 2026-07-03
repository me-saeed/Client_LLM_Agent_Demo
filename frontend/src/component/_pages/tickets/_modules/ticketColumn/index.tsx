import React from 'react'
import TicketItem from '../ticketItem'

type TicketColumnProps = {
  title: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
} 

const TicketColumn: React.FC<TicketColumnProps> = ({ title, status }) => {

  //TODO:: get tickets by status from API
  const tickets: Ticket[] = [
    {
      id: 1,
      title: "Ticket 1",
      description: "Description 1",
      customerName: "Customer 1",
      customerEmail: "customer1@example.com",
      status: "OPEN",
      priority: "LOW",
      createdAt: "2021-01-01",
    },
    {
      id: 2,
      title: "Ticket 2",
      description: "Description 2",
      customerName: "Customer 2",
      customerEmail: "customer2@example.com",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      createdAt: "2021-01-02",
    },
    {
      id: 3,
      title: "Ticket 3",
      description: "Description 3",
      customerName: "Customer 3",
      customerEmail: "customer3@example.com",
      status: "RESOLVED",
      priority: "HIGH",
      createdAt: "2021-01-03",
    },
  ]

  return (
    <div className="bg-gray-100 p-4 rounded-lg h-fit max-h-screen lg:h-full">
      <h2 className="text-lg font-bold text-center text-gray-800">{title}</h2>
      <div className="flex flex-col gap-2 mt-4 w-full">
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  )
}

export default TicketColumn