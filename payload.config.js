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
  serverURL: 'http://localhost:3050',
  admin: {
    user: Users.slug,
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
