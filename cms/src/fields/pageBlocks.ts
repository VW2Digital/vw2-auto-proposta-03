import type { Block, Field } from 'payload'
import { markdownField } from './markdownField'

const TextBlock: Block = {
  slug: 'text',
  labels: { singular: 'Texto', plural: 'Textos' },
  fields: [
    markdownField({
      name: 'content',
      label: 'Conteúdo (Markdown)',
      required: true,
      admin: {
        description: 'Títulos, listas, negrito, cor e tamanho.',
        rows: 10,
      },
    }),
  ],
}

const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Imagem', plural: 'Imagens' },
  fields: [
    {
      name: 'imageUrl',
      type: 'text',
      label: 'URL da imagem',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Upload',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Legenda',
    },
    {
      name: 'wide',
      type: 'checkbox',
      label: 'Largura total',
      defaultValue: false,
    },
  ],
}

const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Vídeo', plural: 'Vídeos' },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      required: true,
      label: 'URL do vídeo',
      admin: {
        description: 'YouTube, Vimeo ou arquivo .mp4',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Legenda',
    },
  ],
}

const ButtonBlock: Block = {
  slug: 'button',
  labels: { singular: 'Botão', plural: 'Botões' },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Texto do botão',
      defaultValue: 'Saiba mais',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Link',
      defaultValue: '#',
      admin: {
        description: 'URL completa ou âncora (ex.: #proposta).',
      },
    },
    {
      name: 'style',
      type: 'select',
      label: 'Estilo',
      defaultValue: 'primary',
      options: [
        { label: 'Principal', value: 'primary' },
        { label: 'Secundário', value: 'secondary' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
    },
  ],
}

const LinkBlock: Block = {
  slug: 'link',
  labels: { singular: 'Link', plural: 'Links' },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Texto do link',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL',
    },
  ],
}

const HeadingBlock: Block = {
  slug: 'heading',
  labels: { singular: 'Título', plural: 'Títulos' },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Texto',
    },
    {
      name: 'level',
      type: 'select',
      label: 'Nível',
      defaultValue: 'h2',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
      ],
    },
  ],
}

const DividerBlock: Block = {
  slug: 'divider',
  labels: { singular: 'Divisor', plural: 'Divisores' },
  fields: [
    {
      name: 'note',
      type: 'text',
      label: 'Nota interna (opcional)',
      admin: {
        description: 'Só para organização no admin — não aparece no site.',
      },
    },
  ],
}

/** Blocos de conteúdo livres (projeto, proposta, trechos da home). */
export const contentBlocks: Block[] = [
  TextBlock,
  HeadingBlock,
  ImageBlock,
  VideoBlock,
  ButtonBlock,
  LinkBlock,
  DividerBlock,
]

const homeModules = [
  { label: 'Trust Bar', value: 'trustBar' },
  { label: 'Vídeo', value: 'video' },
  { label: 'Quem ajudamos', value: 'whoWeHelp' },
  { label: 'Projetos em destaque', value: 'selectedProjects' },
  { label: 'Serviços', value: 'services' },
  { label: 'Cases', value: 'cases' },
  { label: 'Como funciona', value: 'howItWorks' },
  { label: 'Montar proposta', value: 'proposal' },
  { label: 'Depoimentos', value: 'testimonials' },
  { label: 'CTA final', value: 'finalCta' },
]

const ModuleBlock: Block = {
  slug: 'module',
  labels: { singular: 'Seção do site', plural: 'Seções do site' },
  fields: [
    {
      name: 'module',
      type: 'select',
      required: true,
      label: 'Seção',
      options: homeModules,
      admin: {
        description: 'Insere uma seção pronta da home (arraste para reordenar).',
      },
    },
  ],
}

/** Blocos da home: seções prontas + conteúdo livre. */
export const homeBlocks: Block[] = [ModuleBlock, ...contentBlocks]

type PageBlocksOptions = {
  name?: string
  label?: string
  blocks?: Block[]
  description?: string
}

/** Campo blocks arrastável no estilo page builder. */
export function pageBlocksField(options: PageBlocksOptions = {}): Field {
  const {
    name = 'blocks',
    label = 'Conteúdo da página',
    blocks = contentBlocks,
    description = 'Adicione blocos e arraste para organizar a página.',
  } = options

  return {
    name,
    type: 'blocks',
    label,
    labels: {
      singular: 'Bloco',
      plural: 'Blocos',
    },
    blocks,
    admin: {
      description,
      initCollapsed: false,
    },
  }
}
