# Design System Welcome Weddings — MVP

> **Status:** Minimum viable, focado em interfaces administrativas e de leitura.
> **Versão:** 0.1 (extraída do e-mail marketing `email_semana13_mexico_casamentos.html` em maio/2026).
> **Escopo:** suficiente pra construir o Painel de Briefings e servir de base reaproveitável pros próximos projetos internos da Welcome Weddings (DashWW, eventual Content Hub WW). Não pretende cobrir marca pública/marketing — pra isso, expandir em V1.
> **Próximo upgrade:** quando esse DS for usado em 2+ projetos, formalizar V1 com cobertura de componentes de formulário, navegação principal, modais, estados vazios e tabelas complexas.

---

## 1. Princípios

O DS herda 4 princípios do material de marca observado:

1. **Editorial antes de UI.** Hierarquia tipográfica, eyebrow, ornamentos, espaço em branco. A interface é uma página, não um app.
2. **Terra antes de tela.** Paleta exclusivamente terrosa. Sem azul de link, sem verde-neon, sem cinza-de-dashboard. A cor reforça a marca; cor genérica a apaga.
3. **Calma antes de densidade.** Padding generoso, line-height alto, transições curtas. Pra balancear o uso admin (leitura repetida), reduzimos o padding do marketing em ~30%, mas mantemos o respiro.
4. **Refinamento de joalheria.** Border-radius 2px, bordas de 0.5–1px, sombras quase ausentes. Detalhe sutil > efeito chamativo.

Quando uma decisão de design ficar em dúvida, voltar a esses 4 princípios.

---

## 2. Cores

### 2.1 Escalas primárias

#### `champagne` — accent principal (dourado terroso)

Cor de assinatura da marca. Usada em itálicos decorativos dentro de títulos, links, CTA primário, badges em destaque, bullets `✦`, bordas de pull-quote.

| Token | Hex | Uso típico |
|---|---|---|
| `champagne-50` | `#FBF8F3` | Hover sutil em itens em accent |
| `champagne-100` | `#F4EAD5` | Background de badge, fundo de seção destacada |
| `champagne-200` | `#E8D2A8` | Borders em destaque |
| `champagne-300` | `#D7B584` | (raro — gradação intermediária) |
| `champagne-400` | `#C8A576` | (raro) |
| **`champagne-500`** | **`#B8956A`** | **Accent canônico do e-mail.** Itálico, CTA primário, links, bullets |
| `champagne-600` | `#9B7B53` | Hover do CTA primário |
| `champagne-700` | `#7B603E` | Texto accent em corpo (≥4.5:1 sobre branco) |
| `champagne-800` | `#5B452B` | Texto accent em backgrounds claros |
| `champagne-900` | `#3D2D1B` | (raro) |

#### `cocoa` — texto e neutros escuros (marrom)

Tipografia principal e neutros escuros. Substitui o "preto" e os "cinzas escuros" tradicionais.

| Token | Hex | Uso típico |
|---|---|---|
| `cocoa-50` | `#F5F2EE` | (raro) |
| `cocoa-100` | `#E5DDD3` | Borders em paper |
| `cocoa-200` | `#C8BAA6` | (raro) |
| `cocoa-300` | `#A89678` | Placeholder, ícones desativados |
| **`cocoa-400`** | **`#9A8C77`** | **Texto secundário do e-mail.** Metadados, footer |
| `cocoa-500` | `#6F5F4C` | Texto secundário com contraste melhor |
| `cocoa-600` | `#5C4D3D` | Subtítulos |
| **`cocoa-700`** | **`#4A3F33`** | **Subtítulos do e-mail.** H3 alternativo, labels |
| **`cocoa-800`** | **`#3A3027`** | **Corpo principal do e-mail.** Texto padrão |
| **`cocoa-900`** | **`#2A1810`** | **Títulos do e-mail.** H1/H2, CTA secundário |

#### `sand` — backgrounds e dividers (bege/areia)

Backgrounds neutros e bordas finas. Cria o "papel" sobre o qual o conteúdo respira.

| Token | Hex | Uso típico |
|---|---|---|
| **`sand-50`** | **`#FAF6F0`** | **Background de seção destacada do e-mail** |
| **`sand-100`** | **`#F4EFE6`** | **Background base do e-mail.** Canvas da página |
| **`sand-200`** | **`#E8DFD3`** | **Dividers e borders do e-mail** |
| `sand-300` | `#D9CCB9` | Borders mais visíveis |
| `sand-400` | `#C2B197` | (raro) |
| `sand-500` | `#A89578` | (raro) |

