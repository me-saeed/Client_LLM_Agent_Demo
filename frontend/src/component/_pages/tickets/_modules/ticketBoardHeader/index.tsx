"use client"
import React, { useState } from 'react'
import Button from '@/src/component/_basic/button'
import { Plus } from 'lucide-react'
import CreateTicketForm from './createTicketForm'

const TicketBoardHeader: React.FC = () => {
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false)

  return (
    <div className="text-center pt-4 relative container mx-auto">
      <h1 className="text-white text-2xl font-bold">AUREXILLION Ticket Board</h1>
      <div className="absolute top-4 right-4">
        <Button onClick={() => setIsOpenCreateForm(true)}>
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
        <CreateTicketForm isOpen={isOpenCreateForm} setIsOpen={setIsOpenCreateForm} />
      </div>
    </div>
  )
}

export default TicketBoardHeader