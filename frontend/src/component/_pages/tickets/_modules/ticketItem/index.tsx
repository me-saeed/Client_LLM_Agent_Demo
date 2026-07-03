import React from 'react'
import clsx from 'clsx'

type TicketItemProps = {
  ticket: Ticket
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <div className={clsx(" absolute top-2 right-2 w-fit py-1 px-2 text-xs rounded-full capitalize text-gray-800", 
        {
          ["bg-green-500/50"]: ticket.status === "OPEN",
          ["bg-yellow-500/50"]: ticket.status === "IN_PROGRESS", 
          ["bg-blue-500/50"]: ticket.status === "RESOLVED",
        }
      )}>
        {ticket.status.replace("_", " ")}
      </div>
      <h3 className="text-lg font-bold text-gray-800">{ticket.title}</h3>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{ticket.customerName}</p>
        <div className={clsx("w-fit px-1 text-xs rounded-full capitalize", 
          {
            ["bg-green-500"]: ticket.priority === "LOW",  
            ["bg-yellow-500"]: ticket.priority === "MEDIUM",
            ["bg-red-500"]: ticket.priority === "HIGH",
          }
        )}>
          {ticket.priority}
        </div>
      </div>
    </div>
  )
}

export default TicketItem