import { OwnerAccess } from '../access'

const Media = {
  slug: 'media',
  access: {
    create: () => true,
    read: () => true,
    update: OwnerAccess,
    delete: OwnerAccess,
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  }
}

export default Media;