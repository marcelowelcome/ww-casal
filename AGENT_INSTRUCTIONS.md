# AGENT_INSTRUCTIONS — Painel de Briefings Welcome Weddings

> **Regras de execução pro agente de IA** (Claude, Cursor, Windsurf) durante sessões de vibecoding neste projeto. Lido em par com `PROMPT_CONTEXT.md` (domínio), `ARCHITECTURE.md` (técnico) e `DESIGN_SYSTEM_WELCOME_WEDDINGS_MVP.md` (visual).
>
> Quando uma regra aqui conflitar com outro documento, **estas regras prevalecem** (são as mais específicas).

---

## 1. Princípios gerais

1. **Leia antes de escrever.** Antes de tocar em qualquer arquivo, faça `view` do arquivo (ou de um análogo no mesmo diretório) pra entender padrões locais.
2. **Pequeno e correto antes de grande e ambicioso.** Primeiro faça funcionar minimamente. Depois refine.
3. **Tipo antes de implementação.** Defina o tipo, o schema Zod, o contrato — depois codifique.
4. **Server-first.** Default é Server Component. `'use client'` só se houver motivo claro (estado, browser API, interação).
5. **Não improvise tokens de design.** Se a cor/tipografia/spacing não existe no `tailwind.config.ts`, **pare e pergunte**. Não invente hex no JSX.
6. **Não invente colunas do Sheets.** O schema é `src/lib/sheets/schema.ts`. Se uma coluna não está mapeada, perguntar antes de criar.
7. **Não introduzir nova dependência sem justificar.** O `package.json` deve ser explicitamente mantido enxuto. Dependência pesada (UI library, animation library) requer aprovação explícita.

## 2. Estilo de código

### 2.1 TypeScript

