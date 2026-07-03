import TicketColumn from "./_modules/ticketColumn";
import TicketBoardHeader from "./_modules/ticketBoardHeader";

export default function TicketBoard() {
  return (
    <>
      <TicketBoardHeader />
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