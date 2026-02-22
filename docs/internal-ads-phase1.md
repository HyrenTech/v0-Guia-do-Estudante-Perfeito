# Internal Ads Ops - Fase 1

## O que foi implementado
- Rotas internas em `/internal/*` para dashboard operacional.
- APIs internas em `/api/internal/*` com contrato `{ data, meta, error }`.
- Cron endpoints:
  - `/api/cron/sync-hourly`
  - `/api/cron/reconcile-daily`
- Integrações:
  - Meta Marketing API (read-only)
  - Hotmart (webhook + sync por API opcional)
- Banco Postgres com schema completo da Fase 1.
- Engine de alertas automáticos.
- Segurança com Basic Auth no middleware.

## Setup
1. Copie `.env.example` para `.env.local` e preencha credenciais.
2. Execute migrations:
   - `pnpm db:migrate`
3. Inicie o app:
   - `pnpm dev`

## Endpoints principais
- `POST /api/internal/hotmart/webhook`
- `POST /api/internal/sync/run`
- `GET /api/internal/kpis`
- `GET /api/internal/timeseries`
- `GET /api/internal/campaigns`
- `GET /api/internal/ads`
- `GET /api/internal/alerts`
- `GET /api/internal/sync-status`

## Agendamento (Vercel)
Configuração em `vercel.json`:
- Sync horário: minuto 5 de cada hora
- Reconciliação diária: 06:15 UTC (03:15 BRT)

## Observações
- Fase 1 não executa alterações em campanhas; somente leitura + alertas.
- A precisão de vendas depende do payload/credenciais Hotmart e da atualização da integração.
