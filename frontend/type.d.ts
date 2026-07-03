interface Ticket {
    id: number;
    title: string;
    description: string;
    customerName: string;
    customerEmail: string;
    status: "open" | "in_progress" | "closed";
    priority: "low" | "medium" | "high";
    createdAt: string;
}