# ARCHITECTURE — Painel de Briefings Welcome Weddings

> Documento de **decisões técnicas**. Stack, topologia, fluxo de dados, padrões de implementação. Lido em par com `PROMPT_CONTEXT.md` (domínio) e `AGENT_INSTRUCTIONS.md` (regras de execução).

---

## 1. Visão geral

```
┌──────────────────────────────────────────────────────────────┐
│                      Browser (desktop/mobile)                │
└────────────────────────────┬─────────────────────────────────┘
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              Vercel — Next.js 14 (App Router)                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Middleware  │→ │ Server Comps │→ │ ISR cache (5min)  │   │
│  │  (auth gate) │  │   + Routes   │  │  + on-demand inv. │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
└──────────────┬────────────────────┬──────────────────────────┘
               │                    │
               ▼                    ▼
   ┌────────────────────┐  ┌────────────────────────┐
   │ Supabase Auth Hub  │  │ Google Sheets API v4   │
   │  Microsoft Entra   │  │  Service Account       │
   │  (single tenant)   │  │  (readonly scope)      │
   └────────────────────┘  └────────────────────────┘
```

### 1.1 Stack

| Camada | Tecnologia | Versão | Razão |
|---|---|---|---|
| Framework | Next.js (App Router) | 14.2+ | Padrão da casa; Server Components reduzem JS no cliente; ISR resolve cache |
| Linguagem | TypeScript | 5.4+ | Estrito. `any` proibido sem justificativa |
| UI | React | 18.3+ | Default do Next |
| Estilo | Tailwind CSS | 3.4+ | DS já configurado em `tailwind.config.ts` |
| Componentes | shadcn/ui | última | Consistente com DashIG/DashWW |
| Auth | Supabase Auth + Microsoft Entra | `@supabase/ssr` 0.5+ | Auth Hub centralizado já existente |
| Fonte de dados | Google Sheets API v4 | `googleapis` 134+ | Sem DB próprio no MVP |
| Validação | Zod | 3.23+ | Tipagem segura na borda |
| Charts (dashboard) | Recharts | 2.12+ | Consistente com DashIG/DashWW |
| Utilities | clsx, tailwind-merge, date-fns | última | Padrão da casa |
| Deploy | Vercel | — | Hosting + ISR + Edge |
| Versionamento | GitHub | — | Repo: `mkt-briefings-ww` |

### 1.2 Versões node/package manager

- Node ≥ 20.11 (LTS)
- pnpm 9+ (preferência da casa; `npm` aceito como fallback)

## 2. Topologia

### 2.1 Hosting

- **Frontend:** Vercel (Hobby ou Pro).
- **Domínio sugerido:** `briefings.welcomeweddings.com.br`. Importante por causa do compartilhamento de cookies de sessão com Auth Hub — ver Seção 4.4.
- **CDN:** automático via Vercel/Cloudflare.

### 2.2 Serviços externos

| Serviço | Endpoint/ID | Uso |
|---|---|---|
| Supabase Auth Hub | `https://ypzpkdgdbzruagjixwyc.supabase.co` | Auth via Microsoft Entra |
| Google Sheets (data) | sheet ID `1tXBibMrbDriYD3Fo9T66JvbuhnwY5Ii-G-zY4gPbqYs`, aba `WW \| Questionario Casal` | Fonte de briefings |
| Microsoft Entra (tenant) | tenant ID `3401294a-285d-4dd5-abb5-8e316d3c592c` | Identidade corporativa |

### 2.3 Repositório

- **Nome:** `mkt-briefings-ww`
- **Host:** GitHub (org da Welcome Group)
- **Branch principal:** `main`
- **Branch de trabalho:** `develop` (opcional, ou trabalhar direto em feature branches a partir de `main`)
- **Auto-deploy:** `main` → produção no Vercel; PRs → preview deploys.

## 3. Fluxo de dados

### 3.1 Leitura de briefing

```
1. Usuário acessa /casais/{token}
2. Middleware verifica sessão Supabase
3. Server Component chama getCoupleByToken(token)
4. getCoupleByToken consulta cache (Next data cache, ISR 5min)
5. Cache miss → fetch ao Google Sheets API
6. Parseia linha bruta → objeto Couple tipado (Zod)
7. Cache hit registrado com tag 'couples'
8. Server Component renderiza com dados tipados
```

### 3.2 Invalidação de cache

- **ISR:** todas as páginas de dados têm `export const revalidate = 300` (5min).
- **On-demand:** botão "Atualizar agora" na página de detalhe dispara `revalidateTag('couples')` via Server Action. Custo: 1 chamada extra ao Sheets, immediate freshness.
- **Dashboard:** `revalidate = 600` (10min) — dados agregados aguentam mais latência.

