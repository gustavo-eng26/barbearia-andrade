export type Status = "Pendente" | "Confirmado" | "Concluído" | "Cancelado";
export interface Appointment { id: string; client: string; service: string; barber: string; date: string; time: string; status: Status }
export const statuses: Status[] = ["Pendente", "Confirmado", "Concluído", "Cancelado"];
// MOCK TEMPORÁRIO: substituir por API.
export const appointments: Appointment[] = [
  { id: "1", client: "Cliente exemplo 1", service: "Cabelo", barber: "b1", date: "hoje", time: "09:00", status: "Confirmado" },
  { id: "2", client: "Cliente exemplo 2", service: "Barba", barber: "b2", date: "hoje", time: "10:00", status: "Pendente" },
  { id: "3", client: "Cliente exemplo 3", service: "Cabelo", barber: "b3", date: "hoje", time: "11:00", status: "Confirmado" },
  { id: "4", client: "Cliente exemplo 4", service: "Cabelo", barber: "b1", date: "hoje", time: "14:00", status: "Concluído" },
];
