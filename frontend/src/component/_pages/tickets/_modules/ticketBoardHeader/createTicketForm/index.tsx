import React from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import TextInput from '@/src/component/_basic/input'
import Button from '@/src/component/_basic/button'

type CreateTicketFormProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-4 rounded-lg">
          <form className="flex flex-col gap-2 min-w-sm">
            <TextInput
              name="title"
              label="Title"
              placeholder="Enter title"
            />
            <TextInput
              label="Description"
              name="description"
              placeholder="Enter description"
              type="textarea"
            />
            <Button type="submit">Create Ticket</Button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default CreateTicketForm