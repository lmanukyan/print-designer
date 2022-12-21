import { buildConfig } from 'payload/config';

// Globals
import Pricing from './globals/Pricing';

// Collections
import Users from './collections/Users';
import Media from './collections/Media';
import Orders from './collections/Orders';
import Products from './collections/Products';
import Projects from './collections/Projects';

export default buildConfig({
  serverURL: process.env.PAYLOAD_DOMAIN,
  admin: {
    user: Users.slug,
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        fallback: { 
          ...config.resolve.fallback,
          'original-fs': false, 
          zlib: false,
          fs: false, 
        }
      }
		})
  },
  collections: [
    Users,
    Media,
    Orders,
    Products,
    Projects,
  ],
  globals: [
    Pricing
  ]
});
