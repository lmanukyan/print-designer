import OrderCreated from '../hooks/order-created'
import { OwnerAccess } from '../access'
import { AuthorField } from '../shared/fields'

const Orders = {
  slug: 'orders',
  admin: {
    defaultColumns: ['title', 'phone', 'price', 'createdAt'],
    useAsTitle: 'title',
    disableDuplicate: true,
  },
  access: {
    create: () => true,
    read: OwnerAccess,
    update: OwnerAccess,
    delete: OwnerAccess,
  },
  hooks: {
    afterChange: [
      OrderCreated
    ]
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'clientModel',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'urgency',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'quality',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'quantity',
      type: 'code',
      admin: { 
        readOnly: true, 
        language: 'html',
        condition: (data) => ! data.clientModel
      },
    },
    {
      name: 'front',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { hidden: true },
    },
    {
      name: 'back',
      type: 'upload',
      relationTo: 'media',
      admin: { hidden: true },
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
}

export default Orders;