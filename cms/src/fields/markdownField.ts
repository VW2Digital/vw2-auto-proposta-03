import type { TextareaField } from 'payload'

type MarkdownFieldOptions = Omit<TextareaField, 'type'> & {
  name: string
  /** Cor inicial do seletor na barra (ex.: #ffffff no Hero). Padrão: #0a0a0a */
  defaultColor?: string
}

/** Textarea Markdown com barra de formatação no admin. */
export function markdownField(options: MarkdownFieldOptions): TextareaField {
  const { admin, defaultColor, ...rest } = options

  return {
    type: 'textarea',
    ...rest,
    admin: {
      ...admin,
      custom: {
        ...admin?.custom,
        ...(defaultColor ? { defaultColor } : {}),
      },
      components: {
        ...admin?.components,
        Field: '/components/MarkdownField#MarkdownField',
      },
    },
  }
}