#### `paper` e `ink`

Brancos e pretos absolutos, usados raramente.

| Token | Hex | Uso |
|---|---|---|
| `paper` | `#FFFFFF` | Container de conteúdo principal (cards, modais) |
| `ink` | `#1A0F08` | Print preto (não use em tela; reservado pra print CSS) |

### 2.2 Tokens semânticos

Camada de abstração que mapeia uso → cor. **Use sempre tokens semânticos em código**, não os tokens de escala diretamente.

```ts
// Backgrounds
'bg-canvas'         → sand-100   // página
'bg-paper'          → paper      // container de conteúdo
'bg-elevated'       → sand-50    // seção destacada, card sutil

// Textos
'text-primary'      → cocoa-800  // corpo
'text-heading'      → cocoa-900  // H1/H2/H3
'text-secondary'    → cocoa-700  // subtítulos
'text-muted'        → cocoa-400  // metadados, hints
'text-accent'       → champagne-500  // itálico decorativo em títulos
'text-accent-body'  → champagne-700  // accent em texto pequeno (contraste OK)

// Borders
'border-hairline'   → sand-200   // dividers padrão
'border-subtle'     → cocoa-100  // borders em paper
'border-accent'     → champagne-500  // borders em destaque

// Interactive
'interactive-primary'        → champagne-500
'interactive-primary-hover'  → champagne-600
'interactive-secondary'      → cocoa-900
'interactive-secondary-hover' → cocoa-800
```

### 2.3 Paleta de feedback

Quatro cores funcionais, todas pensadas pra **coexistir com a paleta terrosa** sem destoar. Diferente das paletas de UI tradicionais (verde-bandeira, vermelho-bombeiro), aqui tudo é levemente dessaturado e quente.

#### `moss` — sucesso

| Token | Hex | Uso |
|---|---|---|
| `moss-50` | `#F1F4ED` | Background de alerta de sucesso |
| `moss-100` | `#DEE4D2` | Background mais sólido |
| `moss-500` | `#6B7A4A` | Ícone, texto em background claro |
| `moss-700` | `#4A5532` | Texto sobre `moss-50` (contraste ≥7) |
| `moss-900` | `#2D3520` | Texto escuro de ênfase |

#### `terracotta` — erro/danger

| Token | Hex | Uso |
|---|---|---|
| `terracotta-50` | `#F8EDE6` | Background de erro |
| `terracotta-100` | `#EDD2BC` | Background sólido |
| `terracotta-500` | `#B2604A` | Ícone, ações destrutivas |
| `terracotta-700` | `#804330` | Texto sobre `terracotta-50` |
| `terracotta-900` | `#5A2E20` | Texto escuro de ênfase |

#### `mustard` — atenção/warning

| Token | Hex | Uso |
|---|---|---|
| `mustard-50` | `#FAF4DC` | Background de aviso |
| `mustard-100` | `#F0E1A8` | Background sólido |
| `mustard-500` | `#C99F2E` | Ícone |
| `mustard-700` | `#8E6F1A` | Texto sobre `mustard-50` |
| `mustard-900` | `#5A4710` | Texto escuro de ênfase |

#### Info

**Não há cor info dedicada.** Quando precisar de "informação destacada", use `champagne` — o accent da marca já cumpre essa função e mantém coerência.

### 2.4 Regras de uso de cor

1. **Cor codifica significado, não decora.** Não use champagne pra "embelezar" — use pra destacar. Não use moss em metadados — use só em estados de sucesso.
2. **Texto pequeno (≤14px) em accent usa `champagne-700`**, não `champagne-500`. O 500 não passa 4.5:1 sobre branco.
3. **Texto em backgrounds coloridos sempre usa o tom 700+ da mesma família.** Texto sobre `moss-50` usa `moss-700`. Texto sobre `champagne-100` usa `champagne-800`.
4. **Nunca use preto absoluto (`#000`) em texto.** O DS substitui por `cocoa-900`. Preto puro destoa do conjunto.

---

## 3. Tipografia

### 3.1 Famílias

```css
--font-serif: Georgia, "Times New Roman", "Source Serif Pro", serif;
--font-sans:  Arial, Helvetica, "Inter", system-ui, sans-serif;
--font-mono:  ui-monospace, "SF Mono", Monaco, "Cascadia Code", monospace;
```

