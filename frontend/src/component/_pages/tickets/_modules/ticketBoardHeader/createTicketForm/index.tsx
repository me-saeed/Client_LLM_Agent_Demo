'use client'

import React from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import TextInput from '@/src/component/_basic/input'
import Select from '@/src/component/_basic/select'
import Button from '@/src/component/_basic/button'
import { createTicketSchema, type CreateTicketFormValues } from './schema'

type CreateTicketFormProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const priorityOptions = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
]

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ isOpen, setIsOpen }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormValues>({
    resolver: yupResolver(createTicketSchema),
    defaultValues: {
      title: '',
      description: '',
      customerName: '',
      customerEmail: '',
      priority: 'MEDIUM',
    },
  })

  const onClose = () => {
    reset()
    setIsOpen(false)
  }

  const onSubmit = (data: CreateTicketFormValues) => {
    // TODO: submit to API
    console.log('Create ticket:', data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
        <DialogPanel className="max-w-lg w-full space-y-4 border bg-white p-6 rounded-lg">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Create Ticket
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <TextInput
              label="Title"
              placeholder="Enter title"
              error={errors.title?.message}
              {...register('title')}
            />
            <TextInput
              label="Description"
              placeholder="Enter description"
              type="textarea"
              error={errors.description?.message}
              {...register('description')}
            />
            <TextInput
              label="Customer Name"
              placeholder="Enter customer name"
              error={errors.customerName?.message}
              {...register('customerName')}
            />
            <TextInput
              label="Customer Email"
              placeholder="Enter customer email"
              type="email"
              error={errors.customerEmail?.message}
              {...register('customerEmail')}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              error={errors.priority?.message}
              {...register('priority')}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-800">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Create Ticket
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default CreateTicketForm
