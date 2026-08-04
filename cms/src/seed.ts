import 'dotenv/config'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.resolve(__dirname, '../content')

function readMd(...parts: string[]) {
  return readFileSync(path.join(contentDir, ...parts), 'utf8').trim()
}

const servicesSeed = [
  {
    slug: 'identidade-visual',
    title: 'IDENTIDADE VISUAL',
    description: 'Identidade moderna que comunica autoridade, confiança e diferenciação.',
    icon: 'Palette',
    active: true,
    order: 1,
  },
  {
    slug: 'gestao-midias',
    title: 'GESTÃO DE MÍDIAS SOCIAIS',
    description: 'Conteúdo, community e presença social orientados a engajamento e conversão.',
    icon: 'Share2',
    active: true,
    order: 2,
  },
  {
    slug: 'trafego-pago',
    title: 'TRÁFEGO PAGO',
    description: 'Campanhas de mídia paga com foco em retorno, contatos qualificados e escala.',
    icon: 'Megaphone',
    active: true,
    order: 3,
  },
  {
    slug: 'sites-landing',
    title: 'SITES E LANDING PAGES',
    description: 'Páginas de alta conversão, performance e experiência mobile-first.',
    icon: 'Layout',
    active: true,
    order: 4,
  },
  {
    slug: 'consultoria',
    title: 'CONSULTORIA DE MARKETING DIGITAL',
    description: 'Diagnóstico e recomendações práticas para acelerar seus resultados.',
    icon: 'Lightbulb',
    active: true,
    order: 5,
  },
  {
    slug: 'crm',
    title: 'IMPLEMENTAÇÃO DE CRM',
    description: 'Estruturação do funil e automação para nutrir e converter leads.',
    icon: 'Database',
    active: true,
    order: 6,
  },
  {
    slug: 'treinamento',
    title: 'TREINAMENTO DE ATENDIMENTO AO PÚBLICO',
    description: 'Capacitação da equipe para transformar contatos em clientes.',
    icon: 'Users',
    active: true,
    order: 7,
  },
  {
    slug: 'audiovisual',
    title: 'PRODUÇÃO DE CONTEÚDO ÁUDIO VISUAL',
    description: 'Vídeos e peças audiovisuais que elevam a percepção da sua marca.',
    icon: 'Clapperboard',
    active: true,
    order: 8,
  },
  {
    slug: 'bot-whatsapp',
    title: 'IMPLEMENTAÇÃO DE BOT DE ATENDIMENTO PARA WHATSAPP',
    description: 'Atendimento automatizado 24/7 com fluxo inteligente no WhatsApp.',
    icon: 'Bot',
    active: true,
    order: 9,
  },
  {
    slug: 'google-meu-negocio',
    title: 'IMPLEMENTAÇÃO DE GOOGLE MEU NEGÓCIO',
    description: 'Presença local otimizada para aparecer quando clientes buscam por você.',
    icon: 'MapPin',
    active: true,
    order: 10,
  },
]

