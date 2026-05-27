import { TOTAL_COLUMNS, COLUMN_INDEX, type ColumnKey } from './schema';

/**
 * Cria uma linha bruta no formato do Sheets a partir de um mapa parcial coluna → valor.
 * Posições não informadas viram string vazia (que o parser transforma em null/[]).
 */
function row(values: Partial<Record<ColumnKey, string>>): string[] {
  const r: string[] = new Array(TOTAL_COLUMNS).fill('');
  for (const [key, value] of Object.entries(values)) {
    const idx = COLUMN_INDEX[key as ColumnKey];
    r[idx] = value ?? '';
  }
  return r;
}

/**
 * Fixtures realistas — usadas quando USE_MOCK_DATA=1.
 * Reflete a estrutura completa das 17 seções, com algumas seções vazias para
 * exercitar EmptyState e textos longos para validar leitura editorial.
 */
export const MOCK_ROWS: string[][] = [
  row({
    noivo_1_nome: 'Camille',
    noivo_1_sobrenome: 'Andrade',
    noivo_1_email: 'camille@example.com',
    noivo_2_nome: 'Pedro',
    noivo_2_sobrenome: 'Alves',
    noivo_2_email: 'pedro@example.com',

    welcome_motivos: 'Reputação; Indicação; Casamentos no Caribe',
    welcome_indicacao: 'Mariana Souza (casou em Tulum/2024)',
    welcome_texto:
      'Conhecemos a Welcome pelo Instagram, mas o que selou a escolha foi a indicação da Mari, que falou maravilhas da assessoria. Queremos quem cuide de tudo, não temos paciência pra logística internacional.',

    destino_sonhos:
      'Casamento de pé na areia, "como nos filmes". Quero reunir família e amigos num lugar paradisíaco onde a gente possa curtir junto por 4-5 dias, não só a cerimônia.',
    destino_pesquisaram: 'Inicialmente Aruba e Curaçao, depois Punta Cana, Riviera Maya, Tulum.',
    destino_gostaram: 'Punta Cana pela praia e estrutura all-inclusive. Tulum pelo estilo boho.',
    destino_nao_gostaram:
      'Achamos Aruba muito turístico e sem identidade. Curaçao bonito mas longe.',

    data_tem_especifica: 'FALSE',
    data_periodo: 'Maio ou Junho de 2027',

    civil_ja_casados: 'FALSE',
    civil_relacao_viagem: 'Faremos antes da viagem, no Brasil, em cerimônia íntima.',

    filhos_tem: 'FALSE',

    cerimonia_tipo: 'Casamento',
    cerimonia_formato: 'Simbólica',

    historia_atrai:
      'A possibilidade de viver com nossos convidados por vários dias, dividindo cafés da manhã, festas, passeios. Casamento como uma experiência, não como um evento de uma noite.',
    historia_desafio: 'O orçamento dos nossos convidados — não queremos que ninguém deixe de ir por dinheiro.',
    historia_casal:
      'Nos conhecemos no mestrado em 2019. Pedro pediu em casamento em Florianópolis no aniversário de 4 anos juntos. Temos uma cachorra (Lola) que vai com a gente em quase tudo.',

    expectativas_destination: 'Que seja inesquecível pra nós e pros convidados, sem stress.',
    expectativas_imprescindiveis:
      '1) Festa open bar até o fim. 2) Cerimônia simbólica linda e emocionante. 3) Experiências pra viver com os convidados ao longo dos dias.',

    viagem_perfil: 'Adoramos praia, cultura e gastronomia. Geralmente combinamos os três.',
    viagem_ja_viajaram: 'TRUE',
    viagem_marcante: 'Marrocos em 2022 (nosso favorito). Tóquio em 2024. Patagônia em 2023.',
    viagem_experiencia_especial:
      'Jantar privativo em deserto. Aulas de cozinha local. Festas com músicos da região.',

    hotel_perfil: 'Resort all-inclusive com proposta diferenciada (não genérico).',
    hotel_valorizam_e_referencias:
      'Valorizamos quartos com vista pro mar, gastronomia variada, boa cama, atendimento personalizado. Hotéis bons: Excellence Punta Cana (estivemos em 2024), Belmond Maroma, Banyan Tree Mayakoba. Hotéis ruins: Bahia Principe (básico demais).',

    convidados_perfil: 'Família, amigos de faculdade, alguns colegas de trabalho. Faixa 25-65 anos.',
    convidados_investimento_ideal: 'Pacote de R$ 6.000-8.000 por pessoa com 5 noites all-inclusive.',
    convidados_dias_ideais: '4-5 dias. Chegada quinta, casamento sábado, retorno segunda.',
    convidados_experiencias: 'Welcome cocktail, passeio de catamarã, jantar de boas-vindas e festa.',
    convidados_numero: '85',
    convidados_menores_18: '3 crianças (10, 8 e 4 anos)',

    noivo_1_instagram: '@camilleandrade',
    noivo_1_passaporte: 'Sim — válido até 03/2031',
    noivo_1_visto_americano: 'Sim — válido até 05/2028',
    noivo_2_instagram: '@pedroalvs',
    noivo_2_passaporte: 'Sim — válido até 11/2029',
    noivo_2_outras_cidadanias: 'Cidadania italiana',
    noivo_2_visto_americano: 'Sim — válido até 07/2030',

    convites_impressos: 'TRUE',
    identidade_visual_pronta: 'FALSE',
    welcome_gifts: 'Queremos um kit com hidratação, chinelo e algum item local do destino.',
    dress_code: 'Casual chic em tons terrosos.',

    padrinhos_terao_e_quantidade: '6 padrinhos no total (3 + 3)',
    padrinhos_paleta: 'Terracota, sand, off-white, verde-oliva.',

    fornecedores_levar_br: 'Fotógrafo (Lucas Mahla) e DJ (DJ Cool).',
    fornecedores_contratados_br: 'Apenas fotógrafo até agora.',
    trajes_loja_noivo_1: 'Vestido: ateliê em SP (Letícia Manente).',
    trajes_loja_noivo_2: 'Sim, ainda definir.',

    producao_celebrante: 'Queremos celebrante mulher, brasileira, com texto autoral.',
    producao_musica: 'Cerimônia com violino e voz. Festa com DJ e banda de 4 horas.',
    producao_decoracao: 'Decoração minimalista com flores tropicais e velas. Sem arcos pesados.',
    producao_bebidas: 'Drinks autorais (gin), espumante na chegada, open bar premium.',
    producao_orcamento: 'R$ 450.000 (excluindo viagem dos noivos).',
    producao_observacoes_finais:
      'A Lola (cachorra) é importante; queremos uma foto com ela no ensaio pré-casamento no Brasil.',

    submitted_at: '2026-03-14T15:22:08',
    token: 'uuld1xf9p4n86i8ihfnzuuld1xfk9g3n',
  }),

  row({
    noivo_1_nome: 'Micaele',
    noivo_1_sobrenome: 'Reis',
    noivo_1_email: 'mica@example.com',
    noivo_2_nome: 'Samuel',
    noivo_2_sobrenome: 'Lopes',
    noivo_2_email: 'sam@example.com',

    welcome_motivos: 'Portfólio; Atendimento personalizado',
    welcome_texto: 'O portfólio em vinícola foi o que mais nos chamou atenção.',

    destino_sonhos: 'Casamento em vinícola, no Brasil ou Mendoza. Outono, clima ameno.',
    destino_pesquisaram: 'Vale dos Vinhedos (Bento), Mendoza, Toscana.',
    destino_gostaram: 'Mendoza pela proximidade e pelo clima cinematográfico.',
    destino_nao_gostaram: 'Toscana fica fora do orçamento dos convidados.',

    data_tem_especifica: 'TRUE',
    data_especifica: '15/05/2027',

    civil_ja_casados: 'TRUE',
    civil_data: '20/01/2025',
    civil_relacao_viagem: 'Já casados no civil; viagem é a celebração.',

    filhos_tem: 'FALSE',

    cerimonia_tipo: 'Renovação',
    cerimonia_renovacao_texto:
      'Casamos no civil em janeiro de 2025 e queríamos um momento simbólico que reunisse todos os queridos numa vinícola.',
    cerimonia_formato: 'Simbólica',

    historia_atrai:
      'Sempre quisemos algo íntimo, com pouca gente. A vinícola tem essa pegada de retiro coletivo.',
    historia_desafio: 'Conciliar agendas internacionais — temos amigos fora do Brasil.',
    historia_casal: 'Juntos há 9 anos. Casamos no civil em janeiro de 2025.',

    expectativas_destination: 'Intimidade, vinho, comida boa, conversa fluindo.',
    expectativas_imprescindiveis: 'Wine pairing harmonizado; cerimônia ao pôr-do-sol; música ao vivo.',

    viagem_perfil: 'Slow travel com foco em vinho e gastronomia.',
    viagem_ja_viajaram: 'TRUE',
    viagem_marcante: 'Mendoza 2022, Patagônia 2023.',
    viagem_experiencia_especial: 'Wine tastings privados; jantares com chef na vinha.',

    hotel_perfil: 'Boutique, com até 30 quartos, atendimento próximo.',
    hotel_valorizam_e_referencias:
      'Valorizamos café da manhã elaborado, vista, silêncio. Referência: Cavas Wine Lodge (Mendoza), Hotel Fasano Punta del Este.',

    convidados_perfil: '40-50 convidados próximos.',
    convidados_investimento_ideal: 'Faixa de R$ 4.000-5.000 por pessoa para 3 noites.',
    convidados_dias_ideais: '3 noites (sexta a segunda).',
    convidados_experiencias: 'Tour de degustação na sexta, casamento no sábado, brunch domingo.',
    convidados_numero: '45',
    convidados_menores_18: 'Nenhum.',

    noivo_1_instagram: '@mica.reis',
    noivo_1_passaporte: 'Sim — válido até 08/2030',
    noivo_1_visto_americano: 'Sim — válido até 06/2029',
    noivo_2_instagram: '@samuell',
    noivo_2_passaporte: 'Sim — vai renovar antes da viagem',
    noivo_2_visto_americano: 'Não',

    convites_impressos: 'FALSE',
    identidade_visual_pronta: 'TRUE',
    welcome_gifts: 'Um vinho local com tag personalizada.',
    dress_code: 'Black tie opcional, tons sóbrios.',

    padrinhos_terao_e_quantidade: '4 padrinhos.',
    padrinhos_paleta: 'Bordô, off-white, dourado fosco.',

    fornecedores_levar_br: 'Apenas o cerimonialista.',
    fornecedores_contratados_br: 'Identidade visual com a Estúdio Lume.',

    producao_celebrante: 'Amigo do casal, juiz de paz na civil — vai conduzir a simbólica também.',
    producao_musica: 'Trio de cordas na cerimônia; banda jazz no jantar.',
    producao_decoracao: 'Pouca decoração, deixar a vinícola brilhar.',
    producao_bebidas: 'Wine pairing harmonizado com o menu degustação.',
    producao_orcamento: 'R$ 280.000.',

    submitted_at: '2026-04-02T11:09:55',
    token: 'mendoza2027micaesam',
  }),

  row({
    noivo_1_nome: 'Bruna',
    noivo_1_sobrenome: 'Carvalho',
    noivo_1_email: 'bruna@example.com',
    noivo_2_nome: 'Diego',
    noivo_2_sobrenome: 'Martins',
    noivo_2_email: 'diego@example.com',

    welcome_motivos: 'Indicação; Reputação',
    welcome_indicacao: 'Felipe e Carla (Tulum/2025)',
    welcome_texto: 'Quem indicou a Welcome falou que tudo correu sem nós precisarmos nos preocupar com nada.',

    destino_sonhos: 'Tulum, definitivo.',
    destino_pesquisaram: 'Apenas Tulum.',
    destino_gostaram: 'Estética cenográfica e proximidade da natureza.',

    data_tem_especifica: 'FALSE',
    data_periodo: 'Outubro de 2026',

    civil_ja_casados: 'FALSE',
    civil_relacao_viagem: 'Civil no dia anterior à cerimônia simbólica, no destino, com 2 testemunhas.',

    filhos_tem: 'TRUE',
    filhos_descricao:
      'Antonia (6) — filha do Diego. Tem TEA leve, importante ambiente tranquilo e pessoas conhecidas por perto.',

    cerimonia_tipo: 'Casamento',
    cerimonia_formato: 'Simbólica',

    historia_atrai: 'Tulum tem alma. A combinação cenote + selva + praia é única.',
    historia_desafio: 'Trazer pais que nunca viajaram pra fora do Brasil.',
    historia_casal:
      'Diego é viúvo, perdeu a esposa em 2020. Conhecemos em 2022. A Antonia me chamou de "mamãe-amiga" pela primeira vez no ano passado. Esse casamento é também sobre essa família que estamos construindo juntos.',

    expectativas_destination: 'Profundidade emocional, beleza visual, conforto.',
    expectativas_imprescindiveis: 'Acolhimento da Antonia; família em primeiro lugar; ritual em cenote.',

    viagem_perfil: 'Praia e bem-estar.',
    viagem_ja_viajaram: 'TRUE',
    viagem_marcante: 'Lua de mel familiar em Maragogi 2023.',

    hotel_perfil: 'Resort com vibe boho-chic em Tulum.',
    hotel_valorizam_e_referencias:
      'Espaço para crianças, atendimento atencioso, gastronomia. Referência: Be Tulum, Habitas Tulum.',

    convidados_perfil: 'Família próxima e amigos mais íntimos.',
    convidados_investimento_ideal: 'R$ 7.000-9.000 por pessoa.',
    convidados_dias_ideais: '4 dias.',
    convidados_experiencias: 'Ritual de cenote opcional; jantar em palapa.',
    convidados_numero: '60',
    convidados_menores_18: '4 crianças.',

    noivo_1_instagram: '@bruncarvalho',
    noivo_1_passaporte: 'Sim — válido até 06/2028',
    noivo_1_visto_americano: 'Sim — válido até 04/2027',
    noivo_2_instagram: '@dimartins',
    noivo_2_passaporte: 'Sim — válido até 09/2030',
    noivo_2_visto_americano: 'Sim — válido até 11/2028',

    convites_impressos: 'TRUE',
    identidade_visual_pronta: 'FALSE',
    welcome_gifts: 'Algo que a Antonia possa ajudar a preparar.',
    dress_code: 'Tons claros, tecidos leves.',

    padrinhos_terao_e_quantidade: '8 padrinhos.',
    padrinhos_paleta: 'Off-white, areia, verde-claro.',

    fornecedores_levar_br: 'Fotógrafa de família.',
    fornecedores_contratados_br: 'Fotógrafa apenas.',
    trajes_loja_noivo_1: 'Vestido: Lethicia Bronstein.',

    producao_celebrante: 'Celebrante que conduza com sensibilidade — história delicada.',
    producao_musica: 'Cantora e violão na cerimônia; DJ na festa.',
    producao_decoracao: 'Madeira, flores tropicais, velas e tecido bege caindo do palco.',
    producao_bebidas: 'Mezcal, tequila, drinks com frutas locais.',
    producao_orcamento: 'R$ 380.000.',
    producao_observacoes_finais:
      'Privacidade nas fotos da Antonia é importante — não queremos divulgação nas redes sem aprovação.',

    submitted_at: '2026-05-20T09:48:30',
    token: 'tulum2026brunadiego',
  }),
];
