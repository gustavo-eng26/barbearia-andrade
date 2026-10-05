export interface Service { id: string; name: string; description: string; duration: string; price: string }
// Nomes vistos na vitrine (Barba, Cabelo, Bigode). Descrição, duração e preço ainda são placeholders.
export const services: Service[] = [
  { id: "cabelo", name: "Cabelo", description: "[INSERIR DESCRIÇÃO]", duration: "[INSERIR] min", price: "R$ --,--" },
  { id: "barba", name: "Barba", description: "[INSERIR DESCRIÇÃO]", duration: "[INSERIR] min", price: "R$ --,--" },
  { id: "bigode", name: "Bigode", description: "[INSERIR DESCRIÇÃO]", duration: "[INSERIR] min", price: "R$ --,--" },
];