**Por que Georgia + Arial e não Inter/Playfair?**
Consistência com o e-mail e materiais já produzidos. Georgia tem legibilidade decorativa excelente em corpo e mantém personalidade editorial. Arial é o fallback web-safe sem network request. Se em V1 a equipe quiser modernizar, "Cormorant Garamond" (display) + "Inter" (body) é um upgrade que preserva o feel — mas não bloqueia agora.

### 3.2 Escala tipográfica

| Token | Família | Tamanho | Line-height | Peso | Letter-spacing | Uso |
|---|---|---|---|---|---|---|
| `display` | serif | 38px | 46px | 400 | -0.5px | Hero da página (nome do casal) |
| `h1` | serif | 36px | 44px | 400 | -0.5px | Título de página |
| `h2` | serif | 28px | 36px | 400 | -0.3px | Título de seção |
| `h3` | serif | 22px | 30px | 400 | -0.2px | Subtítulo, título de card |
| `body-lg` | sans | 17px | 28px | 400 | 0 | Lead paragraph, hero subtitle |
| `body` | sans | 15px | 26px | 400 | 0 | Texto padrão |
| `body-sm` | sans | 14px | 22px | 400 | 0 | Texto secundário, key-value `dd` |
| `caption` | sans | 12px | 18px | 400 | 0 | Metadados |
| `eyebrow` | sans | 10px | 16px | 500 | 4px | Eyebrow uppercase acima de H1/H2 |
| `label` | sans | 10px | 14px | 500 | 2px | Labels em uppercase |

**Mobile:** títulos reduzem ~20%:
- `display` mobile: 30px / 38px
- `h1` mobile: 30px / 38px
- `h2` mobile: 24px / 30px
- `h3` mobile: 20px / 28px

### 3.3 Itálico em accent — a assinatura

**A regra mais distintiva do DS.** Dentro de qualquer título serif, palavras-chave em **itálico** ganham cor `champagne-500`:

```html
<h1>Micaele e <em>Samuel</em></h1>
<h2>Onde será o <em>"sim"</em></h2>
<h2>O que <em>não pode faltar</em></h2>
```

```css
h1 em, h2 em, h3 em, .display em {
  color: var(--color-champagne-500);
  font-style: italic;
  font-weight: inherit; /* preserva o weight 400 do título */
}
```

**Quando aplicar:**
- 1 palavra ou frase curta por título (não o título inteiro)
- A palavra que carrega o significado emocional ou específico ("eternas", "noivos", "Punta Cana")
- Nunca em corpo de texto (lá `<em>` é só itálico neutro herdando cor)
- Nunca em labels ou caption

### 3.4 Eyebrow

Pequeno texto uppercase acima de títulos. Marca de seção fortíssima.

```html
<div class="eyebrow">— Destino e local —</div>
<h2>Onde será o <em>"sim"</em></h2>
```

```css
.eyebrow {
  font-family: var(--font-sans);
  font-size: 10px;
  line-height: 16px;
  font-weight: 500;
  color: var(--color-champagne-500);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
```

**Travessões em volta** (`— texto —`) são opcionais mas reforçam a marca. Use em eyebrows de seção principal; omita em eyebrows de subseção ou breadcrumb.

---

## 4. Espaçamento

Escala base de 4px (subset do Tailwind padrão, sem extensão).

| Token | px | rem | Uso |
|---|---|---|---|
| `space-0` | 0 | 0 | (zerar) |
| `space-1` | 4 | 0.25rem | Gap mínimo entre ícone e texto |
| `space-2` | 8 | 0.5rem | Gap padrão entre elementos próximos |
| `space-3` | 12 | 0.75rem | Padding interno pequeno |
| `space-4` | 16 | 1rem | Padding padrão de elemento |
| `space-5` | 20 | 1.25rem | (raro) |
| `space-6` | 24 | 1.5rem | Padding médio, gap entre cards |
| `space-8` | 32 | 2rem | Padding de seção |
| `space-10` | 40 | 2.5rem | Gap entre seções (admin) |
| `space-12` | 48 | 3rem | Gap entre seções (marketing) |
| `space-14` | 56 | 3.5rem | Major divider (marketing) |

**Regra de adaptação admin vs marketing:**
- Marketing usa 48-56px entre seções (luxo e leitura única).
- Admin usa 32-40px (densidade pra leitura repetida).
- Padding horizontal de containers: 32px desktop, 24px mobile.

---

## 5. Border-radius e elevações

### 5.1 Border-radius