### 3.3 Rate limit do Sheets API

- Limite: 300 reads/min por projeto Google Cloud.
- Com ISR de 5min, mesmo 20 usuários consultando 20 casais = 20 reads/5min = bem dentro do limite.
- Picos esperados em reuniões: ~30 reads/min. Folgado.
- Hard guard: se chamadas falharem com 429, retornar dados em cache mesmo expirado (`stale-while-error` manual).

## 4. Autenticação

### 4.1 Provedor

**Supabase Auth** com **Microsoft Entra ID** como provider único. Sem outros providers habilitados.

### 4.2 Configuração no Azure

- **Tipo de conta:** "Accounts in this organizational directory only" (single tenant).
- **Tenant ID:** `3401294a-285d-4dd5-abb5-8e316d3c592c`.
- **Redirect URI:** `https://ypzpkdgdbzruagjixwyc.supabase.co/auth/v1/callback`.
- **Client ID:** `6b4ec79f-4691-488a-a83f-48ede283397d`.
- **Client Secret:** rotacionar antes do go-live (o atual já circulou em e-mail/chat).

### 4.3 Configuração no Supabase

- **Authentication → Providers → Azure** habilitado.
- **Site URL:** `https://briefings.welcomeweddings.com.br` (após domínio configurado).
- **Redirect URLs adicionais:** `http://localhost:3000/auth/callback` (dev), plus preview deploys (`https://*.vercel.app/auth/callback`).

### 4.4 Compartilhamento de sessão entre apps Welcome

O Auth Hub centralizado emite cookies de sessão. Pra compartilhar entre `briefings.welcomeweddings.com.br`, `dashig.welcomeweddings.com.br`, etc, **todos precisam estar no mesmo domínio raiz**. Cookie domain configurado pra `.welcomeweddings.com.br`.

Implicação: se esse painel for hospedado em `*.vercel.app` ou em outro domínio raiz, **funciona auth** mas **não compartilha sessão**. Usuário precisa logar de novo. Funcional, só menos elegante.

### 4.5 Restrição de acesso

**Em duas camadas:**

1. **Azure:** single-tenant config já filtra pra contas do tenant da Welcome Group.
2. **Middleware Next.js:** valida que o domínio do `user.email` está em whitelist (`AUTH_ALLOWED_DOMAINS` env var). Camada redundante de proteção.

Whitelist inicial: `welcomeweddings.com.br`, `welcomegroup.com.br`. Editável via env var sem deploy.

### 4.6 Sessão

- Supabase JWT em cookie HTTP-only, secure, SameSite=Lax.
- Refresh automático pelo `@supabase/ssr`.
- Middleware revalida sessão em toda navegação que não seja `/login` ou `/auth/callback`.

### 4.7 Logout

`POST /auth/signout` → Server Action que chama `supabase.auth.signOut()` → redirect pra `/login`.

## 5. Fonte de dados (Google Sheets)

### 5.1 Service Account

- Criar no Google Cloud Console, projeto dedicado (sugestão: `welcome-internal-tools`).
- Habilitar **Google Sheets API**.
- Compartilhar a planilha do Sheets com o e-mail da service account, **permissão Viewer**.
- Baixar JSON de credenciais → guardar em env var `GOOGLE_SERVICE_ACCOUNT_JSON` (stringificado).

### 5.2 Cliente

```ts
// src/lib/sheets/client.ts
import { google } from 'googleapis';

let _sheets: ReturnType<typeof google.sheets> | null = null;

export function getSheetsClient() {
  if (_sheets) return _sheets;

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  _sheets = google.sheets({ version: 'v4', auth });
  return _sheets;
}
```

### 5.3 Escopo

**Readonly.** Service account não tem permissão de escrita. Tentativa de update falha com 403. Camada de defesa contra bug.

### 5.4 Range

- Faixa lida: `'WW | Questionario Casal'!A:BP` (até a coluna do token).
- Em queries só do dashboard que precisam menos colunas, restringir o range pra economizar payload — mas otimização prematura no MVP, pular.

### 5.5 Parsing

Os dados vêm como `string[][]`. Precisam ser:

1. **Mapeados por índice de coluna → nome semântico** (ex.: índice 6 → `welcome_motivos`).
2. **Tipados conforme schema Zod**.
3. **Normalizados:**
   - Booleanos: `'TRUE'` → `true`, `'FALSE'` → `false`, `''` → `null`
   - Multi-select: `'Valor1;, Valor2;'` → `['Valor1', 'Valor2']` (trim de `;` e espaços)
   - Datas livres (`'5/14/2026 14:56:12'`, `'Setembro/2027'`, `'2028'`) → manter como string; só `submitted_at` (BO) é parseado como Date
   - Vazias → `null` (nunca `''` ou `undefined`)
