import { CollectionConfig } from 'payload/types'
import { OwnerAccess } from '../access'
import { AuthorField } from '../shared/fields'

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: () => true,
    read: () => true,
    update: OwnerAccess,
    delete: OwnerAccess,
  },
  fields: [
    AuthorField,
  ],
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  }
}

export default Media;