- `"strict": true`. Sem `any` salvo wrapper de lib externa com `// @ts-expect-error` ou `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + comentário curto da razão.
- Use `unknown` em vez de `any` quando o tipo é genuinamente desconhecido.
- Inferência sempre que possível. Tipo explícito em retornos de funções públicas e props de componentes.
- `interface` pra props de componente; `type` pra unions, intersections, mapped types.
- Sem `enum`. Use `as const` + union de literais:
  ```ts
  export const COUPLE_STATUS = ['novo', 'em_planejamento', 'realizado'] as const;
  export type CoupleStatus = (typeof COUPLE_STATUS)[number];
  ```
- Sem `namespace`. Use módulos ES.
- Imports nomeados, sem default export pra componentes (facilita refactor). Exceção: páginas do App Router (Next obriga default).

### 2.2 React

- Functional components. Sem class components.
- Sem `React.FC` — declarar props inline.
- Hooks no topo, ordem fixa: `useState`, `useReducer`, custom hooks, `useEffect`.
- Keys de listas: id estável (token do casal, id do item). Nunca índice de array.
- `<Image>` do Next sempre que possível. `<img>` só pra logos do Supabase, etc.

### 2.3 Tailwind

- Use os tokens semânticos do `tailwind.config.ts`. Não `text-[#B8956A]`, use `text-champagne-500`.
- Ordem das classes (convenção): layout → spacing → typography → color → effects → states. Plugin Prettier (`prettier-plugin-tailwindcss`) ordena automaticamente — basta rodar.
- Use `cn()` (de `@/lib/utils/cn`) pra conditionals e merges:
  ```tsx
  import { cn } from '@/lib/utils/cn';
  <div className={cn('text-body', isActive && 'text-champagne-500')} />
  ```
- Evite `className` muito longo (>15 classes). Se ficou denso, extraia em componente ou em `@layer components` no `globals.css`.

### 2.4 Naming

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componente | PascalCase | `BriefingSection`, `KeyValueList` |
| Arquivo de componente | PascalCase | `BriefingSection.tsx` |
| Arquivo de página App Router | kebab-case ou indicador Next | `page.tsx`, `loading.tsx` |
| Arquivo utility | kebab-case | `format-date.ts`, `cn.ts` |
| Função utility | camelCase | `formatDate`, `getCoupleByToken` |
| Hook | camelCase com `use` | `useDebounce`, `useCoupleSearch` |
| Constant | UPPER_SNAKE_CASE | `COLUMN_MAP`, `AUTH_ALLOWED_DOMAINS` |
| Tipo/Interface | PascalCase | `Couple`, `BriefingSectionProps` |
| Zod schema | PascalCase com sufixo Schema | `CoupleSchema`, `BriefingSectionSchema` |
| Variável de evento handler | `handleXxx` | `handlePrint`, `handleSearch` |

### 2.5 Imports

Ordem (Prettier organize cuida automático mas saiba a regra):

```ts
// 1. React + Next
import { Suspense } from 'react';
import Link from 'next/link';

// 2. Bibliotecas externas
import { z } from 'zod';
import { google } from 'googleapis';

// 3. @/lib
import { getCoupleByToken } from '@/lib/sheets/queries';
import { cn } from '@/lib/utils/cn';

// 4. @/components
import { SectionHeader } from '@/components/ds/SectionHeader';
import { CoupleHero } from '@/components/couple/CoupleHero';

// 5. @/types
import type { Couple } from '@/types/couple';

// 6. Relative (raro em projeto pequeno)
import { localHelper } from './helpers';
```

## 3. Tratamento de erros

### 3.1 Em funções de fonte de dados

```ts
// src/lib/sheets/queries.ts
export async function getCoupleByToken(token: string): Promise<Couple | null> {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({ /* … */ });
    const rows = response.data.values ?? [];
    const row = rows.find((r) => r[67] === token); // BP = index 67
    if (!row) return null;
    return parseCoupleRow(row);
  } catch (err) {
    console.error('[sheets] getCoupleByToken failed', { token, err });
    return null;
  }
}
```

### 3.2 Em Server Components

```tsx
// app/(app)/casais/[token]/page.tsx
import { notFound } from 'next/navigation';
import { getCoupleByToken } from '@/lib/sheets/queries';

export default async function CouplePage({ params }: { params: { token: string } }) {
  const couple = await getCoupleByToken(params.token);
  if (!couple) notFound();
  return <CoupleDetail couple={couple} />;
}
```

### 3.3 Em route handlers

```ts
export async function GET(request: Request) {
  try {
    // ...
    return Response.json(data);
  } catch (err) {
    console.error('[api] /xxx failed', err);
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
```

### 3.4 Sem mensagem técnica pro usuário

Mensagens visíveis na UI são sempre em pt-BR, calmas, sem detalhe técnico:

✅ "Não foi possível carregar este briefing. Tente atualizar em alguns instantes."
❌ "TypeError: Cannot read property 'values' of undefined"
❌ "Error 429: Quota exceeded"

## 4. Comentários

- Use comentário pra **explicar por quê**, não o quê. O código já diz o quê.
- TODO/FIXME aceitáveis em PRs de exploração, mas devem virar issue antes de merge em `main`.
- Em código sensível (parsing, auth, rate limit), comente referência ao schema:
  ```ts
  // Coluna BP (index 67) — token único da resposta do Typeform, slug da URL
  const token = row[67];
  ```
- JSDoc só em funções públicas exportadas de `lib/`. Não em componentes (props já documentam).

## 5. Padrões de commit

**Conventional Commits.** Branch protection no `main` deve checar isso (manual ou via GitHub Action).

```
feat: adiciona página de detalhe do casal
fix: corrige parsing de multi-select com ponto-e-vírgula no fim
chore: atualiza dependências de dev
docs: revisa AGENT_INSTRUCTIONS
refactor: extrai parser de booleanos em utility
style: ordena imports
test: adiciona caso de parsing de data vazia
```

Mensagens curtas (< 72 chars no título). Corpo opcional, mas em PR descritivo.

## 6. Como criar coisas

### 6.1 Novo componente de UI (primitive do DS)

1. `view` `src/components/ds/Badge.tsx` (ou outro pra inspiração).
2. Criar em `src/components/ds/NomeNovo.tsx`.
3. Export nomeado, tipo de props inline.
4. Sem `'use client'` salvo se interagir.
5. Usar tokens do `tailwind.config.ts`.
6. Adicionar ao barrel `src/components/ds/index.ts`.
7. Documentar uso em comentário no topo do arquivo (1-3 linhas).

### 6.2 Nova seção do briefing

1. Confirmar que as colunas necessárias estão em `src/lib/sheets/schema.ts`. Se não, adicionar primeiro.
2. Adicionar ao schema Zod em `src/types/couple.ts`.
3. Atualizar `parseCoupleRow` em `src/lib/sheets/parser.ts`.
4. Criar componente em `src/components/couple/BriefingSecaoXxx.tsx`.
5. Adicionar ao layout em `app/(app)/casais/[token]/page.tsx`.
6. Adicionar entry no `SidebarSections` em `src/components/layout/SidebarSections.tsx`.

### 6.3 Nova rota

1. Criar `app/.../page.tsx`.
2. Criar `loading.tsx` e `error.tsx` no mesmo diretório.
3. Verificar se o middleware já cobre (rotas dentro de `(app)` sim por default; rotas públicas precisam ser declaradas em `middleware.ts`).
4. Adicionar `revalidate` adequado.

### 6.4 Nova Server Action

1. Marcar com `'use server'` no topo do arquivo ou da função.
2. Em `src/lib/actions/<dominio>.ts`.
3. Validar input com Zod **dentro** da action (input vem de Client Component, então não é confiável).
4. Retornar `{ ok: true, data } | { ok: false, error: string }` pra facilitar uso no cliente.
5. Não lançar erro pra fora; logar interno e retornar `ok: false`.

## 7. Padrões de auth

### 7.1 Como verificar sessão em Server Component

```tsx
import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  // ...
}
```

Mas em geral, **o middleware já protege**. Esse check é redundante (defesa em profundidade). Faça em páginas críticas; em listagem genérica pode confiar no middleware.

### 7.2 Como verificar domínio do email

```ts
// src/lib/auth/allowed-domains.ts
const allowed = process.env.AUTH_ALLOWED_DOMAINS!.split(',').map((d) => d.trim().toLowerCase());

export function isAllowedEmail(email: string | undefined): boolean {
  if (!email) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && allowed.includes(domain);
}
```

Usado em middleware e em callback após OAuth.

### 7.3 Logout

Server Action ou route handler. Nunca via cliente direto (não invalida cookie HTTP-only).

## 8. Padrões de dados

### 8.1 Parsing de Sheets

Sempre passar pela função `parseCoupleRow(row: string[])` em `src/lib/sheets/parser.ts`. Não acessar `row[N]` diretamente fora desse arquivo.

### 8.2 Multi-select

Valores tipo `'Valor1;, Valor2; Valor3'` (com lixo de separador) — usar parser dedicado:

```ts
export function parseMultiSelect(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
```

### 8.3 Booleanos

```ts
export function parseBoolean(value: string | undefined): boolean | null {
  if (value === 'TRUE') return true;
  if (value === 'FALSE') return false;
  return null;
}
```

### 8.4 Datas livres

Manter como string. Não tentar parsear "Setembro/2027" ou "2028". O display preserva o texto original.

Só `submitted_at` (coluna BO) é parseado como Date:

```ts
export function parseSubmittedAt(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}
```

### 8.5 Vazias

Célula vazia (`''` ou `undefined`) **vira `null`** no objeto tipado. Nunca `''`. UI verifica `value == null` pra renderizar `EmptyState`.

## 9. Padrões de Design System

> Resumo prático. Detalhe completo em `DESIGN_SYSTEM_WELCOME_WEDDINGS_MVP.md`.

### 9.1 Tipografia

- **Títulos sempre `<h1>/<h2>/<h3>` em font-serif** (Georgia). Nunca `<div>` ou `<span>` simulando título.
- **Hierarquia obrigatória.** `h1` único por página. `h2` pra seção. `h3` pra subseção. Não pular níveis pra estilo.
- **Eyebrow não é heading.** Use `<div className="eyebrow">`, não `<h6>`.
- **Itálico em accent**: `<em>` dentro de `<h1/h2/h3>` automaticamente fica `champagne-500`. Use pra a palavra-chave do título, não pro título inteiro.

### 9.2 Cores

- Tokens semânticos sempre. `text-cocoa-800`, não `text-[#3A3027]`.
- Sem azul de link, sem verde-bandeira, sem cinza-Bootstrap.
- Feedback usa `moss`, `terracotta`, `mustard`. Nunca `green-500`, `red-500`, `yellow-500`.
- Texto em destaque ≤14px usa `champagne-700`, não `champagne-500` (contraste AA).

### 9.3 Espaçamento

- Padding horizontal de container: `px-8` (32px) desktop, `px-6` (24px) mobile.
- Espaço entre seções: `space-y-10` (40px). Marketing usaria 48-56px — admin não.
- Espaço dentro de seção (entre title e content): `space-y-6` (24px).

### 9.4 Componentes existentes

Antes de criar componente novo, verificar se já existe em `src/components/ds/`. Lista atual:

- `Eyebrow`, `SectionHeader`, `KeyValueList`, `Badge`, `Button`, `HairlineDivider`, `OrnamentDivider`, `PullQuote`, `StarList`, `SidebarNav`, `EmptyState`.

## 10. Padrões de linguagem (copy)

Toda label, mensagem, botão, etc. da UI segue:

### 10.1 Português brasileiro, formal-suave

- "Confirmar", não "OK"
- "Cancelar", não "Voltar" pra ações destrutivas
- "Atualizar agora" (CTA específico) > "Refresh" / "Recarregar"
- "Não foi possível carregar" > "Erro ao carregar"

### 10.2 Termos de marca proibidos

Em copy criada por nós (não em conteúdo da planilha):

- ❌ "noivos" → ✅ "o casal", ou usar nome
- ❌ diminutivos ("noivinhos", "padrinhozinho", etc.) → forma plena
- ❌ "mimo" → ✅ "presente", "gift"
- ❌ "ajuda", "ajudar" → ✅ "apoio", "conduzir", "produzir"

### 10.3 Nomes próprios

Quando exibir o nome do casal:
- ✅ "Micaele & Samuel"
- ✅ "Micaele e Samuel"
- ❌ "Família Andrade-Alves"
- ❌ "Os noivos"

### 10.4 Datas em pt-BR

`date-fns` com locale `pt-BR`. Formato padrão: `'dd 'de' MMMM 'de' yyyy'`.

```ts
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
// → "27 de maio de 2026"
```

## 11. Acessibilidade

Cada novo componente e página deve passar nesses checks antes de PR:

- [ ] Hierarquia de heading (`h1` único, sem pular níveis)
- [ ] `<nav>`, `<main>`, `<section>` semânticos
- [ ] `aria-label` em ícones/botões sem texto
- [ ] Focus visível em todos os elementos interativos
- [ ] Contraste ≥ AA (4.5:1) pra texto normal, 3:1 pra large
- [ ] Funciona sem mouse (Tab/Enter/Esc)
- [ ] Funciona sem JavaScript em páginas de conteúdo (Server Component renderiza tudo)

Lint plugin `eslint-plugin-jsx-a11y` ativado por default.

## 12. Print

Toda página do app que mostra briefing precisa ter:

- [ ] `print-only` header (logo + nome do casal + data) renderizado mas hidden em screen
- [ ] CSS `@media print` que esconde sidebar, header de app, botões
- [ ] `page-break-inside: avoid` em seções
- [ ] Verificação manual em PDF Preview (Chrome DevTools → Rendering → Emulate CSS media: print)

Regras de print já estão no `DESIGN_SYSTEM_WELCOME_WEDDINGS_MVP.md` seção 8.

## 13. Performance

- [ ] Server Component por default
- [ ] `'use client'` apenas com justificativa visível
- [ ] `<Image>` em vez de `<img>` quando possível
- [ ] Sem `useEffect` pra fetch — use Server Component
- [ ] Recharts importado dinâmico em rotas que usam (`next/dynamic`)
- [ ] Sem libraries de animação pesadas (Framer Motion etc) salvo aprovação

## 14. Antipadrões (não faça)

❌ **Inventar hex no JSX.** Tudo via tokens.
❌ **Editar a planilha do Sheets pelo painel.** Painel é readonly. Tentativa de escrita = bug.
❌ **Logar e-mail/nome/PII.** Use `token` se precisa identificar.
❌ **Expor service role do Supabase no cliente.** Nunca prefixar com `NEXT_PUBLIC_`.
❌ **Usar `useEffect` pra carregar dados em Client Component.** Use Server Component.
❌ **Custom CSS no `<style>` inline em vez de Tailwind.** Tudo via classes.
❌ **`zIndex` arbitrário.** Se precisa de layer ordering, use a escala do Tailwind (`z-10`, `z-20`, `z-50`).
❌ **`position: fixed` em conteúdo de página.** Quebra print, quebra mobile keyboard, quebra acessibilidade.
❌ **`window.location` pra navegação.** Use `next/navigation` (`useRouter`, `redirect`).
❌ **Default exports em componentes (exceto páginas).** Atrapalha refactor automático.
❌ **`async` em Client Component.** Server Components podem ser async, Client não.
❌ **`localStorage` ou `sessionStorage` pra dados sensíveis.** Cookies HTTP-only se precisar persistir.
❌ **Importar `googleapis` em Client Component.** Roda só no server.
❌ **Misturar lógica de auth e lógica de dados.** Auth fica em `lib/auth`. Dados em `lib/sheets`.
❌ **Suprimir erro com `try { } catch { /* nothing */ }`.** Sempre logar.
❌ **Comentários auto-evidentes.** `// incrementa contador` em `count++` é ruído.

## 15. Definition of Done

Antes de marcar uma tarefa como concluída e abrir PR:

- [ ] `pnpm check` passa (typecheck + lint + format)
- [ ] `pnpm build` passa
- [ ] Visualizado manualmente em dev (`pnpm dev`)
- [ ] Testado em desktop e mobile (Chrome DevTools responsive mode é OK)
- [ ] Testado em print preview se mexeu em página de briefing
- [ ] Sem warnings novos no console
- [ ] Sem `console.log` esquecido (`console.error` legítimo é OK)
- [ ] Sem TODO/FIXME sem issue associada
- [ ] PR com descrição clara do que mudou e por quê

---

**Fim.**
