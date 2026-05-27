# SESSION_STARTER — Painel de Briefings Welcome Weddings

> **Primeira sessão de vibecoding.** Setup zero → projeto rodando localmente com auth funcional + leitura do Sheets em ~60-90 minutos.
>
> Use este documento como roteiro literal. Cada seção tem comandos copy-pasteáveis e checklist de validação.

---

## Pré-requisitos

Verifique antes de começar:

- [ ] Node ≥ 20.11 (`node --version`)
- [ ] pnpm 9+ (`pnpm --version`) — se não tem: `npm install -g pnpm`
- [ ] Git configurado (`git config user.email`)
- [ ] Conta GitHub com acesso à org da Welcome Group
- [ ] Acesso ao Google Cloud Console
- [ ] Acesso ao Supabase Dashboard (`ypzpkdgdbzruagjixwyc`)
- [ ] Acesso ao Azure Portal (tenant `3401294a-...`)
- [ ] Acesso à planilha de briefings no Google Sheets
- [ ] VS Code instalado com extensões: ESLint, Prettier, Tailwind CSS IntelliSense

---

## Fase 0 — Provisionamento externo (uma vez)

Essas tarefas **não são de código** mas são pré-requisito. Faça antes de criar o repo.

### 0.1 Google Cloud — Service Account

1. Acessar [console.cloud.google.com](https://console.cloud.google.com).
2. Criar projeto (ou usar existente): `welcome-internal-tools`.
3. Habilitar Google Sheets API:
   - APIs & Services → Library → "Google Sheets API" → Enable.
4. Criar Service Account:
   - IAM & Admin → Service Accounts → Create Service Account.
   - Nome: `briefings-sheets-reader`.
   - Permissões: nenhuma (não precisa de role IAM, só acesso à planilha).
5. Criar key da Service Account:
   - Na SA criada → Keys → Add Key → JSON.
   - Baixar arquivo. **Guardar em local seguro** (vai virar env var).
6. Compartilhar a planilha:
   - Abrir a planilha do Sheets.
   - Compartilhar com o email da service account (algo como `briefings-sheets-reader@welcome-internal-tools.iam.gserviceaccount.com`).
   - Permissão: **Viewer**.
   - Desmarcar "Notify people".

✅ **Checkpoint:** você tem em mãos um JSON da service account e a planilha está compartilhada com ela.

### 0.2 Supabase — provider Microsoft já configurado?

Verificar:

1. Acessar [supabase.com/dashboard](https://supabase.com/dashboard) → projeto `ypzpkdgdbzruagjixwyc`.
2. Authentication → Providers → Azure.
3. Confirmar que está habilitado com:
   - `Application (client) ID`: `6b4ec79f-4691-488a-a83f-48ede283397d`
   - `Application Secret`: configurado (não precisa visualizar)
   - `Azure Tenant URL`: `https://login.microsoftonline.com/3401294a-285d-4dd5-abb5-8e316d3c592c/v2.0`

Se está configurado: ✅ avançar.

Se não está: configurar agora com os valores acima. **Importante:** antes do go-live, rotacionar o client secret no Azure e atualizar aqui.

### 0.3 Supabase — Site URL e Redirect URLs

Authentication → URL Configuration:

- **Site URL:** `http://localhost:3000` por enquanto. Trocar pra `https://briefings.welcomeweddings.com.br` antes do go-live.
- **Additional Redirect URLs:** adicionar:
  - `http://localhost:3000/auth/callback`
  - `https://*.vercel.app/auth/callback` (pra preview deploys)
  - `https://briefings.welcomeweddings.com.br/auth/callback` (pro futuro)

✅ **Checkpoint:** Supabase Auth aceita autenticar e retornar pro localhost.

### 0.4 GitHub — repo

1. Criar repo na org Welcome: `mkt-briefings-ww`.
2. Visibility: **private**.
3. Não inicializar com README (vamos criar local).
4. Anotar URL: `git@github.com:welcome-group/mkt-briefings-ww.git` (ajustar org name).

✅ **Checkpoint:** repo vazio, pronto pra receber primeiro commit.

---

## Fase 1 — Setup do projeto

### 1.1 Criar projeto Next.js

```bash
cd ~/Code   # ou onde você guarda projetos
pnpm create next-app@latest mkt-briefings-ww
```

Responder:
- TypeScript? **Yes**
- ESLint? **Yes**
- Tailwind CSS? **Yes**
- `src/` directory? **Yes**
- App Router? **Yes**
- Turbopack? **Yes**
- Customize import alias? **Yes** → `@/*`

```bash
cd mkt-briefings-ww
```

### 1.2 Instalar dependências

```bash
# Runtime
pnpm add @supabase/ssr @supabase/supabase-js googleapis zod date-fns clsx tailwind-merge

# Dev
pnpm add -D prettier prettier-plugin-tailwindcss eslint-plugin-jsx-a11y
```

### 1.3 Configurar Tailwind com o DS

Substituir conteúdo de `tailwind.config.ts` pelo do `DESIGN_SYSTEM_WELCOME_WEDDINGS_MVP.md` seção 9.1.

### 1.4 Configurar `globals.css`

Substituir `src/app/globals.css` pelo conteúdo da seção 9.2 do DS.

### 1.5 Configurar Prettier

Criar `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Criar `.prettierignore`:

```
.next
node_modules
pnpm-lock.yaml
public
```

### 1.6 Configurar ESLint

Editar `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

### 1.7 Configurar `tsconfig.json`

Adicionar/ajustar:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 1.8 Configurar `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 1.9 Adicionar scripts ao `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "check": "pnpm typecheck && pnpm lint && pnpm format:check"
  }
}
```

### 1.10 `.gitignore`

Verificar que tem (Next geralmente cria):

```
.next/
node_modules/
.env*.local
.vercel
*.log
.DS_Store
```

**Crítico:** `.env*.local` está aí. Se não estiver, adicionar imediatamente.

### 1.11 `.env.local.example`

Criar **versionado** com placeholders (sem valores reais):

```bash
# === Supabase (Auth Hub) ===
NEXT_PUBLIC_SUPABASE_URL=https://ypzpkdgdbzruagjixwyc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...

