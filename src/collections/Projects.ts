import { CollectionConfig } from 'payload/types'
import { AuthorizedAccess, OwnerAccess } from '../access'
import { AuthorField } from '../shared/fields'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    defaultColumns: ['title'],
    useAsTitle: 'title',
    disableDuplicate: true,
  },
  access: {
    create: AuthorizedAccess,
    read: OwnerAccess,
    update: OwnerAccess,
    delete: OwnerAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'json',
      type: 'code',
      admin: {
        language: 'json',
        readOnly: true,
      }
    },
    AuthorField,
  ],
  hooks: {
    beforeRead: [
      ({ doc, req, query }) => {
        if( req.query?.hasOwnProperty('mini') ){
          delete doc.json;
        }
      }
    ],
  },
}

export default Projects;