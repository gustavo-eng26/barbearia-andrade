// Dados confirmados da pesquisa. Itens [INSERIR INFORMAÇÃO] ainda não foram fornecidos.
export const business = {
  name: "Barbearia Andrade",
  address: "Rua José de Sáles, 102",
  city: "Lima Duarte, MG",
  cep: "36140-000",
  phone: "(32) 99804-3378",
  whatsapp: "5532998043378",
  rating: 4.9,
  reviews: 34,
  instagram: "@barbeariaandrade12",
  since: 2012,
  slogan: "Foco. Disciplina. Execução.",
  tagline: "Barba · Cabelo · Bigode",
  logo: `${import.meta.env.BASE_URL}images/logo.webp`,
  hours: [
    { label: "Segunda a sexta", value: "09:00 – 19:00", open: 9, close: 19, days: [1, 2, 3, 4, 5] },
    { label: "Sábado", value: "09:00 – 15:00", open: 9, close: 15, days: [6] },
    { label: "Domingo", value: "Fechado", open: 0, close: 0, days: [0] },
  ],
};