# === Google Sheets ===
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
GOOGLE_SHEETS_ID=1tXBibMrbDriYD3Fo9T66JvbuhnwY5Ii-G-zY4gPbqYs
GOOGLE_SHEETS_TAB=WW | Questionario Casal

# === Auth restriction ===
AUTH_ALLOWED_DOMAINS=welcomeweddings.com.br,welcomegroup.com.br
AZURE_TENANT_ID=3401294a-285d-4dd5-abb5-8e316d3c592c

# === App ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.12 `.env.local` (NÃO commitar)

Copiar do `.example` e preencher com valores reais:

```bash
cp .env.local.example .env.local
# Editar .env.local com:
# - NEXT_PUBLIC_SUPABASE_ANON_KEY do dashboard Supabase
# - GOOGLE_SERVICE_ACCOUNT_JSON com o JSON da service account (single-line, escape de quebras)
```

**Pra o JSON da service account vira single-line:**

```bash
# Em mac/linux:
cat /caminho/para/service-account.json | tr -d '\n' | pbcopy
# Cola direto após GOOGLE_SERVICE_ACCOUNT_JSON= entre aspas simples
```

✅ **Checkpoint Fase 1:** rodar `pnpm dev` abre `localhost:3000` com a landing page padrão do Next.

---

## Fase 2 — Esqueleto do app

### 2.1 Estrutura de pastas inicial

```bash
mkdir -p src/components/ds src/components/couple src/components/layout
mkdir -p src/lib/supabase src/lib/sheets src/lib/auth src/lib/utils
mkdir -p src/types
mkdir -p src/app/\(auth\)/login src/app/\(auth\)/auth/callback
mkdir -p src/app/\(app\)/casais src/app/\(app\)/casais/\[token\] src/app/\(app\)/dashboard
mkdir -p src/app/robots.txt
```

### 2.2 Utilities básicas

`src/lib/utils/cn.ts`:

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`src/lib/auth/allowed-domains.ts`:

```ts
const allowed = (process.env.AUTH_ALLOWED_DOMAINS ?? '')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && allowed.includes(domain);
}
```

### 2.3 Clientes Supabase

`src/lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // chamado de Server Component — ignorar (cookies já enviados)
          }
        },
      },
    },
  );
}
```

`src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

`src/lib/supabase/middleware.ts`:

```ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { isAllowedEmail } from '@/lib/auth/allowed-domains';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublic =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/robots.txt';

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && !isAllowedEmail(user.email)) {
    // domínio não autorizado — derruba sessão
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'unauthorized_domain');
    return NextResponse.redirect(url);
  }

  return response;
}
```

`middleware.ts` (na **raiz** do projeto, fora de `src/`):

```ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 2.4 Páginas de auth

`src/app/(auth)/login/page.tsx`:

