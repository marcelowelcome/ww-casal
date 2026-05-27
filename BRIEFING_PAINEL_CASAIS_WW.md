# Briefing — Painel de Briefings Welcome Weddings

> Nome de trabalho sugerido: **DashBriefings** ou **BriefHub WW**.
> Status: rascunho para validação antes de virar `ARCHITECTURE.md` + `AGENT_INSTRUCTIONS.md`.

---

## 1. Objetivo

Criar uma camada de visualização sobre a planilha de respostas do Typeform de onboarding de casais (briefing pós-assinatura de contrato), substituindo a leitura direta em planilha por uma interface focada em **consulta, referência e impressão**.

Secundariamente, oferecer uma página de **sumarização agregada** que ajude a identificar padrões e tendências de resposta entre todos os casais já onboarded.

## 2. Escopo

### Dentro do escopo (MVP)
- Listagem de casais com busca/filtros básicos.
- Página de detalhe por casal com todas as respostas do briefing, organizadas por seção e otimizadas para leitura.
- Impressão para PDF (via `window.print()` + CSS print).
- Dashboard agregado com sumarização das respostas (visão de tendências).
- Responsivo desktop + mobile.
- Autenticação restrita ao time interno.

### Fora do escopo (por enquanto)
- Edição/escrita de volta na planilha.
- Notificações ou alertas automáticos.
- Integração com ActiveCampaign / CRM.
- Histórico/versionamento de respostas (se um casal preencher de novo, vira novo registro).
- Banco de dados próprio — leitura direta do Google Sheets via API.

## 3. Usuários

Time interno da Welcome Weddings que opera o ciclo de planejamento do casamento (cerimonialistas, assessoria, produção). Acesso esperado: ~5–15 pessoas simultâneas, leitura intensa, escrita zero.

**Padrão de uso esperado:**
- Diário/semanal por casal sob gestão (consulta direta antes de reuniões, decisões, briefings com fornecedores).
- Pontual em grupo (planejamento de período, identificação de padrões).
- Impressão eventual quando precisarem levar o briefing pra reunião offline ou compartilhar com fornecedor pontual.

## 4. Arquitetura técnica

### Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Componentes:** shadcn/ui (consistente com DashIG/DashWW)
- **Gráficos:** Recharts
- **Auth:** NextAuth.js com Google Provider, restrito por domínio (`@welcomegroup.com.br` / `@welcomeweddings.com.br` — *confirmar quais domínios*)
- **Fonte de dados:** Google Sheets API v4 via Service Account
- **Hospedagem:** Vercel
- **Versionamento:** GitHub (sugestão de repo: `mkt-briefings-ww`)

### Fluxo de dados

```
Casal preenche Typeform
        ↓
Typeform → Google Sheets (já existente)
        ↓
Next.js (Server Components / Route Handlers)
        ↓ via Service Account
Google Sheets API v4
        ↓
Cache ISR (revalidate: 300s)
        ↓
UI
```

### Cache & performance
- ISR com `revalidate: 300` (5 min) para a listagem e detalhe — fresca o suficiente sem estourar rate limit.
- Botão "Atualizar agora" usando `revalidateTag` (on-demand revalidation) na página de detalhe e no dashboard, pros casos em que alguém preencheu há poucos minutos.
- Rate limit do Sheets API: 300 req/min/projeto — folgado pra esse volume.

### Estrutura de rotas
```
/                       → redirect para /casais
/login                  → SSO Google
/casais                 → lista (busca + filtros)
/casais/[id]            → detalhe do briefing (otimizado para leitura e print)
/dashboard              → sumarização agregada
```

## 5. Funcionalidades em detalhe

### 5.1. Listagem de casais (`/casais`)
- Tabela ou grid de cards com: nome do casal, data do casamento, destino, status (se houver), data de preenchimento do briefing.
- Busca por nome.
- Filtros: período do casamento, destino, status.
- Ordenação por data de casamento (default) ou data de preenchimento.
- Click → `/casais/[id]`.

### 5.2. Detalhe do briefing (`/casais/[id]`)
**Princípio de design:** o time precisa **escanear** rápido em uma reunião. Hierarquia visual forte, seções claras, pergunta-resposta legível, sem ruído.

- Header com nome do casal, data do casamento, destino, link "voltar" e botão "Imprimir".
- Sidebar/menu âncora com as seções do briefing (no desktop) — colapsa em accordion no mobile.
- Respostas organizadas em seções temáticas (a definir conforme estrutura atual do Typeform — ver item 8.1).
- Tipografia generosa, espaçamento confortável, sem sobrecarga visual.
- Versão print: layout limpo, A4, sem header de navegação, sem sidebar, paginação inteligente (evita quebra no meio de uma resposta).

### 5.3. Dashboard agregado (`/dashboard`)
**Princípio:** visão panorâmica das respostas, não relatório executivo. Foco em identificar padrões.

