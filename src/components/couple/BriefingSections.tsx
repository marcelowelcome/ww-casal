import type { Couple } from '@/types/couple';
import { BriefingSection } from './BriefingSection';
import { Badge, EmptyState, KeyValueList, PullQuote } from '@/components/ds';

function yesNo(value: boolean | null): string | null {
  if (value === null) return null;
  return value ? 'Sim' : 'Não';
}

function Paragraph({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="whitespace-pre-line text-body leading-7 text-cocoa-800">{children}</p>;
}

function isAllNull(...values: unknown[]): boolean {
  return values.every(
    (v) =>
      v == null ||
      (typeof v === 'string' && v.trim() === '') ||
      (Array.isArray(v) && v.length === 0),
  );
}

export function SectionIdentificacao({ couple }: { couple: Couple }) {
  const { noivo_1, noivo_2 } = couple.identificacao;
  const items = [
    {
      label: 'Noivo 1',
      value: [noivo_1.nome, noivo_1.sobrenome].filter(Boolean).join(' ') || null,
    },
    { label: 'E-mail Noivo 1', value: noivo_1.email },
    {
      label: 'Noivo 2',
      value: [noivo_2.nome, noivo_2.sobrenome].filter(Boolean).join(' ') || null,
    },
    { label: 'E-mail Noivo 2', value: noivo_2.email },
  ];
  return (
    <BriefingSection
      id="identificacao"
      eyebrow="Identificação"
      title={
        <>
          Quem é o <em>casal</em>
        </>
      }
    >
      <KeyValueList items={items} />
    </BriefingSection>
  );
}

export function SectionPorQueWelcome({ couple }: { couple: Couple }) {
  const { motivos, indicacao, texto } = couple.por_que_welcome;
  const empty = isAllNull(motivos, indicacao, texto);
  return (
    <BriefingSection
      id="por_que_welcome"
      eyebrow="Por que Welcome"
      title={
        <>
          O que <em>chamou atenção</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <>
          <KeyValueList
            items={[
              {
                label: 'Motivos',
                value: motivos.length ? (
                  <div className="flex flex-wrap gap-2">
                    {motivos.map((m) => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </div>
                ) : null,
              },
              { label: 'Indicação', value: indicacao },
            ]}
          />
          {texto ? <PullQuote>{texto}</PullQuote> : null}
        </>
      )}
    </BriefingSection>
  );
}

export function SectionDestino({ couple }: { couple: Couple }) {
  const { sonhos, pesquisaram, gostaram, nao_gostaram } = couple.destino;
  const empty = isAllNull(sonhos, pesquisaram, gostaram, nao_gostaram);
  return (
    <BriefingSection
      id="destino"
      eyebrow="Destino e local"
      title={
        <>
          Onde será o <em>“sim”</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Destino dos sonhos', value: sonhos },
            { label: 'Já pesquisaram', value: pesquisaram },
            { label: 'Gostaram', value: gostaram },
            { label: 'Não gostaram', value: nao_gostaram },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionData({ couple }: { couple: Couple }) {
  const { tem_especifica, especifica, periodo } = couple.data;
  const empty = tem_especifica === null && especifica == null && periodo == null;
  return (
    <BriefingSection
      id="data"
      eyebrow="Data e período"
      title={
        <>
          Quando deve <em>acontecer</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          items={[
            { label: 'Tem data específica?', value: yesNo(tem_especifica) },
            { label: 'Data específica', value: especifica },
            { label: 'Período preferido', value: periodo },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionCasamentoCivil({ couple }: { couple: Couple }) {
  const { ja_casados, data, relacao_viagem } = couple.casamento_civil;
  const empty = ja_casados === null && data == null && relacao_viagem == null;
  return (
    <BriefingSection
      id="casamento_civil"
      eyebrow="Casamento civil"
      title={
        <>
          O lado <em>oficial</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          items={[
            { label: 'Já casados?', value: yesNo(ja_casados) },
            { label: 'Data do civil', value: data },
            { label: 'Antes / durante / depois', value: relacao_viagem },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionFilhos({ couple }: { couple: Couple }) {
  const { tem, descricao } = couple.filhos;
  const empty = tem === null && descricao == null;
  return (
    <BriefingSection
      id="filhos"
      eyebrow="Filhos"
      title={
        <>
          A <em>família</em> hoje
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <>
          <KeyValueList items={[{ label: 'Têm filhos?', value: yesNo(tem) }]} />
          {descricao ? <Paragraph>{descricao}</Paragraph> : null}
        </>
      )}
    </BriefingSection>
  );
}

export function SectionCerimonia({ couple }: { couple: Couple }) {
  const { tipo, renovacao_texto, formato, religiao } = couple.cerimonia;
  const empty = isAllNull(tipo, renovacao_texto, formato, religiao);
  return (
    <BriefingSection
      id="cerimonia"
      eyebrow="Tipo e formato"
      title={
        <>
          Estilo da <em>cerimônia</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <>
          <KeyValueList
            density="comfortable"
            items={[
              { label: 'Tipo', value: tipo },
              { label: 'Formato', value: formato },
              { label: 'Religião', value: religiao },
            ]}
          />
          {renovacao_texto ? (
            <PullQuote>{renovacao_texto}</PullQuote>
          ) : null}
        </>
      )}
    </BriefingSection>
  );
}

export function SectionHistoria({ couple }: { couple: Couple }) {
  const { atrai, desafio, casal } = couple.historia;
  const empty = isAllNull(atrai, desafio, casal);
  return (
    <BriefingSection
      id="historia"
      eyebrow="Motivações e história"
      title={
        <>
          A <em>história</em> que sustenta tudo
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <>
          <KeyValueList
            density="spacious"
            items={[
              { label: 'O que atrai', value: <Paragraph>{atrai}</Paragraph> },
              { label: 'Maior desafio', value: <Paragraph>{desafio}</Paragraph> },
            ]}
          />
          {casal ? <PullQuote cite="Resposta do casal">{casal}</PullQuote> : null}
        </>
      )}
    </BriefingSection>
  );
}

export function SectionExpectativas({ couple }: { couple: Couple }) {
  const { destination, imprescindiveis } = couple.expectativas;
  const empty = isAllNull(destination, imprescindiveis);
  return (
    <BriefingSection
      id="expectativas"
      eyebrow="Expectativas"
      title={
        <>
          O que <em>não pode faltar</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Pro destination', value: <Paragraph>{destination}</Paragraph> },
            { label: '3 imprescindíveis', value: <Paragraph>{imprescindiveis}</Paragraph> },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionViagem({ couple }: { couple: Couple }) {
  const { perfil, ja_viajaram, marcante, experiencia_especial } = couple.viagem;
  const empty =
    isAllNull(perfil, marcante, experiencia_especial) && ja_viajaram === null;
  return (
    <BriefingSection
      id="viagem"
      eyebrow="Perfil de viagem"
      title={
        <>
          Como o casal <em>viaja</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Perfil de viagem', value: <Paragraph>{perfil}</Paragraph> },
            { label: 'Já viajaram juntos?', value: yesNo(ja_viajaram) },
            { label: 'Viagem marcante', value: <Paragraph>{marcante}</Paragraph> },
            { label: 'Experiência especial', value: <Paragraph>{experiencia_especial}</Paragraph> },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionHotel({ couple }: { couple: Couple }) {
  const { perfil, valorizam_e_referencias } = couple.hotel;
  const empty = isAllNull(perfil, valorizam_e_referencias);
  return (
    <BriefingSection
      id="hotel"
      eyebrow="Hotel"
      title={
        <>
          Perfil de <em>hospedagem</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Perfil de hotel', value: <Paragraph>{perfil}</Paragraph> },
            {
              label: 'Valorizam / referências',
              value: <Paragraph>{valorizam_e_referencias}</Paragraph>,
            },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionConvidados({ couple }: { couple: Couple }) {
  const {
    perfil,
    investimento_ideal,
    dias_ideais,
    experiencias,
    numero,
    menores_18,
  } = couple.convidados;
  const empty =
    isAllNull(perfil, investimento_ideal, dias_ideais, experiencias, menores_18) && numero == null;
  return (
    <BriefingSection
      id="convidados"
      eyebrow="Convidados"
      title={
        <>
          Sobre os <em>convidados</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Perfil', value: perfil },
            { label: 'Investimento ideal', value: investimento_ideal },
            { label: 'Dias ideais', value: dias_ideais },
            { label: 'Experiências', value: experiencias },
            { label: 'Número', value: numero != null ? String(numero) : null },
            { label: 'Menores de 18', value: menores_18 },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionDocumentos({ couple }: { couple: Couple }) {
  const { noivo_1, noivo_2 } = couple.documentos;
  const empty = isAllNull(
    noivo_1.instagram,
    noivo_1.passaporte,
    noivo_1.outras_cidadanias,
    noivo_1.visto_americano,
    noivo_2.instagram,
    noivo_2.passaporte,
    noivo_2.outras_cidadanias,
    noivo_2.visto_americano,
  );
  return (
    <BriefingSection
      id="documentos"
      eyebrow="Documentos"
      title={
        <>
          Papéis e <em>redes</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="mb-3 text-[10px] uppercase tracking-wider text-champagne-500">
              Noivo 1
            </div>
            <KeyValueList
              items={[
                { label: 'Instagram', value: noivo_1.instagram },
                { label: 'Passaporte BR', value: noivo_1.passaporte },
                { label: 'Outras cidadanias', value: noivo_1.outras_cidadanias },
                { label: 'Visto americano', value: noivo_1.visto_americano },
              ]}
            />
          </div>
          <div>
            <div className="mb-3 text-[10px] uppercase tracking-wider text-champagne-500">
              Noivo 2
            </div>
            <KeyValueList
              items={[
                { label: 'Instagram', value: noivo_2.instagram },
                { label: 'Passaporte BR', value: noivo_2.passaporte },
                { label: 'Outras cidadanias', value: noivo_2.outras_cidadanias },
                { label: 'Visto americano', value: noivo_2.visto_americano },
              ]}
            />
          </div>
        </div>
      )}
    </BriefingSection>
  );
}

export function SectionConvites({ couple }: { couple: Couple }) {
  const { impressos, identidade_visual_pronta, welcome_gifts, dress_code } = couple.convites;
  const empty =
    impressos === null &&
    identidade_visual_pronta === null &&
    welcome_gifts == null &&
    dress_code == null;
  return (
    <BriefingSection
      id="convites"
      eyebrow="Convites e identidade"
      title={
        <>
          Identidade do <em>casamento</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Convites impressos', value: yesNo(impressos) },
            { label: 'Identidade pronta', value: yesNo(identidade_visual_pronta) },
            { label: 'Welcome gifts', value: welcome_gifts },
            { label: 'Dress code', value: dress_code },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionPadrinhos({ couple }: { couple: Couple }) {
  const { terao_e_quantidade, paleta } = couple.padrinhos;
  const empty = isAllNull(terao_e_quantidade, paleta);
  return (
    <BriefingSection
      id="padrinhos"
      eyebrow="Padrinhos e paleta"
      title={
        <>
          Cores e <em>séquito</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          items={[
            { label: 'Madrinhas e padrinhos', value: terao_e_quantidade },
            { label: 'Paleta', value: paleta },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionFornecedores({ couple }: { couple: Couple }) {
  const { levar_br, contratados_br, loja_noivo_1, loja_noivo_2 } = couple.fornecedores;
  const empty = isAllNull(levar_br, contratados_br, loja_noivo_1, loja_noivo_2);
  return (
    <BriefingSection
      id="fornecedores"
      eyebrow="Fornecedores e trajes"
      title={
        <>
          Quem vai <em>com o casal</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <KeyValueList
          density="spacious"
          items={[
            { label: 'Levar do Brasil', value: levar_br },
            { label: 'Já contratados', value: contratados_br },
            { label: 'Loja vestido / traje (Noivo 1)', value: loja_noivo_1 },
            { label: 'Loja vestido / traje (Noivo 2)', value: loja_noivo_2 },
          ]}
        />
      )}
    </BriefingSection>
  );
}

export function SectionProducao({ couple }: { couple: Couple }) {
  const { celebrante, musica, decoracao, bebidas, orcamento, observacoes_finais } = couple.producao;
  const empty = isAllNull(celebrante, musica, decoracao, bebidas, orcamento, observacoes_finais);
  return (
    <BriefingSection
      id="producao"
      eyebrow="Produção e observações"
      title={
        <>
          Detalhes de <em>produção</em>
        </>
      }
    >
      {empty ? (
        <EmptyState />
      ) : (
        <>
          <KeyValueList
            density="spacious"
            items={[
              { label: 'Celebrante', value: celebrante },
              { label: 'Música', value: musica },
              { label: 'Decoração', value: decoracao },
              { label: 'Bebidas', value: bebidas },
              { label: 'Orçamento', value: orcamento },
            ]}
          />
          {observacoes_finais ? <PullQuote>{observacoes_finais}</PullQuote> : null}
        </>
      )}
    </BriefingSection>
  );
}
