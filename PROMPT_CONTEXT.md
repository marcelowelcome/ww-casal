# PROMPT_CONTEXT — Painel de Briefings Welcome Weddings

> Documento de **contexto de domínio**. Lido antes de qualquer sessão de vibecoding pra que o agente entenda o que está construindo, pra quem, e por quê. Não contém decisões técnicas — essas estão em `ARCHITECTURE.md`. Não contém regras de execução — essas estão em `AGENT_INSTRUCTIONS.md`.

---

## 1. O negócio

**Welcome Weddings** é uma assessoria de destination weddings com sede em Curitiba, parte do Welcome Group (que inclui Welcome Trips, WelConnect, Welcome Corp e Weex). Produz casamentos no Caribe, México, Europa e em vinícolas no Brasil. Premiada por cinco anos consecutivos como melhor produtora de destination wedding da América Latina. Mais de 650 casamentos produzidos em 20+ países.

A operação tem três pernas: **comercial** (SDR → Closer, que vende a assessoria), **planejamento** (que conduz o casal do "sim ao contrato" até o "sim no altar"), e **produção** (que executa no destino).

Esse projeto serve a perna do **planejamento e produção**.

## 2. O problema

Quando um casal assina o contrato com a Welcome Weddings, ele preenche um formulário Typeform de onboarding com ~60 perguntas. As respostas vão automaticamente pra uma planilha Google Sheets compartilhada. Essa planilha é a **única fonte de verdade sobre o briefing** do casal.

Trabalhar em planilha é doloroso. A cada conversa interna, reunião com fornecedor, ou decisão sobre o casamento, alguém precisa abrir uma planilha de 60+ colunas, encontrar a linha do casal, e tentar ler valores comprimidos em células minúsculas. Algumas respostas têm parágrafos inteiros de texto — quase ilegíveis no contexto de planilha.

O time precisa de uma **interface de consulta**. Não uma ferramenta de gestão — não pra editar dados, agendar reuniões ou criar tarefas. Só pra **ler o briefing rápido e bem**.

## 3. O projeto

**Painel de Briefings** (codename interno: **DashBriefings**) é um web app interno que lê a planilha do Typeform e renderiza cada briefing como uma página editorial — organizada por seções, legível em desktop e mobile, otimizada pra impressão em PDF, e protegida por autenticação corporativa.

Inclui também uma página agregada que mostra tendências entre todos os casais (destinos mais escolhidos, faixas de orçamento, perfil de viagem, etc) — útil pra reuniões de planejamento e identificação de padrões.

### O que é, e o que não é

| É | Não é |
|---|---|
| Camada de leitura sobre o Sheets | Sistema de gestão |
| Acessível pelo time interno (~5-15 pessoas) | Acessível por casais ou público |
| Sincronizado periodicamente com o Sheets | Editor de briefings |
| Otimizado pra leitura, busca e impressão | Plataforma de comunicação |
| Visualização de tendências agregadas | BI ou ferramenta analítica complexa |

### Sucesso parece com

- O time abre o painel em vez da planilha em 100% das consultas de briefing depois de 30 dias do lançamento.
- Reuniões com casais e fornecedores começam com o painel na tela, não com a planilha.
- Impressão de briefing pra reuniões offline é fluida (1 clique, PDF limpo).
- A página agregada gera 2-3 insights úteis no primeiro trimestre.

## 4. Os usuários

**Time interno da Welcome Weddings.** Cerimonialistas, assessoria de planejamento, produção, eventualmente comercial.

**Padrão de uso:**
- **Consulta intensa por casal sob gestão.** Quem está conduzindo um casamento abre o briefing dele várias vezes por semana.
- **Consulta esporádica entre casais.** Quem não está envolvido diretamente pode precisar consultar pra dar opinião ou tomar decisão.
- **Consulta agregada em planejamento.** Reuniões de equipe podem usar a página de tendências.
- **Impressão em momentos offline.** Reunião com fornecedor que prefere papel, viagem onde não tem internet, etc.

**O que esses usuários não são:**
- Não são analistas de dados. Não esperam filtros complexos.
- Não são desenvolvedores. Esperam que tudo funcione sem treinamento.
- Não são casais. O conteúdo é informação operacional, não material aspiracional.

## 5. O briefing — estrutura

Cada formulário preenchido vira uma linha na planilha. Cada linha tem ~60 colunas. As perguntas se agrupam naturalmente em 17 seções temáticas:

1. **Identificação** — nome, sobrenome, e-mail dos dois noivos (4-6 campos)
2. **Por que Welcome** — motivos da escolha, indicação, texto livre
3. **Destino e local** — destino dos sonhos, lugares já pesquisados, gostaram/não gostaram
4. **Data e período** — data específica ou período/ano de preferência
5. **Casamento civil** — já são casados, data, antes/durante/depois da viagem
6. **Filhos** — se têm, nomes, idades, particularidades
7. **Tipo e formato de cerimônia** — casamento ou renovação, simbólica ou religiosa
8. **Motivações e história** — o que atraiu, maior desafio, história do casal (texto longo)
9. **Expectativas** — expectativas pro destination, as 3 coisas que não podem faltar
10. **Perfil de viagem** — tipos de experiência, viagens marcantes, experiências especiais
11. **Hotel** — perfil de hospedagem, o que valorizam, hotéis bons/ruins
12. **Convidados** — perfil, investimento ideal, dias ideais, experiências pra eles, número, menores de 18
13. **Documentos** — Instagram, passaporte BR (validade), outras cidadanias, visto americano (de cada um)
14. **Convites e identidade visual** — convites impressos, identidade visual pronta, welcome gifts, dress code
15. **Padrinhos e paleta** — vão ter, quantos, paleta de cor
16. **Fornecedores e trajes** — levar do BR, fornecedores contratados, indicação de loja de vestido/traje
17. **Celebrante, música, decoração, bebidas, orçamento, observações finais**