Visualizações sugeridas (a calibrar conforme campos reais da planilha):
- **Cards de topo:** total de casais com briefing preenchido, casamentos próximos (próximos 6 meses), preenchimentos no último mês.
- **Destinos mais escolhidos** (pie/donut + tabela).
- **Distribuição de orçamento** (histograma ou faixas).
- **Número de convidados** (distribuição).
- **Estilo de casamento** (se houver pergunta categórica — barras horizontais).
- **Sazonalidade** (meses de casamento mais frequentes).
- **Temas/palavras-chave em respostas abertas** (opcional, complexo — fora do MVP, mas vale registrar).
- Filtro temporal global (últimos 30d / 90d / 12m / todos).

### 5.4. Impressão / PDF
- CSS `@media print` cuidando do layout.
- Botão "Imprimir" → `window.print()` → usuário escolhe "Salvar como PDF" no diálogo do navegador.
- Suficiente pra 95% dos casos. Se aparecer necessidade de PDF anexável programaticamente (ex: anexar em e-mail automaticamente), aí avaliamos `@react-pdf/renderer` ou rota server-side com Puppeteer.

### 5.5. Autenticação
- NextAuth.js + Google Provider.
- Whitelist por domínio de e-mail no callback de signIn.
- Sessão via JWT, cookie HTTP-only.
- Sem cadastro/onboarding interno — quem está no domínio, entra.

## 6. Design system

**Direção:** seguir a identidade visual do site `welcomeweddings.com.br` (paleta, tipografia, tom).

**Ponto a confirmar antes de implementar:**
- Você já tem o design system do Welcome Weddings documentado? (Lembro que o DESIGN_SYSTEM_WELCOME_TRIPS.md está pronto, mas o do Welcome Weddings estava pendente — vale fechar antes ou em paralelo com a primeira sprint).
- Referência do e-mail recente que você mencionou: posso adaptar a partir dele se você compartilhar o HTML/figma.

**Princípios visuais:**
- Sofisticação editorial — não dashboard corporativo.
- Tipografia com peso (serifa pra títulos? confirmar).
- Espaço em branco generoso.
- Cores discretas, contraste forte em CTAs.
- Print-friendly por design (sem depender de hack).

## 7. Considerações de segurança e privacidade

- **Dados sensíveis:** briefings têm orçamento, expectativas pessoais, contexto familiar. Não pode vazar.
- Auth obrigatório em todas as rotas exceto `/login`.
- Service Account com permissão **somente de leitura** na planilha (não dar edit).
- Variáveis sensíveis (chave do service account, secrets do NextAuth) só em env vars do Vercel.
- Logs do Vercel sem PII nos requests.
- Considerar adicionar `noindex` em meta tags por garantia.

## 8. Pontos a definir antes de partir pra implementação

### 8.1. Estrutura da planilha
- [ ] Compartilhar acesso de leitura da planilha pra eu mapear: colunas (perguntas), tipos de resposta (texto, número, múltipla escolha), agrupamento lógico por seção.
- [ ] Confirmar se há um identificador único confiável por casal (ex: e-mail, timestamp + nome). Necessário pro slug da URL `/casais/[id]`.
- [ ] Confirmar se a planilha tem casais reais hoje ou se ela está vazia (impacto: dá pra desenvolver com dados reais ou precisa de fixtures).

### 8.2. Identidade visual
- [ ] Design system Welcome Weddings — já existe em algum lugar? Posso ajudar a destilar do site se necessário.
- [ ] Compartilhar o e-mail recente como referência visual.

### 8.3. Autenticação
- [ ] Confirmar domínios autorizados (`@welcomegroup.com.br`, `@welcomeweddings.com.br`, outros).
- [ ] Lista inicial de pessoas que devem ter acesso — vale validar com Thiago/Diana se há restrição por papel.

### 8.4. Conteúdo do dashboard
- [ ] Quais perguntas do briefing são as mais relevantes pra sumarizar? Vale uma conversa rápida com Fabi / time de produção pra priorizar.

### 8.5. Nome do projeto e domínio
- [ ] Nome final.
- [ ] Subdomínio (ex: `briefings.welcomeweddings.com.br`, `painel.welcomeweddings.com.br`) ou domínio Vercel mesmo.

## 9. Marcos sugeridos

| Sprint | Entrega |
|---|---|
| **0 — Setup** | Repo + Vercel + Auth + leitura básica do Sheets |
| **1 — Detalhe** | Página de detalhe do casal funcionando com layout + print CSS |
| **2 — Listagem** | Listagem + busca + filtros |
| **3 — Dashboard** | Sumarização agregada |
| **4 — Polimento** | Refinamento visual, testes mobile, ajustes de print |

Cada sprint é curta (1–3 dias de vibecoding focado). Total: ~1–2 semanas de trabalho intermitente.

## 10. Próximo passo

Validar este briefing e responder os pontos em aberto da seção 8. Com isso fechado, gero:
1. `PROMPT_CONTEXT.md` (contexto do projeto pro agente)
2. `AGENT_INSTRUCTIONS.md` (regras e padrões)
3. `ARCHITECTURE.md` (estrutura técnica detalhada)
4. `SESSION_STARTER.md` (kickoff da primeira sessão de vibecoding)
