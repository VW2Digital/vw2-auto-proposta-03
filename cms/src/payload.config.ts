import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Cases } from './collections/Cases'
import { Proposals } from './collections/Proposals'
import { Testimonials } from './collections/Testimonials'
import { Audiences } from './collections/Audiences'
import { Hero } from './globals/Hero'
import { TrustBar } from './globals/TrustBar'
import { VideoSection } from './globals/VideoSection'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
const usePostgres =
  databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: ' — Nexo Studio',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 812 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Projects,
    Services,
    Cases,
    Audiences,
    Testimonials,
    Proposals,
  ],
  globals: [Hero, TrustBar, VideoSection],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'nexo-dev-secret-change-me-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUrl,
        },
      })
    : sqliteAdapter({
        client: {
          url: databaseUrl || 'file:./data/nexo.db',
        },
        // Seed reuses an existing DB; pushing again can collide on indexes.
        push: process.env.SEED !== '1',
      }),
  sharp,
})
