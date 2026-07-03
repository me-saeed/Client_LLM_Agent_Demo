import Button from "../../_basic/button";
import TicketColumn from "./_modules/ticketColumn";
import { Plus } from "lucide-react";

export default function TicketBoard() {
  return (
    <>
      <div className="text-center pt-4 relative container mx-auto">
        <h1 className="text-white text-2xl font-bold">AUREXILLION Ticket Board</h1>
        <div className="absolute top-4 right-4">
          <Button >
            <Plus className="w-4 h-4" />
            Create Ticket
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 h-full">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <TicketColumn title="Open" status="OPEN" />
          <TicketColumn title="In Progress" status="IN_PROGRESS" />
          <TicketColumn title="Resolved" status="RESOLVED" />
        </main>
      </div>
    </>
  )
}