import React from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { format } from 'date-fns'
import clsx from 'clsx'

type TicketDetailFormProps = {
  ticket: Ticket | null
  open: boolean
  onClose: () => void
}

const TicketDetailForm: React.FC<TicketDetailFormProps> = ({ ticket, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50" >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <DialogPanel className="max-w-lg w-full space-y-4 border bg-white text-gray-800 p-6 rounded-lg">
          <div className="space-y-2">
            <h1 className="text-lg font-bold">{ticket?.title}</h1>
            <p className="text-sm text-gray-500">{ticket?.description}</p>
            <div className='py-6'>
              <p className="text-sm text-gray-900 font-semibold">{ticket?.customerName}</p>
              <p className="text-sm text-gray-500">{ticket?.customerEmail}</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className={clsx("text-sm text-gray-800 px-2 py-1 rounded-full capitalize", {
                'bg-green-500/': ticket?.status === 'OPEN',
                'bg-yellow-500/50': ticket?.status === 'IN_PROGRESS',
                'bg-blue-500/50': ticket?.status === 'RESOLVED',
              })}>{ticket?.status.replace('_', ' ')}</div>
              <div className={clsx("text-sm text-white px-2 py-1 rounded-full capitalize", {
                'bg-green-500': ticket?.priority === 'LOW',
                'bg-yellow-500': ticket?.priority === 'MEDIUM',
                'bg-red-500': ticket?.priority === 'HIGH',
              })}>{ticket?.priority}</div>
            </div>
            <p className="text-sm text-gray-500">
              {ticket?.createdAt
                ? format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')
                : null}
            </p>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default TicketDetailForm