| Token | px | Uso |
|---|---|---|
| `radius-none` | 0 | Dividers, linhas |
| `radius-sm` | 2 | **Botões, badges** — assinatura do e-mail |
| `radius-md` | 4 | Inputs, selects |
| `radius-lg` | 8 | Cards (raros — preferir borders) |
| `radius-full` | 9999 | Avatares circulares |

**A regra é simples:** quase tudo usa 2px. O DS não tem aquele visual "pílula bombada" típico de Tailwind. Refinamento.

### 5.2 Elevações (shadows)

Praticamente inexistentes. Use bordas em vez de sombras.

| Token | Valor | Uso |
|---|---|---|
| `shadow-none` | `none` | Default |
| `shadow-focus` | `0 0 0 3px rgba(184, 149, 106, 0.35)` | Focus ring em inputs (champagne 35%) |
| `shadow-card` | `0 1px 2px rgba(42, 24, 16, 0.06)` | Reservado para overlays e dropdowns. **Não usar em cards inline.** |

---

## 6. Componentes

Cada componente abaixo tem: descrição, exemplo HTML, classes Tailwind, e variantes quando aplicável.

### 6.1 `PageHeader`

Cabeçalho fixo no topo. Logo à esquerda, contexto no meio, ação à direita.

```tsx
<header className="bg-paper border-b border-sand-200 px-8 py-4.5 flex items-center justify-between">
  <div className="font-serif text-lg text-cocoa-900">
    Welcome <em className="italic text-champagne-500">Weddings</em>
  </div>
  <div className="text-[10px] tracking-[3px] text-cocoa-400 uppercase">
    Painel de Briefings
  </div>
  <button className="bg-cocoa-900 text-paper text-[10px] tracking-[2px] uppercase font-medium px-4.5 py-2.5 rounded-sm">
    Imprimir
  </button>
</header>
```

### 6.2 `SectionHeader`

Eyebrow + título grande. Marca o início de cada bloco temático.

```tsx
<header className="mb-6">
  <div className="eyebrow">— Destino e local —</div>
  <h2 className="font-serif font-normal text-[28px] leading-9 text-cocoa-900">
    Onde será o <em className="italic text-champagne-500">"sim"</em>
  </h2>
</header>
```

**Variantes:**
- `<SectionHeader level="page">` — `display` 38px, eyebrow vai pra cima
- `<SectionHeader level="section">` — `h2` 28px (padrão)
- `<SectionHeader level="subsection">` — `h3` 22px, sem eyebrow

### 6.3 `KeyValueList`

Estrutura `<dl>` com label uppercase à esquerda e valor à direita. **Componente mais usado do painel** (cada briefing tem dezenas).

```tsx
<dl className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-3.5">
  <dt className="text-[10px] tracking-[2px] uppercase text-cocoa-400 pt-1">
    Destino dos sonhos
  </dt>
  <dd className="text-sm leading-6 text-cocoa-800 m-0">
    Casamento na praia, "como nos filmes". Juntar família e amigos…
  </dd>

  <dt className="text-[10px] tracking-[2px] uppercase text-cocoa-400 pt-1">
    Já pesquisaram
  </dt>
  <dd className="text-sm leading-6 text-cocoa-800 m-0">
    Inicialmente Aruba e Curaçao…
  </dd>
</dl>
```

**Variantes:**
- `dense` — gap-y 2 (compacto, pra metadados rápidos)
- `comfortable` — gap-y 4 (padrão, pra leitura)
- `spacious` — gap-y 6 (pra valores longos com parágrafos)

**Estados:**
- Valor vazio (`null` ou `""`): renderizar `<dd>` com texto `—` em `cocoa-300`. Não esconder a linha — manter o esqueleto visível ajuda no scan.

### 6.4 `Badge`

Pílula pequena, geralmente pra metadados. Não confunde com botão — não tem hover, não é clicável.

```tsx
<span className="inline-block text-[10px] tracking-[1.5px] uppercase text-champagne-700 bg-champagne-100 px-2.5 py-1 rounded-sm">
  Punta Cana
</span>
```

**Variantes:**
- `accent` (padrão) — `champagne-100` bg, `champagne-700` text
- `neutral` — `sand-50` bg, `cocoa-700` text
- `success` — `moss-50` bg, `moss-700` text
- `warning` — `mustard-50` bg, `mustard-700` text
- `danger` — `terracotta-50` bg, `terracotta-700` text

### 6.5 `Button`

