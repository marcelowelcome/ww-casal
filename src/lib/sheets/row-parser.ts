import { COLUMN_INDEX } from './schema';
import {
  parseBoolean,
  parseMultiSelect,
  parseNumber,
  parseString,
  parseSubmittedAt,
} from './parser';
import { CoupleSchema, type Couple } from '@/types/couple';

export function parseCoupleRow(row: string[]): Couple {
  const get = (idx: number) => row[idx] ?? '';

  const data: Couple = {
    id: get(COLUMN_INDEX.token),
    submitted_at: parseSubmittedAt(get(COLUMN_INDEX.submitted_at)),

    identificacao: {
      noivo_1: {
        nome: parseString(get(COLUMN_INDEX.noivo_1_nome)),
        sobrenome: parseString(get(COLUMN_INDEX.noivo_1_sobrenome)),
        email: parseString(get(COLUMN_INDEX.noivo_1_email)),
      },
      noivo_2: {
        nome: parseString(get(COLUMN_INDEX.noivo_2_nome)),
        sobrenome: parseString(get(COLUMN_INDEX.noivo_2_sobrenome)),
        email: parseString(get(COLUMN_INDEX.noivo_2_email)),
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

    data: {
      tem_especifica: parseBoolean(get(COLUMN_INDEX.data_tem_especifica)),
      especifica: parseString(get(COLUMN_INDEX.data_especifica)),
      periodo: parseString(get(COLUMN_INDEX.data_periodo)),
    },

    casamento_civil: {
      ja_casados: parseBoolean(get(COLUMN_INDEX.civil_ja_casados)),
      data: parseString(get(COLUMN_INDEX.civil_data)),
      relacao_viagem: parseString(get(COLUMN_INDEX.civil_relacao_viagem)),
    },

    filhos: {
      tem: parseBoolean(get(COLUMN_INDEX.filhos_tem)),
      descricao: parseString(get(COLUMN_INDEX.filhos_descricao)),
    },

    cerimonia: {
      tipo: parseString(get(COLUMN_INDEX.cerimonia_tipo)),
      renovacao_texto: parseString(get(COLUMN_INDEX.cerimonia_renovacao_texto)),
      formato: parseString(get(COLUMN_INDEX.cerimonia_formato)),
      religiao: parseString(get(COLUMN_INDEX.cerimonia_religiao)),
    },

    historia: {
      atrai: parseString(get(COLUMN_INDEX.historia_atrai)),
      desafio: parseString(get(COLUMN_INDEX.historia_desafio)),
      casal: parseString(get(COLUMN_INDEX.historia_casal)),
    },

    expectativas: {
      destination: parseString(get(COLUMN_INDEX.expectativas_destination)),
      imprescindiveis: parseString(get(COLUMN_INDEX.expectativas_imprescindiveis)),
    },

    viagem: {
      perfil: parseString(get(COLUMN_INDEX.viagem_perfil)),
      ja_viajaram: parseBoolean(get(COLUMN_INDEX.viagem_ja_viajaram)),
      marcante: parseString(get(COLUMN_INDEX.viagem_marcante)),
      experiencia_especial: parseString(get(COLUMN_INDEX.viagem_experiencia_especial)),
    },

    hotel: {
      perfil: parseString(get(COLUMN_INDEX.hotel_perfil)),
      valorizam_e_referencias: parseString(get(COLUMN_INDEX.hotel_valorizam_e_referencias)),
    },

    convidados: {
      perfil: parseString(get(COLUMN_INDEX.convidados_perfil)),
      investimento_ideal: parseString(get(COLUMN_INDEX.convidados_investimento_ideal)),
      dias_ideais: parseString(get(COLUMN_INDEX.convidados_dias_ideais)),
      experiencias: parseString(get(COLUMN_INDEX.convidados_experiencias)),
      numero: parseNumber(get(COLUMN_INDEX.convidados_numero)),
      menores_18: parseString(get(COLUMN_INDEX.convidados_menores_18)),
    },

    documentos: {
      noivo_1: {
        instagram: parseString(get(COLUMN_INDEX.noivo_1_instagram)),
        passaporte: parseString(get(COLUMN_INDEX.noivo_1_passaporte)),
        outras_cidadanias: parseString(get(COLUMN_INDEX.noivo_1_outras_cidadanias)),
        visto_americano: parseString(get(COLUMN_INDEX.noivo_1_visto_americano)),
      },
      noivo_2: {
        instagram: parseString(get(COLUMN_INDEX.noivo_2_instagram)),
        passaporte: parseString(get(COLUMN_INDEX.noivo_2_passaporte)),
        outras_cidadanias: parseString(get(COLUMN_INDEX.noivo_2_outras_cidadanias)),
        visto_americano: parseString(get(COLUMN_INDEX.noivo_2_visto_americano)),
      },
    },

    convites: {
      impressos: parseBoolean(get(COLUMN_INDEX.convites_impressos)),
      identidade_visual_pronta: parseBoolean(get(COLUMN_INDEX.identidade_visual_pronta)),
      welcome_gifts: parseString(get(COLUMN_INDEX.welcome_gifts)),
      dress_code: parseString(get(COLUMN_INDEX.dress_code)),
    },

    padrinhos: {
      terao_e_quantidade: parseString(get(COLUMN_INDEX.padrinhos_terao_e_quantidade)),
      paleta: parseString(get(COLUMN_INDEX.padrinhos_paleta)),
    },

    fornecedores: {
      levar_br: parseString(get(COLUMN_INDEX.fornecedores_levar_br)),
      contratados_br: parseString(get(COLUMN_INDEX.fornecedores_contratados_br)),
      loja_noivo_1: parseString(get(COLUMN_INDEX.trajes_loja_noivo_1)),
      loja_noivo_2: parseString(get(COLUMN_INDEX.trajes_loja_noivo_2)),
    },

    producao: {
      celebrante: parseString(get(COLUMN_INDEX.producao_celebrante)),
      musica: parseString(get(COLUMN_INDEX.producao_musica)),
      decoracao: parseString(get(COLUMN_INDEX.producao_decoracao)),
      bebidas: parseString(get(COLUMN_INDEX.producao_bebidas)),
      orcamento: parseString(get(COLUMN_INDEX.producao_orcamento)),
      observacoes_finais: parseString(get(COLUMN_INDEX.producao_observacoes_finais)),
    },
  };

  return CoupleSchema.parse(data);
}
