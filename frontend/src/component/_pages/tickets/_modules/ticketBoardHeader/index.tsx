"use client"
import React, { useState } from 'react'
import Button from '@/src/component/_basic/button'
import { Plus } from 'lucide-react'
import CreateTicketForm from './createTicketForm'
import TextInput from '@/src/component/_basic/input'
import Select from '@/src/component/_basic/select'
import { useTicketStore } from '@/src/store/tickets/useTicketStore'

const priorityOptions = [
  { label: 'All priorities', value: '' },
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
]

const TicketBoardHeader: React.FC = () => {
  const { search, setSearch, setPriority, loadTickets } = useTicketStore()

  const setFilter = (value: string, label: string) => {
    if (label === 'name_title') {
      setSearch(value)
    } else if (label === 'priority') {
      setPriority(value ? (value as Ticket['priority']) : undefined)
    }
    void loadTickets()
  }

  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false)
  return (
    <div className="text-center pt-8 relative container mx-auto px-4">
      <h1 className="text-white text-2xl font-bold">AUREXILLION Ticket Board</h1>
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          <TextInput
            label="Search"
            name="search"
            placeholder="Search"
            type="text"
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilter(event.target.value, 'name_title')
            }}
            className="w-48 text-foreground"
          />
          <Select
            label="Priority"
            name="filter"
            options={priorityOptions}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter(event.target.value, 'priority')
            }}
            className="w-48 text-black"
          />
        </div>
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