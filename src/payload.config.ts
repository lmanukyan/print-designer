import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import Media from './collections/Media'
import Orders from './collections/Orders'
import Products from './collections/Products'
import Projects from './collections/Projects'

import Pricing from "./globals/Pricing";

export default buildConfig({
  serverURL: process.env.PAYLOAD_DOMAIN,
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        zlib: false,
        fs: false,
        'original-fs': false
      }
      return config
    }
  },
  editor: slateEditor({}),
  collections: [
      Users,
    Media,
    Orders,
    Products,
    Projects,
  ],
  globals: [
    Pricing
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
