/**
 * Mapeamento coluna → índice posicional da aba "Questionário do casal".
 * Range: A:BP (68 colunas, validado em 2026-05-27 contra a planilha real).
 *
 * Nomenclatura: usamos "noivo_1" e "noivo_2" porque o Typeform não impõe
 * gênero nem ordem fixa para quem responde primeiro. Convenção: noivo_1 são
 * as colunas A-C, noivo_2 são D-F (e o mesmo padrão se repete nos documentos).
 *
 * Se o Typeform mudar (nova pergunta, reordenação), este é o ÚNICO arquivo que precisa mudar
 * para que parser + UI permaneçam corretos. Atualize aqui e estenda o Zod em src/types/couple.ts.
 */
export const COLUMN_INDEX = {
  // 1. Identificação (A-F)
  noivo_1_nome: 0,
  noivo_1_sobrenome: 1,
  noivo_1_email: 2,
  noivo_2_nome: 3,
  noivo_2_sobrenome: 4,
  noivo_2_email: 5,

  // 2. Por que Welcome (G-I)
  welcome_motivos: 6,
  welcome_indicacao: 7,
  welcome_texto: 8,

  // 3. Destino e local (J-M)
  destino_sonhos: 9,
  destino_pesquisaram: 10,
  destino_gostaram: 11,
  destino_nao_gostaram: 12,

  // 4. Data e período (N-P)
  data_tem_especifica: 13, // booleano
  data_especifica: 14,
  data_periodo: 15,

  // 5. Casamento civil (Q-S)
  civil_ja_casados: 16, // booleano
  civil_data: 17,
  civil_relacao_viagem: 18, // antes/durante/depois

  // 6. Filhos (T-U)
  filhos_tem: 19, // booleano
  filhos_descricao: 20, // nomes, idades, particularidades — tudo em um campo

  // 7. Cerimônia (V-Y)
  cerimonia_tipo: 21, // casamento / renovação
  cerimonia_renovacao_texto: 22, // condicional (se renovação)
  cerimonia_formato: 23, // simbólica / religiosa
  cerimonia_religiao: 24, // condicional (se religiosa)

  // 8. Motivações e história (Z-AB)
  historia_atrai: 25,
  historia_desafio: 26,
  historia_casal: 27,

  // 9. Expectativas (AC-AD)
  expectativas_destination: 28,
  expectativas_imprescindiveis: 29, // texto livre (3 coisas)

  // 10. Perfil de viagem (AE-AH)
  viagem_perfil: 30,
  viagem_ja_viajaram: 31, // booleano
  viagem_marcante: 32,
  viagem_experiencia_especial: 33,

  // 11. Hotel (AI-AJ)
  hotel_perfil: 34,
  hotel_valorizam_e_referencias: 35, // "o que é importante + hotéis bons + ruins" — junto

  // 12. Convidados (AK-AP)
  convidados_perfil: 36,
  convidados_investimento_ideal: 37,
  convidados_dias_ideais: 38,
  convidados_experiencias: 39,
  convidados_numero: 40, // número
  convidados_menores_18: 41,

  // 13. Documentos — agrupado por pessoa (AQ-AX)
  noivo_1_instagram: 42,
  noivo_1_passaporte: 43, // "Possui? Se sim, validade" — string
  noivo_1_outras_cidadanias: 44,
  noivo_1_visto_americano: 45, // "Possui? Se sim, validade" — string
  noivo_2_instagram: 46,
  noivo_2_passaporte: 47,
  noivo_2_outras_cidadanias: 48,
  noivo_2_visto_americano: 49,

  // 14. Convites e identidade visual (AY-BB)
  convites_impressos: 50, // booleano
  identidade_visual_pronta: 51, // booleano
  welcome_gifts: 52,
  dress_code: 53,

  // 15. Padrinhos e paleta (BC-BD)
  padrinhos_terao_e_quantidade: 54,
  padrinhos_paleta: 55,

  // 16. Fornecedores e trajes (BE-BH)
  fornecedores_levar_br: 56,
  fornecedores_contratados_br: 57,
  trajes_loja_noivo_1: 58,
  trajes_loja_noivo_2: 59,

  // 17. Produção (BI-BN)
  producao_celebrante: 60,
  producao_musica: 61,
  producao_decoracao: 62,
  producao_bebidas: 63,
  producao_orcamento: 64,
  producao_observacoes_finais: 65,

  // Metadata (BO, BP)
  submitted_at: 66,
  token: 67,
} as const;

export type ColumnKey = keyof typeof COLUMN_INDEX;

export const TOTAL_COLUMNS = 68;