4. **Identificadas pelo token (BP)** como `id`.

### 5.6 Schema de colunas

Definido em `src/lib/sheets/schema.ts`. Exemplo:

```ts
export const COLUMN_MAP = {
  // Identificação
  noiva_nome:        { index: 0, type: 'string' },
  noiva_sobrenome:   { index: 1, type: 'string' },
  noiva_email:       { index: 2, type: 'string' },
  noivo_nome:        { index: 3, type: 'string' },
  noivo_sobrenome:   { index: 4, type: 'string' },
  noivo_email:       { index: 5, type: 'string' },

  // Por que Welcome
  welcome_motivos:   { index: 6, type: 'multiselect' },
  welcome_indicacao: { index: 7, type: 'string' },
  welcome_motivos_texto: { index: 8, type: 'string' },

  // ... resto das 60+ colunas

  // Metadata
  submitted_at:      { index: 66, type: 'date' },
  token:             { index: 67, type: 'string' }, // BP, slug da URL
} as const;
```

Mudança no Typeform → atualizar `COLUMN_MAP`. **Schema é a única fonte de verdade sobre o layout da planilha.**

### 5.7 Tipagem

```ts
// src/types/couple.ts
import { z } from 'zod';

export const CoupleSchema = z.object({
  id: z.string(),                       // == token
  submitted_at: z.coerce.date(),

  identificacao: z.object({
    noiva: z.object({
      nome: z.string(),
      sobrenome: z.string(),
      email: z.string().email().nullable(),
    }),
    noivo: z.object({
      nome: z.string(),
      sobrenome: z.string(),
      email: z.string().email().nullable(),
    }),
  }),

  por_que_welcome: z.object({
    motivos: z.array(z.string()),
    indicacao: z.string().nullable(),
    texto_livre: z.string().nullable(),
  }),

  // ... 15 seções restantes
});

export type Couple = z.infer<typeof CoupleSchema>;
```

## 6. Estrutura de pastas

```
mkt-briefings-ww/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # root layout (html, body, fonts)
│   │   ├── globals.css                # DS tokens + base styles
│   │   ├── page.tsx                   # redirect → /casais
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── auth/
│   │   │       ├── callback/
│   │   │       │   └── route.ts       # OAuth callback handler
│   │   │       └── signout/
│   │   │           └── route.ts
│   │   ├── (app)/
│   │   │   ├── layout.tsx             # com AppHeader, AppFooter
│   │   │   ├── casais/
│   │   │   │   ├── page.tsx           # lista
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   └── [token]/
│   │   │   │       ├── page.tsx       # detalhe
│   │   │   │       ├── loading.tsx
│   │   │   │       ├── error.tsx
│   │   │   │       └── not-found.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       └── error.tsx
│   │   ├── robots.txt/
│   │   │   └── route.ts               # bloqueia tudo
│   │   └── opengraph-image.tsx        # genérico, sem PII
│   │
│   ├── components/
│   │   ├── ds/                        # design system primitives
│   │   │   ├── Eyebrow.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── KeyValueList.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── HairlineDivider.tsx
│   │   │   ├── OrnamentDivider.tsx
│   │   │   ├── PullQuote.tsx
│   │   │   ├── StarList.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   ├── couple/                    # domain-specific
│   │   │   ├── CoupleHero.tsx
│   │   │   ├── BriefingSection.tsx
│   │   │   ├── CoupleListItem.tsx
│   │   │   └── PrintHeader.tsx
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── DestinationChart.tsx
│   │   │   └── BudgetDistribution.tsx
│   │   └── layout/
│   │       ├── AppHeader.tsx
│   │       ├── AppFooter.tsx
│   │       └── SidebarSections.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts              # createServerClient
│   │   │   ├── client.ts              # createBrowserClient
│   │   │   └── middleware.ts          # updateSession helper
│   │   ├── sheets/
│   │   │   ├── client.ts              # google.sheets() singleton
│   │   │   ├── schema.ts              # COLUMN_MAP
│   │   │   ├── parser.ts              # row → Couple
│   │   │   └── queries.ts             # getCouples, getCoupleByToken, etc
│   │   ├── auth/
│   │   │   ├── allowed-domains.ts
│   │   │   └── require-session.ts
│   │   └── utils/
│   │       ├── cn.ts                  # clsx + tailwind-merge
│   │       └── format.ts              # formatDate, formatCurrency, etc
│   │
│   └── types/
│       ├── couple.ts                  # Zod schemas + types
│       └── briefing.ts                # secção definitions
│
├── public/
│   └── favicon.ico
│
├── middleware.ts                      # Next.js middleware (auth)
├── tailwind.config.ts
├── postcss.config.js
├── next.config.mjs
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── .env.local.example
├── package.json
└── README.md
```