```tsx
import { LoginButton } from './LoginButton';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen bg-sand-100 flex items-center justify-center px-6">
      <div className="bg-paper border border-sand-200 rounded-md px-10 py-12 max-w-md w-full text-center">
        <div className="font-serif text-2xl text-cocoa-900 mb-2">
          Welcome <em className="italic text-champagne-500">Weddings</em>
        </div>
        <div className="text-[10px] tracking-[3px] uppercase text-cocoa-400 mb-10">
          Painel de Briefings
        </div>

        {searchParams.error === 'unauthorized_domain' && (
          <p className="text-sm text-terracotta-700 bg-terracotta-50 px-4 py-3 rounded-sm mb-6">
            Sua conta não tem permissão para acessar este painel.
          </p>
        )}

        <LoginButton />
      </div>
    </main>
  );
}
```

`src/app/(auth)/login/LoginButton.tsx`:

```tsx
'use client';

import { createSupabaseBrowser } from '@/lib/supabase/client';

export function LoginButton() {
  const supabase = createSupabaseBrowser();

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email openid',
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-cocoa-900 hover:bg-cocoa-800 text-paper text-xs tracking-[2px] uppercase font-bold px-7 h-[54px] rounded-sm transition-colors w-full"
    >
      Entrar com Microsoft
    </button>
  );
}
```

`src/app/(auth)/auth/callback/route.ts`:

```ts
import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/casais`);
}
```

### 2.5 Root layout

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Painel de Briefings · Welcome Weddings',
  description: 'Painel interno de briefings de casais.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx` (redirect):

```tsx
import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/casais');
}
```

`src/app/robots.txt/route.ts`:

```ts
export function GET() {
  return new Response('User-agent: *\nDisallow: /\n', {
    headers: { 'Content-Type': 'text/plain' },
  });
}
```

### 2.6 Layout de app

`src/app/(app)/layout.tsx`:

```tsx
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="bg-sand-100 min-h-[calc(100vh-64px)]">{children}</main>
    </>
  );
}
```

`src/components/layout/AppHeader.tsx`:

```tsx
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="bg-paper border-b border-sand-200 px-8 py-4 flex items-center justify-between">
      <Link href="/casais" className="font-serif text-lg text-cocoa-900">
        Welcome <em className="italic text-champagne-500">Weddings</em>
      </Link>
      <div className="text-[10px] tracking-[3px] uppercase text-cocoa-400">
        Painel de Briefings
      </div>
    </header>
  );
}
```

### 2.7 Página `/casais` placeholder

`src/app/(app)/casais/page.tsx`:

```tsx
export const revalidate = 300;

export default async function CasaisPage() {
  return (
    <div className="px-8 py-10 max-w-4xl mx-auto">
      <div className="text-[10px] tracking-[4px] uppercase text-champagne-500 mb-3.5">
        — Briefings —
      </div>
      <h1 className="font-serif font-normal text-[36px] leading-[44px] text-cocoa-900 mb-6">
        Casais em <em className="italic text-champagne-500">planejamento</em>
      </h1>
      <p className="text-sm leading-6 text-cocoa-700">
        Em breve: lista de casais com busca e filtros.
      </p>
    </div>
  );
}
```

✅ **Checkpoint Fase 2:** `pnpm dev` → `localhost:3000` redireciona pra `/login` → botão Microsoft abre fluxo Azure → após login retorna pra `/casais` placeholder.

---

## Fase 3 — Conexão com Google Sheets

### 3.1 Cliente Sheets

`src/lib/sheets/client.ts`:

```ts
import { google, type sheets_v4 } from 'googleapis';

let _sheets: sheets_v4.Sheets | null = null;

export function getSheetsClient(): sheets_v4.Sheets {
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

### 3.2 Schema de colunas (parcial — começar com 4 seções)

`src/lib/sheets/schema.ts`:

```ts
// Mapeamento coluna → posição. Mudou no Typeform? Atualize aqui.
// Aba: "WW | Questionario Casal"
// Range padrão: A:BP (até a coluna do token)

export const COLUMN_INDEX = {
  // Identificação (A-F)
  noiva_nome:        0,
  noiva_sobrenome:   1,
  noiva_email:       2,
  noivo_nome:        3,
  noivo_sobrenome:   4,
  noivo_email:       5,

  // Por que Welcome (G-I)
  welcome_motivos:       6,
  welcome_indicacao:     7,
  welcome_texto:         8,

  // Destino e local (J-M)
  destino_sonhos:        9,
  destino_pesquisaram:  10,
  destino_gostaram:     11,
  destino_nao_gostaram: 12,

  // ... resto a expandir conforme implementarmos cada seção

  // Metadata (BO, BP)
  submitted_at: 66,
  token:        67,
} as const;
```

### 3.3 Parsers

`src/lib/sheets/parser.ts`:

```ts
export function parseString(value: unknown): string | null {
  if (value == null || value === '') return null;
  return String(value).trim();
}