Cada seção é renderizada como um bloco no painel, com seu próprio eyebrow + título + key-value pairs ou parágrafos.

## 6. Identificadores e estabilidade

- **`BP` (coluna)** — `token` único da resposta do Typeform. É o **slug definitivo** da URL: `/casais/{token}`. Não muda quando a planilha é reordenada. **Sempre usar esse token como identificador**.
- **`BO` (coluna)** — `submitted_at`, timestamp do preenchimento.
- Nome e e-mail **não são identificadores estáveis**. Servem só pra display.

## 7. Sensibilidades de domínio

Pontos que ficam fora do óbvio mas afetam o produto:

### 7.1 Dados pessoais sensíveis no briefing

Os briefings contêm:
- Nomes completos e e-mails dos noivos
- Orçamentos de centenas de milhares de reais
- Datas de validade de passaporte e visto
- Usuários de Instagram
- Histórias pessoais (separações, perdas, particularidades familiares)
- Detalhes de filhos (nomes, idades)

**Implicações:**
- Auth corporativa é **não-negociável**.
- Painel é **`noindex` + robots.txt blocking** em todas as rotas, mesmo as protegidas.
- Nada de PII em logs ou URLs.
- Nada de envio dessas informações pra terceiros (analytics, error tracking) sem revisão.

### 7.2 Linguagem de marca Welcome Weddings

Termos **proibidos** na interface:
- ❌ "noivos" — usar "casal", "Camille e Pedro", ou nome próprio
- ❌ diminutivos ("noivinhos", "padrinhozinho", etc)
- ❌ "mimo" — não usar
- ❌ "ajuda", "ajudar" — usar "apoio", "conduzir", "produzir"

Esses termos vão **aparecer** no conteúdo da planilha porque vêm de respostas dos próprios casais — não vamos editar isso. Mas **nas labels do app, em copy criada pelo time, em mensagens de erro, etc, evitar**.

### 7.3 Restrições editoriais herdadas de outros projetos da Welcome Group

- Em conteúdo de Welcome Trips, **Club Med** é proibido. Não se aplica diretamente aqui (esse é projeto da Welcome Weddings), mas vale conhecer porque pode aparecer em respostas de casais.
- Nunca associar hotéis a marcas anteriores ou competitivas no display.

## 8. Glossário

**Destination Wedding (DW)** — casamento realizado fora da cidade de residência do casal, geralmente em destino paradisíaco, com convidados viajando pra ele.

**Assessoria** — serviço de planejamento e produção completa que a Welcome Weddings oferece. Não é "wedding planner solo" — é equipe.

**Briefing** — neste projeto, refere-se ao questionário Typeform respondido pelo casal pós-contrato. Em outros contextos da empresa, pode significar reunião de alinhamento.

**Casal** — o par que está se casando. Termo preferido a "noivos".

**Cerimônia simbólica** — sem efeito legal, só ritual. Cerimônia religiosa tem efeito conforme a religião e o país.

**SDR** — Sales Development Representative. Pré-venda. Quem qualifica o lead antes de passar pro Closer.

**Closer** — vendedor que fecha o contrato.

**Welcome Trips** — empresa irmã que cuida da logística de viagem dos convidados e lua de mel. Pode aparecer referenciada em briefings.

**WelConnect, Welcome Corp, Weex** — outras empresas do grupo. Não relevantes pra esse projeto.

**SPICED** — metodologia de discovery comercial em uso no time. Não relevante pra esse projeto.

**ICP** — Ideal Customer Profile. Não relevante pra esse projeto.

**Vibecoding** — método de desenvolvimento da casa: agente de IA + VS Code + documentos estruturados de contexto. Esse documento faz parte desse método.

## 9. Conexões com outros projetos do ecossistema Welcome

Esse projeto **lê** da mesma planilha que pode futuramente ser lida por outros projetos do grupo. Não escreve. Não modifica.

Outros projetos relevantes (sem dependência direta, só pra contexto):
- **DashIG** — Instagram analytics do @welcomeweddings, em `mkt-insta.vercel.app`
- **DashWW** — KPIs de vendas do funil SDR/Closer, em `weddings-kpi.vercel.app`
- **Auth Hub** — projeto Supabase centralizado (`ypzpkdgdbzruagjixwyc.supabase.co`) que esse painel reutiliza pra auth com SSO Microsoft

## 10. O que esse contexto deve mudar nas decisões

Esse documento existe pra calibrar julgamento. Quando uma decisão de implementação surgir e você tiver dúvida, volte aqui e pergunte:

- **Esse comportamento facilita a leitura ou complica?** Se complica, errado.
- **Esse texto soa como Welcome Weddings ou como produto SaaS?** Se SaaS, refazer.
- **Esse dado é sensível? Vai pra log, URL, terceiro?** Se sim, repensar.
- **Esse padrão visual reforça a identidade ou é genérico de dashboard?** Se genérico, voltar pro DS.
- **Esse caso de uso aparece num cenário de impressão?** Se aparece, testar print.

---

**Fim.**
