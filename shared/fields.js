export const PriceRangeField = {
  name: 'prices',
  type: 'array',
  fields: [
    {
      type: 'row',
      fields: [ 
        {
          label: 'Quantity from',
          name: 'from',
          type: 'number',
          required: true,
          admin: {
            width: '33.3%',
          },
        },
        {
          label: 'Quantity to',
          name: 'to',
          type: 'number',
          required: true,
          admin: {
            width: '33.3%',
          },
        },
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            width: '33.3%',
          },
        },
      ],
    }
  ]
}

export const AuthorField = {
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  admin: {
    hidden: true,
  },
  defaultValue: ({ user }) => user?.id
}