```tsx
// Primary (accent)
<button className="bg-champagne-500 hover:bg-champagne-600 text-paper text-xs tracking-[2px] uppercase font-bold px-7 h-[54px] rounded-sm transition-colors">
  Planejar
</button>

// Secondary (escuro)
<button className="bg-cocoa-900 hover:bg-cocoa-800 text-paper text-xs tracking-[2px] uppercase font-bold px-7 h-[54px] rounded-sm transition-colors">
  Imprimir
</button>

// Ghost (texto apenas)
<button className="text-champagne-700 hover:text-champagne-800 text-sm font-medium px-3 py-2 transition-colors">
  Cancelar
</button>
```

**Tamanhos:**
- `lg` — 54px height, 28px padding (CTA principal de página)
- `md` — 44px height, 20px padding (padrão de formulário)
- `sm` — 32px height, 12px padding (ações inline em listas/tabelas)

**Regras:**
- Botão primário usa `champagne` em ações afirmativas (Salvar, Confirmar)
- Botão secundário usa `cocoa-900` em ações neutras importantes (Imprimir, Voltar)
- Botão ghost pra ações terciárias (Cancelar, Limpar)
- Nunca dois botões `champagne` lado a lado — sempre primário + secundário/ghost

### 6.6 `PullQuote`

Quote destacado com border-left em accent. Útil pra respostas longas ou citações dos noivos.

```tsx
<blockquote className="font-serif italic text-base leading-7 text-cocoa-700 border-l-2 border-champagne-500 pl-5 py-1.5 my-5">
  "Queremos algo mais próximo aos filmes. Pool parties, coquetéis antes da cerimônia…"
</blockquote>
```

### 6.7 `StarList`

Lista com bullets em estrela `✦` na cor accent. Usado pra listas curtas (3-7 itens) onde o ornamento agrega.

```tsx
<ul className="list-none p-0 m-0 text-sm leading-[30px] text-cocoa-800 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:before:content-['✦'] [&>li]:before:text-champagne-500 [&>li]:before:text-xs">
  <li>Festa open bar</li>
  <li>Cerimônia simbólica linda</li>
  <li>Experiências para viver com os convidados</li>
</ul>
```

Não usar StarList pra listas longas (10+ itens) — vira poluição. Use lista padrão sem bullet ou checkboxes.

### 6.8 Dividers

#### `HairlineDivider`

Linha 1px em sand. Separador padrão entre seções.

```tsx
<hr className="border-0 border-t border-sand-200 my-9" />
```

#### `OrnamentDivider`

Três bullets centralizados em accent. Reservado pro **fim** de uma página ou seção fechada. Não usar entre seções (a hairline já cumpre).

```tsx
<div className="text-center text-champagne-500 tracking-[8px] font-serif text-[13px] py-6">
  • • •
</div>
```

### 6.9 `SidebarNav`

Navegação lateral com seções do briefing. Estado ativo em accent com border-left.

