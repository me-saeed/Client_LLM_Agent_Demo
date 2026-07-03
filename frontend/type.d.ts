interface Ticket {
    id: string;
    title: string;
    description: string;
    customerName: string;
    customerEmail: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    createdAt: string;
}