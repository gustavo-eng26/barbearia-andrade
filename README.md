# Barbearia Andrade

Site responsivo e painel demonstrativo construídos com React, TypeScript, Vite e Tailwind CSS.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e execução local

```bash
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite no terminal. Para validar a versão de publicação:

```bash
npm run build
npm run preview
```

Os arquivos prontos para publicação são gerados em `dist/`.

## Publicação

O workflow `.github/workflows/deploy.yml` compila o projeto e publica `dist/` no GitHub Pages quando há um push para `main` ou uma execução manual do workflow. O projeto usa `HashRouter`, então as rotas funcionam em hospedagens estáticas.

## Painel e modo demonstração

- Acesse `/#/admin` e entre com usuário `admin` e senha `admin`.
- O acesso de demonstração não é autenticação segura e os dados do site e das contas de cliente são armazenados no navegador.
- Os indicadores de faturamento, visitas, clientes e distribuição de serviços do dashboard são ilustrativos; não representam dados comerciais reais.
- Serviços, preços, barbeiros e agendamentos ainda incluem dados de demonstração ou placeholders. Edição, persistência compartilhada e métricas reais dependem de um backend.
- Não publique dados de clientes nem use as credenciais de demonstração como proteção de produção. A segurança e a autorização devem ser implementadas no servidor.

Para ativar o modo de login administrativo via API, copie `.env.example` para `.env.local` e preencha `VITE_API_URL` com a URL do backend que implementa `POST /auth/login`. Variáveis `VITE_*` são incluídas no bundle público; nunca coloque segredos nelas. O fluxo de contas e agendamentos de clientes ainda usa armazenamento local e precisa de integração própria com o backend.

## Estrutura principal

- `src/pages/` — páginas públicas, agendamento e páginas administrativas.
- `src/components/` e `src/layouts/` — componentes compartilhados e layouts.
- `src/data/` — dados de demonstração e informações da barbearia.
- `public/images/` — imagens do site.
- `dist/` — saída gerada pelo build; não edite manualmente.
