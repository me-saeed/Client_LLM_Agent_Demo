"use client"
import React, { useState } from 'react'
import Button from '@/src/component/_basic/button'
import { Plus } from 'lucide-react'
import CreateTicketForm from './createTicketForm'
import TextInput from '@/src/component/_basic/input'

const TicketBoardHeader: React.FC = () => {
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false)
  const [search, setSearch] = useState('')
  return (
    <div className="text-center pt-4 relative container mx-auto px-4">
      <h1 className="text-white text-2xl font-bold">AUREXILLION Ticket Board</h1>
      <div className="flex items-end justify-end gap-2">
        <TextInput
          label="Search"
          name="search"
          placeholder="Search"
          type="text"
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          className="w-48 text-white"
        />
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