const projectsSeed = [
  {
    name: 'Clean & Glow',
    slug: 'clean-glow',
    category: 'Embalagem',
    client: 'Clean & Glow',
    year: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80',
    description:
      'Sistema de embalagens premium para skincare clean beauty, com linguagem visual suave e sofisticada.',
    body: `## Contexto

A Clean & Glow precisava de uma linha de embalagens que comunicasse pureza, cuidado e premium sem perder leveza.

## Desafio

- Diferenciar-se em um mercado saturado de clean beauty
- Manter coesão entre frascos, caixas e peças digitais
- Traduzir “natural” sem cair no genérico

## Solução

Desenvolvemos identidade de embalagem com tipografia delicada, paleta luminosa e acabamentos que reforçam a percepção de cuidado.

## Resultado

Linha pronta para PDV e e-commerce, com sistema expandível para novas fragrâncias e SKUs.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        caption: 'Linha principal',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1571781926291-c77da61d1e90?auto=format&fit=crop&w=800&q=80',
        caption: 'Detalhe do frasco',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
        caption: 'Aplicação em bancada',
        wide: false,
      },
    ],
    tall: true,
    featured: true,
    order: 1,
  },
  {
    name: 'Laghetto',
    slug: 'laghetto',
    category: 'Marca, Estratégia',
    client: 'Laghetto',
    year: '2024',
    imageUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    description:
      'Reposicionamento de marca e identidade visual para um produto com presença forte e contemporânea.',
    body: `## Contexto

A Laghetto buscava uma marca com presença, ritmo e leitura moderna — capaz de sustentar campanhas e embalagens.

## Desafio

- Construir um universo visual memorável
- Unificar marca, packaging e peças de campanha

## Solução

Estratégia de marca + sistema visual com tipografia expressiva, texturas e direção de arte para campanha.

## Resultado

Marca com identidade clara e assets prontos para escala em mídia e ponto de venda.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        caption: 'Identidade',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&fit=crop&w=800&q=80',
        caption: 'Texturas e cor',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
        caption: 'Aplicações',
        wide: false,
      },
    ],
    tall: false,
    featured: true,
    order: 2,
  },
  {
    name: 'Kobe Apps',
    slug: 'kobe-apps',
    category: 'Marca, Estratégia',
    client: 'Kobe Apps',
    year: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=1600&q=80',
    description:
      'Identidade e linguagem visual para produto digital, com foco em clareza e diferenciação.',
    body: `## Contexto

Produto digital em crescimento que precisava de uma marca mais madura e reconhecível.

## Desafio

- Transmitir tecnologia sem frialdade
- Criar sistema flexível para produto e marketing

## Solução

Marca, tipografia e direção visual alinhadas à experiência do app e às campanhas de aquisição.

## Resultado

Sistema de marca pronto para produto, site e mídia paga.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=1200&q=80',
        caption: 'Universo visual',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
        caption: 'Interface',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        caption: 'Campanha',
        wide: false,
      },
    ],
    tall: true,
    featured: true,
    order: 3,
  },
  {
    name: 'Invicta',
    slug: 'invicta',
    category: 'Marca, Estratégia',
    client: 'Invicta',
    year: '2024',
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1600&q=80',
    description: 'Direção de marca com presença forte, contraste e acabamento premium.',
    body: `## Contexto

Reposicionamento premium com ênfase em presença visual e consistência de marca.

## Solução

Sistema tipográfico, paleta e aplicações para embalagem e campanha.

## Resultado

Marca com leitura imediata e assets prontos para expansão.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
        caption: 'Produto',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
        caption: 'Detalhe',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        caption: 'Lifestyle',
        wide: false,
      },
    ],
    tall: true,
    featured: true,
    order: 4,
  },
  {
    name: 'Aurora Skincare',
    slug: 'aurora-skincare',
    category: 'Identidade Visual',
    client: 'Aurora Skincare',
    year: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c77da61d1e90?auto=format&fit=crop&w=1600&q=80',
    description: 'Identidade visual luminosa para marca de skincare com foco em ritual e cuidado.',
    body: `## Contexto

Nova marca de skincare buscando uma identidade acolhedora e contemporânea.

## Solução

Logo, tipografia, paleta e guidelines para embalagem e digital.

## Resultado

Marca consistente do unboxing às redes sociais.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1571781926291-c77da61d1e90?auto=format&fit=crop&w=1200&q=80',
        caption: 'Linha',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        caption: 'Embalagens',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        caption: 'Texturas',
        wide: false,
      },
    ],
    tall: false,
    featured: true,
    order: 5,
  },
  {
    name: 'Noir Parfum',
    slug: 'noir-parfum',
    category: 'Embalagem, Marca',
    client: 'Noir Parfum',
    year: '2024',
    imageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80',
    description: 'Embalagem e marca para fragrância com estética noturna e sofisticada.',
    body: `## Contexto

Lançamento de fragrância com desejo de exclusividade e presença em vitrine.

## Solução

Direção de embalagem, tipografia e narrativa visual dark/premium.

## Resultado

Peça com alto impacto em PDV e campanha.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
        caption: 'Frasco',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        caption: 'Detalhe',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
        caption: 'Ambiente',
        wide: false,
      },
    ],
    tall: true,
    featured: true,
    order: 6,
  },
  {
    name: 'Violet Studio',
    slug: 'violet-studio',
    category: 'Marca, Digital',
    client: 'Violet Studio',
    year: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&fit=crop&w=1600&q=80',
    description: 'Marca e presença digital para estúdio criativo com energia vibrante.',
    body: `## Contexto

Estúdio criativo em expansão precisando de marca alinhada à entrega e ao posicionamento.

## Solução

Identidade, guidelines e peças digitais para site e redes.

## Resultado

Marca coerente do pitch ao portfólio online.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Identidade',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
        caption: 'Digital',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
        caption: 'Aplicações',
        wide: false,
      },
    ],
    tall: false,
    featured: true,
    order: 7,
  },
  {
    name: 'Concrete Form',
    slug: 'concrete-form',
    category: 'Direção de Arte',
    client: 'Concrete Form',
    year: '2024',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    description: 'Direção de arte com estética arquitetônica, luz e materialidade.',
    body: `## Contexto

Projeto editorial / campanha com ênfase em espaço, luz e forma.

## Solução

Direção de arte, composição e tratamento visual para série fotográfica.

## Resultado

Ensaio com linguagem forte para campanha e site.`,
    gallery: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Espaço',
        wide: true,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1487958449943-2429e8be8624?auto=format&fit=crop&w=800&q=80',
        caption: 'Arquitetura',
        wide: false,
      },
      {
        imageUrl:
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        caption: 'Detalhe',
        wide: false,
      },
    ],
    tall: false,
    featured: true,
    order: 8,
  },
]

const casesSeed = [
  {
    client: 'NovaTech Solutions',
    sector: 'Software B2B',
    result: '+187%',
    resultLabel: 'em contatos qualificados',
    description:
      'Reestruturação completa de funil com tráfego pago, páginas de captura e CRM integrado.',
    bodyFile: 'novatech.md',
    metrics: [
      { label: 'Custo por cliente', value: '-42%' },
      { label: 'Conversões', value: '+210%' },
      { label: 'Retorno', value: '4.8x' },
    ],
    published: true,
    order: 1,
  },
  {
    client: 'Casa Aurora',
    sector: 'Varejo',
    result: '+94%',
    resultLabel: 'em faturamento digital',
    description:
      'Identidade visual renovada, gestão de mídias e campanhas sazonais de alto impacto.',
    bodyFile: 'casa-aurora.md',
    metrics: [
      { label: 'Engajamento', value: '+156%' },
      { label: 'Ticket médio', value: '+28%' },
      { label: 'Seguidores', value: '+62K' },
    ],
    published: true,
    order: 2,
  },
  {
    client: 'Clínica Vitalis',
    sector: 'Saúde',
    result: '+320%',
    resultLabel: 'em agendamentos',
    description:
      'Google Meu Negócio, bot de WhatsApp e conteúdo audiovisual para autoridade local.',
    bodyFile: 'clinica-vitalis.md',
    metrics: [
      { label: 'Avaliações', value: '4.9★' },
      { label: 'Resposta', value: '< 2min' },
      { label: 'Faltas', value: '-35%' },
    ],
    published: true,
    order: 3,
  },
  {
    client: 'Atlas Imóveis',
    sector: 'Imobiliário',
    result: '+145%',
    resultLabel: 'em visitas qualificadas',
    description:
      'Estratégia digital + sites de captura + treinamento de atendimento comercial.',
    bodyFile: 'atlas-imoveis.md',
    metrics: [
      { label: 'Contatos/mês', value: '890+' },
      { label: 'Taxa de fechamento', value: '+38%' },
      { label: 'Tempo de resposta', value: '-60%' },
    ],
    published: true,
    order: 4,
  },
]

const audiencesSeed = [
  {
    title: 'Startups SaaS',
    description:
      'Aceleramos aquisição e retenção com funis digitais, posicionamento e ciclos de crescimento mensuráveis.',
    icon: 'Rocket',
    published: true,
    order: 1,
  },
  {
    title: 'Agências Digitais',
    description:
      'Parceiro estratégico para escalar entrega, identidade de marca e performance sem perder qualidade criativa.',
    icon: 'Briefcase',
    published: true,
    order: 2,
  },
  {
    title: 'Coaches e Consultores',
    description:
      'Presença digital que comunica autoridade e converte audiência em clientes de alto valor.',
    icon: 'GraduationCap',
    published: true,
    order: 3,
  },
  {
    title: 'Saúde e Bem-estar',
    description:
      'Marcas de saúde e bem-estar com conteúdo, mídia local e jornadas de atendimento humanizadas.',
    icon: 'HeartPulse',
    published: true,
    order: 4,
  },
]

const testimonialsSeed = [
  {
    name: 'Marina Costa',
    role: 'CEO, NovaTech Solutions',
    quote:
      'Em três meses a Nexo Studio transformou nosso funil. Saímos de contatos esparsos para um fluxo previsível e mensurável.',
    rating: 5,
    published: true,
    order: 1,
  },
  {
    name: 'Rafael Mendes',
    role: 'Diretor Comercial, Atlas Imóveis',
    quote:
      'A proposta interativa já mostrou profissionalismo. O time entregou exatamente o que combinamos — com resultados acima do esperado.',
    rating: 5,
    published: true,
    order: 2,
  },
  {
    name: 'Juliana Ferreira',
    role: 'Fundadora, Casa Aurora',
    quote:
      'Identidade, conteúdo e tráfego trabalhando juntos. Nossa marca nunca esteve tão forte — e as vendas acompanharam.',
    rating: 5,
    published: true,
    order: 3,
  },
]

const proposalsSeed = [
  {
    fullName: 'Marina Costa',
    email: 'marina@novatech.com.br',
    whatsapp: '(11) 98888-1001',
    company: 'NovaTech Solutions',
    website: 'www.novatech.com.br',
    message: 'Queremos escalar aquisição B2B no próximo trimestre.',
    status: 'enviada' as const,
    formalPrice: 'R$ 8.500 / mês',
    formalNotes: 'Prioridade alta — renovação em 90 dias',
    formalMessageFile: 'exemplo-novatech.md',
    services: [
      {
        serviceId: 'trafego-pago',
        title: 'TRÁFEGO PAGO',
        notes: 'Foco em LinkedIn Ads e Meta Ads',
      },
      {
        serviceId: 'sites-landing',
        title: 'SITES E LANDING PAGES',
        notes: '2 LPs de captura',
      },
      {
        serviceId: 'crm',
        title: 'IMPLEMENTAÇÃO DE CRM',
        notes: 'HubSpot starter',
      },
    ],
  },
  {
    fullName: 'Rafael Mendes',
    email: 'rafael@atlasimoveis.com.br',
    whatsapp: '(11) 97777-2002',
    company: 'Atlas Imóveis',
    website: 'www.atlasimoveis.com.br',
    message: 'Precisamos melhorar atendimento e geração de visitas.',
    status: 'nova' as const,
    services: [
      {
        serviceId: 'gestao-midias',
        title: 'GESTÃO DE MÍDIAS SOCIAIS',
        notes: 'Instagram + Google Meu Negócio',
      },
      {
        serviceId: 'treinamento',
        title: 'TREINAMENTO DE ATENDIMENTO AO PÚBLICO',
        notes: 'Equipe comercial de 6 pessoas',
      },
    ],
  },
  {
    fullName: 'Juliana Ferreira',
    email: 'juliana@casaaurora.com.br',
    whatsapp: '(21) 96666-3003',
    company: 'Casa Aurora',
    message: 'Buscamos identidade visual e conteúdo audiovisual.',
    status: 'em_analise' as const,
    services: [
      {
        serviceId: 'identidade-visual',
        title: 'IDENTIDADE VISUAL',
        notes: 'Rebrand completo',
      },
      {
        serviceId: 'audiovisual',
        title: 'PRODUÇÃO DE CONTEÚDO ÁUDIO VISUAL',
        notes: 'Campanha de lançamento',
      },
    ],
  },
]

async function seedIfEmpty(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  items: Record<string, unknown>[],
  label: string,
) {
  const existing = await payload.find({
    collection: collection as 'cases',
    limit: 1,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) {
    console.log(`• ${label} já existem — pulando`)
    return
  }
  for (const item of items) {
    await payload.create({
      collection: collection as 'cases',
      data: item as never,
      overrideAccess: true,
    })
  }
  console.log(`✓ ${items.length} ${label} criados`)
}

async function seed() {
  const payload = await getPayload({ config })

  await seedIfEmpty(payload, 'services', servicesSeed, 'serviços')

  // Projetos: cria ou atualiza com slug, texto e galeria
  let projectsTouched = 0
  for (const item of projectsSeed) {
    const found = await payload.find({
      collection: 'projects',
      where: {
        or: [
          { slug: { equals: item.slug } },
          { name: { equals: item.name } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (found.docs[0]) {
      const doc = found.docs[0]
      if (!doc.slug || !doc.body || !(doc.gallery as unknown[])?.length) {
        await payload.update({
          collection: 'projects',
          id: doc.id,
          data: item,
          overrideAccess: true,
        })
        projectsTouched += 1
      }
    } else {
      await payload.create({
        collection: 'projects',
        data: item,
        overrideAccess: true,
      })
      projectsTouched += 1
    }
  }
  console.log(
    projectsTouched
      ? `✓ ${projectsTouched} projetos criados/atualizados`
      : '• Projetos já atualizados — pulando',
  )

  await seedIfEmpty(payload, 'audiences', audiencesSeed, 'públicos')
  await seedIfEmpty(payload, 'testimonials', testimonialsSeed, 'depoimentos')

  const existingCases = await payload.find({
    collection: 'cases',
    limit: 1,
    overrideAccess: true,
  })
  if (existingCases.totalDocs === 0) {
    for (const item of casesSeed) {
      const { bodyFile, ...rest } = item
      await payload.create({
        collection: 'cases',
        data: {
          ...rest,
          body: readMd('cases', bodyFile),
        },
        overrideAccess: true,
      })
    }
    console.log(`✓ ${casesSeed.length} cases criados`)
  } else {
    console.log('• Cases já existem — pulando')
  }

  const existingProposals = await payload.find({
    collection: 'proposals',
    limit: 1,
    overrideAccess: true,
  })
  if (existingProposals.totalDocs === 0) {
    for (const item of proposalsSeed) {
      const { formalMessageFile, ...rest } = item
      const created = await payload.create({
        collection: 'proposals',
        data: {
          ...rest,
          formalMessage: formalMessageFile
            ? readMd('proposals', formalMessageFile)
            : undefined,
          sentAt: rest.status === 'enviada' ? new Date().toISOString() : undefined,
        },
        overrideAccess: true,
      })
      console.log(
        `✓ Proposta ${created.company} (${created.status})` +
          (created.accessToken ? ` → /proposta/${created.accessToken}` : ''),
      )
    }
  } else {
    console.log('• Propostas já existem — pulando')
  }

  // Globals (Hero, Trust Bar, Vídeo)
  const hero = await payload.findGlobal({ slug: 'hero', overrideAccess: true })
  await payload.updateGlobal({
    slug: 'hero',
    data: {
      media: {
        imageUrl: hero?.media?.imageUrl || '/hero-team.png',
        height: hero?.media?.height ?? 100,
        objectPosition: hero?.media?.objectPosition || 'center',
      },
      tags: hero?.tags?.length
        ? hero.tags
        : [
            { label: 'Design Inteligente' },
            { label: 'Experiências' },
            { label: 'Estratégia' },
            { label: 'Marca' },
          ],
      headlineSerif: hero?.headlineSerif || 'Design criativo',
      headlineBold: hero?.headlineBold || 'ESTRATÉGIA',
      subtitle:
        hero?.subtitle ||
        'Monte sua proposta personalizada em minutos e impulsione o crescimento do seu negócio.',
      ctaLabel: hero?.ctaLabel || 'Vamos conversar',
      ctaTarget: hero?.ctaTarget || '#proposta',
    },
    overrideAccess: true,
  })
  console.log('✓ Hero global atualizado (foto + altura)')

  const trust = await payload.findGlobal({ slug: 'trust-bar', overrideAccess: true })
  if (!trust?.logos?.length) {
    await payload.updateGlobal({
      slug: 'trust-bar',
      data: {
        line1Prefix: 'Junte-se a',
        line1Stat: '5.000+',
        line1Suffix: 'membros satisfeitos.',
        line2Prefix: 'Confiado por',
        line2Stat: '5.000+',
        line2Suffix: 'times.',
        logos: [
          { name: 'Kerala' },
          { name: 'Dean Tadnai' },
          { name: 'Root Media' },
          { name: 'Altitude' },
          { name: 'Northline' },
        ],
      },
      overrideAccess: true,
    })
    console.log('✓ Trust Bar global criado')
  } else {
    console.log('• Trust Bar já existe — pulando')
  }

  const video = await payload.findGlobal({ slug: 'video-section', overrideAccess: true })
  // Sempre sincroniza para o schema enxuto (só URL)
  await payload.updateGlobal({
    slug: 'video-section',
    data: {
      videoUrl: video?.videoUrl || '',
    },
    overrideAccess: true,
  })
  console.log('✓ Seção de Vídeo atualizada (somente URL)')

  console.log('\nSeed concluído. Admin: http://localhost:3000/admin')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
