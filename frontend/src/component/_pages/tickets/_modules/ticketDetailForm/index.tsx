import { Dialog, DialogPanel } from '@headlessui/react'
import React from 'react'

type TicketDetailFormProps = {
  ticket: Ticket
  open: boolean
  onClose: () => void
}

const TicketDetailForm: React.FC<TicketDetailFormProps> = ({ ticket, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50" >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <DialogPanel className="max-w-lg w-full space-y-4 border bg-white p-6 rounded-lg">
          <div>
            <h1>{ticket.title}</h1>
            <p>{ticket.description}</p>
            <p>{ticket.customerName}</p>
            <p>{ticket.customerEmail}</p>
            <p>{ticket.status}</p>
            <p>{ticket.priority}</p>
            <p>{ticket.createdAt}</p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default TicketDetailForm