```tsx
<nav className="border-r border-sand-200 py-8 pl-6 pr-3">
  <div className="text-[9px] tracking-[3px] uppercase text-champagne-500 mb-3.5">
    Seções
  </div>
  <ul className="list-none p-0 m-0">
    {sections.map((s) => (
      <li key={s.id}>
        <a
          href={`#${s.id}`}
          className={cn(
            "block py-1.5 px-3 -ml-3 text-xs leading-[18px] border-l-2 border-transparent",
            s.id === active
              ? "text-cocoa-900 border-l-champagne-500 bg-sand-50 font-medium"
              : "text-cocoa-700 hover:text-cocoa-900"
          )}
        >
          {s.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

**Mobile:** sidebar vira accordion no topo da página. Não tentar replicar a sidebar vertical em telas <768px.

### 6.10 `EmptyState`

Quando uma seção do briefing tem todos os valores vazios (o casal não preencheu).

```tsx
<div className="text-cocoa-400 text-sm italic py-4">
  Nenhuma resposta nesta seção.
</div>
```

Não usar ilustração nem CTA. Simplicidade > marketing.

---

## 7. Acessibilidade

### 7.1 Contraste

Pares verificados em AA (4.5:1 para texto normal, 3:1 para large ≥18px ou bold ≥14px):

| Foreground | Background | Ratio | Resultado |
|---|---|---|---|
| `cocoa-800` (`#3A3027`) | `paper` (`#FFFFFF`) | 11.5:1 | ✓ AAA |
| `cocoa-800` | `sand-100` (`#F4EFE6`) | 10.1:1 | ✓ AAA |
| `cocoa-700` (`#4A3F33`) | `paper` | 8.6:1 | ✓ AAA |
| `cocoa-400` (`#9A8C77`) | `paper` | 3.4:1 | ⚠ AA Large apenas |
| `champagne-500` (`#B8956A`) | `paper` | 3.3:1 | ⚠ AA Large apenas |
| `champagne-700` (`#7B603E`) | `paper` | 5.5:1 | ✓ AA |
| `champagne-800` (`#5B452B`) | `champagne-100` | 7.2:1 | ✓ AAA |

**Implicações:**
- `champagne-500` no itálico de títulos: OK (sempre 22px+, AA Large).
- `champagne-500` em texto de corpo (links, badges pequenos): **trocar por `champagne-700`**.
- `cocoa-400` só em metadados grandes (caption, eyebrow). Pra texto corrido, use `cocoa-500` ou mais escuro.
- Eyebrow em `champagne-500` é OK porque tem `font-weight: 500` e contagem AA Large.

### 7.2 Outros

- **Focus visível obrigatório.** Use `shadow-focus` em todos os elementos focáveis. Não use `outline: none` sem substituir.
- **Skip-to-content link** no topo de cada página, hidden até focado.
- **Hierarquia de heading correta.** `h1` único por página, `h2` para seções, `h3` para subseções. Não pular níveis pra estética.
- **`<em>` é semântico.** Estilizamos com cor, mas o screen reader vai dar ênfase. Está correto.
- **Eyebrow não é heading.** Use `<div>` ou `<span>`, não `<h6>`.
- **Sidebar nav usa `<nav aria-label="…">`** e os items são `<a>`, não `<button>`.

---

## 8. Print CSS

Print é cidadão de primeira classe — o time vai imprimir briefings com frequência. Tratar como caminho feliz.

### 8.1 Princípios

1. Esconder navegação (sidebar, header de app, botões de ação).
2. Mostrar header de print (logo + nome do casal + data de geração).
3. Manter Georgia + Arial.
4. Manter itálicos em accent (impressoras coloridas) com fallback escuro (B&W).
5. Layout em coluna única.
6. Evitar quebra dentro de seção.
7. Mostrar URL/footer de geração no rodapé.

### 8.2 CSS

```css
@media print {
  /* Forçar paleta em impressoras coloridas */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Página A4 com margens generosas */
  @page {
    size: A4;
    margin: 1.5cm 1.5cm 2cm 1.5cm;

    @bottom-center {
      content: "Página " counter(page) " de " counter(pages);
      font-family: Arial, sans-serif;
      font-size: 9px;
      color: #9A8C77;
    }
  }

  /* Esconder UI */
  .ww-sidebar,
  .ww-page-header,
  .ww-print-btn,
  .ww-mobile-nav,
  .ww-search,
  nav[aria-label="Seções do briefing"] {
    display: none !important;
  }

  /* Header de print (renderizar com .print-only no DOM, hidden em screen) */
  .print-only { display: block !important; }
  .screen-only { display: none !important; }

  /* Body em coluna única */
  .ww-body {
    display: block !important;
  }

  /* Tipografia legível pra impressão */
  body {
    background: white !important;
    color: #2A1810 !important;
    font-size: 11pt;
    line-height: 1.6;
  }

  h1 { font-size: 22pt; }
  h2 { font-size: 16pt; margin-top: 18pt; }
  h3 { font-size: 13pt; }

  /* Manter itálico em accent */
  h1 em, h2 em, h3 em {
    color: #7B603E; /* champagne-700, melhor leitura em B&W */
  }

  /* Evitar quebra dentro de seções */
  section, .ww-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  h2, h3 {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* KV list — manter pares juntos */
  dl > dt, dl > dd {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Links: mostrar URL em parênteses (opcional, decidir caso a caso) */
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    color: #9A8C77;
  }

  /* Ornamentos opcionais — manter os "• • •" mas em cinza */
  .ww-ornament {
    color: #9A8C77 !important;
  }
}
```

### 8.3 Header de print

Componente que aparece **só no print**:

```tsx
<div className="print-only hidden">
  <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-6">
    <div className="font-serif text-base text-cocoa-900">
      Welcome <em className="italic text-champagne-700">Weddings</em>
    </div>
    <div className="text-[10px] tracking-[2px] uppercase text-cocoa-400">
      Briefing — {couple.name} — {formatDate(new Date())}
    </div>
  </div>
</div>
```

E no CSS global:
```css
.print-only { display: none; }
@media print {
  .print-only { display: block; }
}
```

---

## 9. Tailwind config

### 9.1 `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Escalas primárias
        champagne: {
          50:  "#FBF8F3",
          100: "#F4EAD5",
          200: "#E8D2A8",
          300: "#D7B584",
          400: "#C8A576",
          500: "#B8956A",
          600: "#9B7B53",
          700: "#7B603E",
          800: "#5B452B",
          900: "#3D2D1B",
        },
        cocoa: {
          50:  "#F5F2EE",
          100: "#E5DDD3",
          200: "#C8BAA6",
          300: "#A89678",
          400: "#9A8C77",
          500: "#6F5F4C",
          600: "#5C4D3D",
          700: "#4A3F33",
          800: "#3A3027",
          900: "#2A1810",
        },
        sand: {
          50:  "#FAF6F0",
          100: "#F4EFE6",
          200: "#E8DFD3",
          300: "#D9CCB9",
          400: "#C2B197",
          500: "#A89578",
        },
        paper: "#FFFFFF",
        ink:   "#1A0F08",

        // Feedback
        moss: {
          50:  "#F1F4ED",
          100: "#DEE4D2",
          500: "#6B7A4A",
          700: "#4A5532",
          900: "#2D3520",
        },
        terracotta: {
          50:  "#F8EDE6",
          100: "#EDD2BC",
          500: "#B2604A",
          700: "#804330",
          900: "#5A2E20",
        },
        mustard: {
          50:  "#FAF4DC",
          100: "#F0E1A8",
          500: "#C99F2E",
          700: "#8E6F1A",
          900: "#5A4710",
        },
      },

      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', '"Source Serif Pro"', 'serif'],
        sans:  ['Arial', 'Helvetica', '"Inter"', 'system-ui', 'sans-serif'],
        mono:  ['ui-monospace', '"SF Mono"', 'Monaco', '"Cascadia Code"', 'monospace'],
      },

      fontSize: {
        // Editorial
        display:  ['38px', { lineHeight: '46px', letterSpacing: '-0.5px' }],
        h1:       ['36px', { lineHeight: '44px', letterSpacing: '-0.5px' }],
        h2:       ['28px', { lineHeight: '36px', letterSpacing: '-0.3px' }],
        h3:       ['22px', { lineHeight: '30px', letterSpacing: '-0.2px' }],
        'body-lg':['17px', { lineHeight: '28px' }],
        body:     ['15px', { lineHeight: '26px' }],
        'body-sm':['14px', { lineHeight: '22px' }],
        caption:  ['12px', { lineHeight: '18px' }],
        eyebrow:  ['10px', { lineHeight: '16px', letterSpacing: '4px' }],
        label:    ['10px', { lineHeight: '14px', letterSpacing: '2px' }],
      },

      borderRadius: {
        none: '0',
        sm:   '2px',
        md:   '4px',
        lg:   '8px',
        full: '9999px',
      },

      boxShadow: {
        none:    'none',
        focus:   '0 0 0 3px rgba(184, 149, 106, 0.35)',
        card:    '0 1px 2px rgba(42, 24, 16, 0.06)',
      },

      letterSpacing: {
        tightest: '-0.5px',
        tighter:  '-0.3px',
        tight:    '-0.2px',
        normal:   '0',
        wide:     '1px',
        wider:    '2px',
        widest:   '4px',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 9.2 `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* CSS vars — espelhar tokens semânticos pra uso fora do Tailwind */
    --color-bg-canvas:    #F4EFE6;
    --color-bg-paper:     #FFFFFF;
    --color-bg-elevated:  #FAF6F0;

    --color-text-primary:    #3A3027;
    --color-text-heading:    #2A1810;
    --color-text-secondary:  #4A3F33;
    --color-text-muted:      #9A8C77;
    --color-text-accent:     #B8956A;
    --color-text-accent-body:#7B603E;

    --color-border-hairline: #E8DFD3;
    --color-border-subtle:   #E5DDD3;
    --color-border-accent:   #B8956A;
  }

  html, body {
    background-color: var(--color-bg-canvas);
    color: var(--color-text-primary);
    font-family: Arial, Helvetica, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Itálico em accent dentro de títulos */
  h1 em, h2 em, h3 em, .display em {
    color: var(--color-text-accent);
    font-style: italic;
    font-weight: inherit;
  }

  /* Focus ring padrão */
  *:focus-visible {
    outline: none;
    box-shadow: var(--ww-focus-ring, 0 0 0 3px rgba(184, 149, 106, 0.35));
  }
}

@layer components {
  .eyebrow {
    @apply font-sans text-eyebrow font-medium text-champagne-500 uppercase;
    margin-bottom: 14px;
  }

  .ww-display {
    @apply font-serif font-normal text-display text-cocoa-900;
  }

  .ww-h1 {
    @apply font-serif font-normal text-h1 text-cocoa-900;
  }

  .ww-h2 {
    @apply font-serif font-normal text-h2 text-cocoa-900;
  }

  .ww-h3 {
    @apply font-serif font-normal text-h3 text-cocoa-900;
  }

  .ww-prose {
    @apply font-sans text-body text-cocoa-800;
  }

  .ww-divider-hairline {
    @apply border-0 border-t border-sand-200 my-9;
  }

  .ww-divider-ornament {
    @apply text-center text-champagne-500 font-serif py-6;
    letter-spacing: 8px;
    font-size: 13px;
  }
  .ww-divider-ornament::before {
    content: "• • •";
  }
}

/* Print CSS — ver seção 8 acima */
@media print {
  /* … (regras completas da seção 8.2) */
}
```

---

## 10. Antipadrões

Lista do que **não fazer** pra não cair em "dashboard genérico" e perder a identidade.

❌ **Border-radius >4px em botões e badges.** Vira pílula bombada, perde refinamento.
❌ **Sombras dramáticas em cards.** O DS é flat com bordas. Sombra só em overlays.
❌ **Verde-bandeira em sucesso, vermelho-bombeiro em erro.** Usar `moss` e `terracotta` da paleta.
❌ **Azul de link convencional.** Links usam `champagne-700`. Sem azul.
❌ **Fontes "modernas" em títulos** (Geist, Plus Jakarta, Outfit). Georgia é a marca. Não trocar sem aprovação.
❌ **Bold pesado (700+).** Tipografia decorativa não precisa de peso. Usar 400-500.
❌ **Itálico genérico no corpo.** `<em>` no corpo é só ênfase neutra (herda cor). Itálico em accent é só em títulos.
❌ **Densidade de SaaS.** Linhas de 14px com line-height 16. Manter 22-26.
❌ **Eyebrow sem letter-spacing.** 3-4px de tracking é o que faz a marca. Sem tracking = label genérico.
❌ **Centralização aleatória.** Hero centralizado é ok; corpo de texto é sempre alinhado à esquerda.
❌ **Cards com background `paper` e sombra.** Use border `sand-200` em vez. Cards do DS não levitam.
❌ **Cores fora da paleta.** Não inventar hex no código. Se o token não existe, adicionar ao DS antes.
❌ **CTA primário em `cocoa-900` (preto).** Primário é sempre `champagne-500`. Secundário é `cocoa-900`. Não inverter.
❌ **`text-transform: uppercase` em texto longo.** Uppercase é só pra eyebrow, label, badge — sempre curto.
❌ **Misturar weights na mesma frase.** Frase começa em 400, palavra-chave em 500. Pular pra 700 quebra ritmo.
❌ **Ícones decorativos coloridos.** Ícones herdam cor do contexto (texto). Sem ícone "azul" ou "verde" — segue a paleta.

---

## 11. Versão e evolução

### 11.1 Roadmap V1

Quando expandir além do MVP, priorizar nesta ordem:

1. **Componentes de formulário** — Input, Select, Textarea, Checkbox, Radio, DatePicker
2. **Componentes de feedback** — Toast, Alert, Modal, Tooltip
3. **Componentes de dados** — Table, Pagination, Filter, SearchBar
4. **Estados** — Loading, Empty, Error (com ilustrações próprias da marca)
5. **Motion** — transições padrão (200ms ease-out), entrada de página, hover states
6. **Dark mode** — provavelmente não necessário pra admin. Validar antes.

### 11.2 Versionamento

- `0.1` — MVP destilado do e-mail (esta versão)
- `0.2` — Primeiros componentes do painel implementados e validados em produção
- `1.0` — Cobertura completa V1, validação cross-projeto

### 11.3 Onde questionar

Quando uma decisão de design surgir e você não souber se está dentro do DS:

1. Cabe num dos 4 princípios da Seção 1? → siga.
2. Existe componente análogo aqui? → reuse a forma, varie o conteúdo.
3. Cor fora da paleta? → não invente, abra issue/conversa.
4. Tipografia fora da escala? → não invente, abra issue/conversa.
5. Border-radius >4px? → quase certeza que está errado.

---

**Fim.**
