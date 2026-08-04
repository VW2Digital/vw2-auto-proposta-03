import type { CollectionConfig } from 'payload'
import { pageBlocksField } from '../fields/pageBlocks'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Projeto',
    plural: 'Projetos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category', 'featured', 'order'],
    description: 'Projetos do portfólio — listagem e página completa.',
    preview: ({ data }) =>
      data?.slug ? `${FRONTEND_URL}/projetos/${data.slug}` : `${FRONTEND_URL}/projetos`,
    livePreview: {
      url: ({ data }) =>
        data?.slug ? `${FRONTEND_URL}/projetos/${data.slug}` : `${FRONTEND_URL}/projetos`,
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome do projeto',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug (URL)',
      admin: {
        description: 'Ex.: clean-glow → /projetos/clean-glow',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      label: 'Categoria',
      admin: {
        description: 'Ex.: Marca, Estratégia / Embalagem',
      },
    },
    {
      name: 'client',
      type: 'text',
      label: 'Cliente',
    },
    {
      name: 'year',
      type: 'text',
      label: 'Ano',
      admin: { description: 'Ex.: 2025' },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Capa — URL',
      admin: {
        description: 'Imagem principal da listagem / hero.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Capa — upload',
      admin: {
        description: 'Opcional se a URL da capa estiver preenchida.',
      },
      validate: (value: unknown, { siblingData }: { siblingData?: { imageUrl?: string } }) => {
        if (!value && !siblingData?.imageUrl) {
          return 'Informe uma URL de capa ou faça upload.'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Resumo curto',
      admin: {
        description: '1–2 frases na listagem e no topo da página.',
      },
    },
    pageBlocksField({
      name: 'blocks',
      label: 'Conteúdo da página',
      description:
        'Monte a página do projeto: texto, imagem, vídeo, botão, link… Arraste para organizar.',
    }),
    {
      name: 'gallery',
      type: 'array',
      label: 'Galeria',
      labels: { singular: 'Foto', plural: 'Fotos' },
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
    },
    {
      name: 'tall',
      type: 'checkbox',
      label: 'Formato vertical (masonry)',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Em destaque',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordem',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Menor número aparece primeiro.',
      },
    },
  ],
}
