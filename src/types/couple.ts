import { z } from 'zod';

const StringNull = z.string().nullable();
const BoolNull = z.boolean().nullable();

export const CoupleSchema = z.object({
  id: z.string(),
  // ISO string, não Date — Next.js serializa props ao passar de Server→Client
  // Components, e Date vira string nesse trajeto. Mantemos como string desde a
  // borda pra evitar pegadinhas de runtime.
  submitted_at: z.string().nullable(),

  identificacao: z.object({
    noivo_1: z.object({
      nome: StringNull,
      sobrenome: StringNull,
      email: StringNull,
    }),
    noivo_2: z.object({
      nome: StringNull,
      sobrenome: StringNull,
      email: StringNull,
    }),
  }),

  por_que_welcome: z.object({
    motivos: z.array(z.string()),
    indicacao: StringNull,
    texto: StringNull,
  }),

  destino: z.object({
    sonhos: StringNull,
    pesquisaram: StringNull,
    gostaram: StringNull,
    nao_gostaram: StringNull,
  }),

  data: z.object({
    tem_especifica: BoolNull,
    especifica: StringNull,
    periodo: StringNull,
  }),

  casamento_civil: z.object({
    ja_casados: BoolNull,
    data: StringNull,
    relacao_viagem: StringNull,
  }),

  filhos: z.object({
    tem: BoolNull,
    descricao: StringNull,
  }),

  cerimonia: z.object({
    tipo: StringNull,
    renovacao_texto: StringNull,
    formato: StringNull,
    religiao: StringNull,
  }),

  historia: z.object({
    atrai: StringNull,
    desafio: StringNull,
    casal: StringNull,
  }),

  expectativas: z.object({
    destination: StringNull,
    imprescindiveis: StringNull,
  }),

  viagem: z.object({
    perfil: StringNull,
    ja_viajaram: BoolNull,
    marcante: StringNull,
    experiencia_especial: StringNull,
  }),

  hotel: z.object({
    perfil: StringNull,
    valorizam_e_referencias: StringNull,
  }),

  convidados: z.object({
    perfil: StringNull,
    investimento_ideal: StringNull,
    dias_ideais: StringNull,
    experiencias: StringNull,
    numero: z.number().nullable(),
    menores_18: StringNull,
  }),

  documentos: z.object({
    noivo_1: z.object({
      instagram: StringNull,
      passaporte: StringNull,
      outras_cidadanias: StringNull,
      visto_americano: StringNull,
    }),
    noivo_2: z.object({
      instagram: StringNull,
      passaporte: StringNull,
      outras_cidadanias: StringNull,
      visto_americano: StringNull,
    }),
  }),

  convites: z.object({
    impressos: BoolNull,
    identidade_visual_pronta: BoolNull,
    welcome_gifts: StringNull,
    dress_code: StringNull,
  }),

  padrinhos: z.object({
    terao_e_quantidade: StringNull,
    paleta: StringNull,
  }),

  fornecedores: z.object({
    levar_br: StringNull,
    contratados_br: StringNull,
    loja_noivo_1: StringNull,
    loja_noivo_2: StringNull,
  }),

  producao: z.object({
    celebrante: StringNull,
    musica: StringNull,
    decoracao: StringNull,
    bebidas: StringNull,
    orcamento: StringNull,
    observacoes_finais: StringNull,
  }),
});

export type Couple = z.infer<typeof CoupleSchema>;

/**
 * Definição declarativa das 17 seções, na ordem canônica de exibição.
 * UI (sidebar + body) renderiza a partir desta lista.
 */
export const BRIEFING_SECTIONS = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'por_que_welcome', label: 'Por que Welcome' },
  { id: 'destino', label: 'Destino e local' },
  { id: 'data', label: 'Data e período' },
  { id: 'casamento_civil', label: 'Casamento civil' },
  { id: 'filhos', label: 'Filhos' },
  { id: 'cerimonia', label: 'Tipo e formato' },
  { id: 'historia', label: 'Motivações e história' },
  { id: 'expectativas', label: 'Expectativas' },
  { id: 'viagem', label: 'Perfil de viagem' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'convidados', label: 'Convidados' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'convites', label: 'Convites e identidade' },
  { id: 'padrinhos', label: 'Padrinhos e paleta' },
  { id: 'fornecedores', label: 'Fornecedores e trajes' },
  { id: 'producao', label: 'Produção e observações' },
] as const;

export type BriefingSectionId = (typeof BRIEFING_SECTIONS)[number]['id'];