## 7. Rotas

| Path | Componente | Cache | Auth | Descrição |
|---|---|---|---|---|
| `/` | redirect → `/casais` | static | — | Landing |
| `/login` | server | static | público | Tela de login com botão SSO |
| `/auth/callback` | route handler | dynamic | — | OAuth callback (PKCE) |
| `/auth/signout` | route handler | dynamic | sessão | Logout |
| `/casais` | server | ISR 5min | sessão | Lista de casais com busca/filtros |
| `/casais/[token]` | server | ISR 5min | sessão | Detalhe do briefing |
| `/dashboard` | server | ISR 10min | sessão | Visão agregada |
| `/robots.txt` | route handler | static | — | `User-agent: *\nDisallow: /` |

### 7.1 Server Components vs Client Components

**Default:** Server Component. Toda página, toda seção do briefing, todos os primitives do DS que não interagem.

**Quando virar Client (`'use client'`):**
- Componentes com `useState`, `useEffect`, `useRouter`
- Botão "Imprimir" (chama `window.print()`)
- Botão "Atualizar agora" (chama Server Action e dispara UI feedback)
- Busca/filtro da listagem
- Sidebar com âncoras (scroll behavior)
- Charts do dashboard (Recharts é client-only)

### 7.2 Loading e Error

Cada rota tem `loading.tsx` e `error.tsx` no mesmo nível. Loading usa skeleton com tokens do DS. Error é minimal e não vaza detalhe técnico.

## 8. Cache

| Recurso | Estratégia | TTL | Tag |
|---|---|---|---|
| `getCouples()` | `unstable_cache` + `revalidate` | 300s | `couples` |
| `getCoupleByToken()` | `unstable_cache` + `revalidate` | 300s | `couples`, `couple:{token}` |
| `getAggregates()` (dashboard) | `unstable_cache` + `revalidate` | 600s | `couples`, `aggregates` |

Server Action `refreshCouples()` chama `revalidateTag('couples')`.

## 9. TypeScript

- `tsconfig.json` com `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitAny": true`.
- `any` proibido (lint error) salvo em wrappers de bibliotecas externas, com comentário `// eslint-disable-next-line ... — razão`.
- Tipos derivados de Zod schemas via `z.infer<>`. Nunca duplicar tipo + schema manualmente.
- Path alias `@/*` → `src/*`.

## 10. Tratamento de erros

### 10.1 Camadas

1. **Bordas externas (Sheets, Supabase):** try/catch obrigatório. Catch loga `console.error` com contexto + retorna `null` ou erro tipado.
2. **Server Components:** chamam funções que retornam `null` em erro. Renderizam `EmptyState` ou disparam `notFound()`.
3. **Erros não capturados:** `error.tsx` por rota mostra tela amigável + opção de retry.

### 10.2 Mensagens

- **Pra usuário:** sempre em português BR, tom calmo. "Não foi possível carregar este briefing. Tente atualizar em alguns instantes."
- **Pra log:** inglês, completo, com stack trace e contexto.

### 10.3 Sem `throw` em Server Components

`throw` em Server Component bubble pra `error.tsx`. Use só pra erros realmente inesperados. Pra "não encontrei o briefing", use `notFound()` que renderiza `not-found.tsx`.

## 11. Logging e observability

### 11.1 MVP

- `console.error()` em catches — visível em Vercel logs.
- Vercel Analytics habilitado (gratuito).

### 11.2 V1 (depois)

- Sentry pra error tracking.
- Logflare ou similar pra logs estruturados.
- Posthog ou Plausible pra product analytics, se justificar.

### 11.3 Sem PII em logs

Em logs nunca aparecer:
- E-mail do casal
- Nome completo
- Telefone
- Orçamento

Em logs pode aparecer:
- Token do casal (é opaco, sem PII)
- Coluna ou seção com problema
- Timestamp
- Mensagem técnica

## 12. Variáveis de ambiente

### 12.1 Lista canônica

