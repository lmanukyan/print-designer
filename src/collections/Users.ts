import { CollectionConfig } from 'payload/types'
import { AdminAccess } from '../access'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    disableDuplicate: true,
  },
  access: {
    create: () => true,
    read: AdminAccess,
    update: AdminAccess,
    delete: AdminAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        {
          label: 'Admin',
          value: 'admin'
        },
        {
          label: 'User',
          value: 'user'
        },
      ],
      access: {
        create: AdminAccess,
        read: AdminAccess,
        update: AdminAccess,
      },
    }
  ],
};

export default Users;