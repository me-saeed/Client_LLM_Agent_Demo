import React from 'react'

const CreateTicketForm = () => {
  return (
    <form className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" />
      </div>
    </form>
  )
}

export default CreateTicketForm