```bash
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://ypzpkdgdbzruagjixwyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
# Service role só se houver caso de uso server-side. MVP não tem.
# SUPABASE_SERVICE_ROLE_KEY=<service role>

# === Google Sheets ===
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","..."}'
GOOGLE_SHEETS_ID=1tXBibMrbDriYD3Fo9T66JvbuhnwY5Ii-G-zY4gPbqYs
GOOGLE_SHEETS_TAB=WW | Questionario Casal

# === Auth ===
AUTH_ALLOWED_DOMAINS=welcomeweddings.com.br,welcomegroup.com.br
AZURE_TENANT_ID=3401294a-285d-4dd5-abb5-8e316d3c592c

# === App ===
NEXT_PUBLIC_APP_URL=https://briefings.welcomeweddings.com.br
```

### 12.2 Regras

- Qualquer variável sensível **nunca tem prefixo `NEXT_PUBLIC_`**. Esse prefixo expõe pro bundle do cliente.
- `.env.local` ignorado no git. Apenas `.env.local.example` versionado, com placeholders.
- Em Vercel, vars configuradas via Dashboard → Settings → Environment Variables. Marcar quais são "Production" vs "Preview" vs "Development".

## 13. Performance budgets

| Métrica | Alvo |
|---|---|
| Página `/casais/[token]` LCP | < 1.5s no Vercel edge |
| Bundle JS no cliente | < 100KB gzipped na rota principal |
| Tempo de fetch ao Sheets | < 500ms p95 |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | 100 |

## 14. SEO e privacidade

- **`<meta name="robots" content="noindex, nofollow">`** em todas as páginas. Configurar em `app/layout.tsx`.
- **`/robots.txt`** com `User-agent: *` + `Disallow: /`.
- **Sem Open Graph com dados reais.** OG image é genérica (logo Welcome Weddings + "Painel interno").
- **Sem analytics que coletam PII.**

## 15. Comandos

```bash
# Dev
pnpm dev                    # next dev, porta 3000
pnpm dev --port 3001        # alternativa

# Build
pnpm build                  # next build
pnpm start                  # next start (prod local)

# Qualidade
pnpm typecheck              # tsc --noEmit
pnpm lint                   # next lint
pnpm lint:fix               # next lint --fix
pnpm format                 # prettier --write .
pnpm format:check           # prettier --check .

# Atalhos
pnpm check                  # typecheck + lint + format:check
```

## 16. CI/CD

### 16.1 Vercel

- **Production:** push em `main` → deploy automático.
- **Preview:** PR aberto → preview deploy automático com URL única.
- **Build command:** `pnpm build`.
- **Output:** `.next` (automático).
- **Environment:** Node 20.

### 16.2 GitHub Actions (opcional V1)

- Job de `pnpm check` em PRs antes do merge.
- Job de `pnpm build` pra catch de erros de build não pegos no Vercel preview.

### 16.3 Branch protection

- `main` protegida: requer PR review (mesmo que self-review se solo).
- Status checks obrigatórios: Vercel preview, GitHub Actions (se ativado).

## 17. Segurança — checklist resumido

- [ ] Service account com escopo readonly
- [ ] Service account credentials só em env var server-side
- [ ] Supabase anon key OK pro cliente, service role NUNCA exposto
- [ ] Azure client secret rotacionado antes do go-live
- [ ] Middleware de auth em TODAS as rotas exceto `/login`, `/auth/*`, `/robots.txt`
- [ ] Whitelist de domínio de e-mail validada server-side
- [ ] `noindex` global + robots.txt blocking
- [ ] Sem PII em logs, URLs, OG tags
- [ ] HTTPS forçado (Vercel default)
- [ ] Headers de segurança (CSP, HSTS, X-Frame-Options) — recomendado em `next.config.mjs`, ver V1

## 18. Decisões não óbvias e justificativas

- **Por que sem DB próprio?** O briefing tem fonte única (Typeform → Sheets). Adicionar DB introduz sincronização, latência de propagação e bug surface. Pra MVP, cache de 5min sobre Sheets resolve.
- **Por que ISR e não SSG?** SSG exige rebuild a cada novo casal. ISR atualiza sob demanda sem deploy.
- **Por que Server Components default?** Reduz JS no cliente (~70KB economizados). Sheets API roda só no server (não precisa expor credencial). Render mais rápido.
- **Por que Zod?** Dados externos (Sheets) são `unknown` por natureza. Zod garante que se o schema mudar e quebrar, falhamos cedo e explícito, não silenciosamente.
- **Por que sem testes unitários no MVP?** Tipos + parser determinístico + smoke test manual cobre 90% do risco. Em V1, testar `parser.ts` (lógica pura, alta cobertura por baixo custo) é o primeiro alvo.

---

**Fim.**
