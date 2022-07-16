import { AuthorizedAccess, OwnerAccess } from '../access'

const Projects = {
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
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        hidden: true,
      },
      defaultValue: ({ user }) => user.id
    },
  ],
  hooks: {
    beforeRead: [
      ({ doc, req, query }) => {
        if( req.query.hasOwnProperty('mini') ){
          delete doc.json;
        }
      }
    ],
  },
}

export default Projects;