export function parseMultiSelect(value: unknown): string[] {
  if (value == null) return [];
  return String(value)
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function parseBoolean(value: unknown): boolean | null {
  if (value === 'TRUE') return true;
  if (value === 'FALSE') return false;
  return null;
}

export function parseSubmittedAt(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}
```

### 3.4 Type Couple + parse

`src/types/couple.ts`:

```ts
import { z } from 'zod';

export const CoupleSchema = z.object({
  id: z.string(),
  submitted_at: z.date().nullable(),

  identificacao: z.object({
    noiva: z.object({
      nome: z.string().nullable(),
      sobrenome: z.string().nullable(),
      email: z.string().nullable(),
    }),
    noivo: z.object({
      nome: z.string().nullable(),
      sobrenome: z.string().nullable(),
      email: z.string().nullable(),
    }),
  }),

  por_que_welcome: z.object({
    motivos: z.array(z.string()),
    indicacao: z.string().nullable(),
    texto: z.string().nullable(),
  }),

  destino: z.object({
    sonhos: z.string().nullable(),
    pesquisaram: z.string().nullable(),
    gostaram: z.string().nullable(),
    nao_gostaram: z.string().nullable(),
  }),
});

export type Couple = z.infer<typeof CoupleSchema>;
```

`src/lib/sheets/queries.ts`:

```ts
import { unstable_cache } from 'next/cache';
import { COLUMN_INDEX } from './schema';
import { parseString, parseMultiSelect, parseSubmittedAt } from './parser';
import { CoupleSchema, type Couple } from '@/types/couple';
import { getSheetsClient } from './client';

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const TAB = process.env.GOOGLE_SHEETS_TAB!;

export function parseCoupleRow(row: string[]): Couple {
  const get = (idx: number) => row[idx] ?? '';

  const data = {
    id: get(COLUMN_INDEX.token),
    submitted_at: parseSubmittedAt(get(COLUMN_INDEX.submitted_at)),
    identificacao: {
      noiva: {
        nome: parseString(get(COLUMN_INDEX.noiva_nome)),
        sobrenome: parseString(get(COLUMN_INDEX.noiva_sobrenome)),
        email: parseString(get(COLUMN_INDEX.noiva_email)),
      },
      noivo: {
        nome: parseString(get(COLUMN_INDEX.noivo_nome)),
        sobrenome: parseString(get(COLUMN_INDEX.noivo_sobrenome)),
        email: parseString(get(COLUMN_INDEX.noivo_email)),
      },
    },
    por_que_welcome: {
      motivos: parseMultiSelect(get(COLUMN_INDEX.welcome_motivos)),
      indicacao: parseString(get(COLUMN_INDEX.welcome_indicacao)),
      texto: parseString(get(COLUMN_INDEX.welcome_texto)),
    },
    destino: {
      sonhos: parseString(get(COLUMN_INDEX.destino_sonhos)),
      pesquisaram: parseString(get(COLUMN_INDEX.destino_pesquisaram)),
      gostaram: parseString(get(COLUMN_INDEX.destino_gostaram)),
      nao_gostaram: parseString(get(COLUMN_INDEX.destino_nao_gostaram)),
    },
  };

  return CoupleSchema.parse(data);
}

async function fetchCouplesRaw(): Promise<string[][]> {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A2:BP`, // pula header
    });
    return response.data.values ?? [];
  } catch (err) {
    console.error('[sheets] fetchCouplesRaw failed', err);
    return [];
  }
}

export const getCouples = unstable_cache(
  async (): Promise<Couple[]> => {
    const rows = await fetchCouplesRaw();
    return rows
      .filter((row) => row[COLUMN_INDEX.token]) // só linhas com token
      .map((row) => {
        try {
          return parseCoupleRow(row);
        } catch (err) {
          console.error('[sheets] parse failed for token', row[COLUMN_INDEX.token], err);
          return null;
        }
      })
      .filter((c): c is Couple => c !== null);
  },
  ['couples'],
  { revalidate: 300, tags: ['couples'] },
);

export async function getCoupleByToken(token: string): Promise<Couple | null> {
  const couples = await getCouples();
  return couples.find((c) => c.id === token) ?? null;
}
```

### 3.5 Página de detalhe — smoke test

`src/app/(app)/casais/[token]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import { getCoupleByToken } from '@/lib/sheets/queries';

export const revalidate = 300;

export default async function CouplePage({ params }: { params: { token: string } }) {
  const couple = await getCoupleByToken(params.token);
  if (!couple) notFound();

  return (
    <div className="px-8 py-10 max-w-4xl mx-auto">
      <div className="text-[10px] tracking-[4px] uppercase text-champagne-500 mb-3.5">
        — Briefing do casal —
      </div>
      <h1 className="font-serif font-normal text-[38px] leading-[46px] text-cocoa-900 mb-4 tracking-[-0.5px]">
        {couple.identificacao.noiva.nome} &amp;{' '}
        <em className="italic text-champagne-500">{couple.identificacao.noivo.nome}</em>
      </h1>
      <p className="text-xs text-cocoa-400 mb-10">
        Token: {couple.id}
      </p>

      <pre className="text-xs bg-sand-50 p-4 rounded-sm border border-sand-200 overflow-auto">
        {JSON.stringify(couple, null, 2)}
      </pre>
    </div>
  );
}
```

### 3.6 Validar lendo um token real

1. Abrir planilha → copiar valor da coluna BP de algum casal preenchido (ex.: `uuld1xf9p4n86i8ihfnzuuld1xfk9g3n`).
2. Acessar `http://localhost:3000/casais/uuld1xf9p4n86i8ihfnzuuld1xfk9g3n`.
3. Deve renderizar nome do casal + JSON com as 4 seções.

✅ **Checkpoint Fase 3:** auth + leitura do Sheets funcionando localmente.

---

## Fase 4 — Primeiro commit e deploy

### 4.1 Commit inicial

```bash
git init
git add .
git status   # confere que .env.local NÃO aparece
git commit -m "chore: bootstrap projeto com auth e leitura inicial do sheets"
```

### 4.2 Push para GitHub

```bash
git remote add origin git@github.com:welcome-group/mkt-briefings-ww.git
git branch -M main
git push -u origin main
```

### 4.3 Deploy no Vercel

1. Acessar [vercel.com](https://vercel.com).
2. **Add New Project** → Import `mkt-briefings-ww`.
3. Framework: Next.js (auto-detect).
4. Environment Variables: adicionar **todas** as vars de `.env.local` (uma a uma).
   - **Importante:** marcar `GOOGLE_SERVICE_ACCOUNT_JSON` como "Sensitive" pra não aparecer em logs.
5. Deploy.
6. Aguardar build verde (~1-2min).

### 4.4 Atualizar Supabase com URL do Vercel

1. Vercel → copiar URL gerada (algo como `mkt-briefings-ww.vercel.app`).
2. Supabase Dashboard → Authentication → URL Configuration:
   - Adicionar `https://mkt-briefings-ww.vercel.app/auth/callback` em Redirect URLs.
3. Testar login no deploy.

### 4.5 (Opcional, pro go-live) Configurar domínio custom

1. Vercel → Project Settings → Domains → adicionar `briefings.welcomeweddings.com.br`.
2. Configurar DNS (CNAME apontando pra Vercel).
3. Atualizar Site URL no Supabase pra `https://briefings.welcomeweddings.com.br`.
4. Atualizar env `NEXT_PUBLIC_APP_URL` no Vercel.

✅ **Checkpoint Fase 4:** app em produção, acessível via URL Vercel ou domínio custom.

---

## Checklist final da primeira sessão

- [ ] Projeto Next.js criado e configurado
- [ ] Tailwind + DS aplicados
- [ ] ESLint + Prettier configurados
- [ ] Supabase Auth funcionando localmente (login com Microsoft)
- [ ] Whitelist de domínio validando
- [ ] Sheets API conectada via service account
- [ ] Página `/casais/[token]` renderiza um briefing real
- [ ] Parser de pelo menos 4 seções funcionando
- [ ] Schema Zod validando os dados
- [ ] `pnpm check` passa sem erro
- [ ] Repositório no GitHub
- [ ] Primeiro deploy Vercel verde
- [ ] `.env.local` NÃO commitado
- [ ] `noindex` ativo em todas as rotas

---

## Próximas sessões — roadmap sugerido

1. **Sessão 2:** Expandir parser pra todas as 17 seções + componentes DS (`Eyebrow`, `SectionHeader`, `KeyValueList`).
2. **Sessão 3:** Página de detalhe completa com layout final (sidebar + content) + print CSS.
3. **Sessão 4:** Página de listagem `/casais` com busca e filtros.
4. **Sessão 5:** Dashboard agregado com Recharts.
5. **Sessão 6:** Polimento, mobile testing, validação com usuários reais.

Cada sessão começa com `view` do PROMPT_CONTEXT, ARCHITECTURE, AGENT_INSTRUCTIONS e DS — refresh de contexto antes de qualquer modificação.

---

**Fim. Bom hack.**
