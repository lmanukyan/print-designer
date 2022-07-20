import { AuthorizedAccess, OwnerAccess } from '../access'
import { PriceRangeField, AuthorField } from '../shared/fields'

const Products = {
  slug: 'products',
  admin: {
    defaultColumns: ['title'],
    useAsTitle: 'title',
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
      name: 'clientModel',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
    PriceRangeField,
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'front',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'back',
          type: 'upload',
          relationTo: 'media',
        },
      ]
    },
    {
      name: 'sizes',
      type: 'select',
      hasMany: true,
      options: [
        {'label': 'XS', value: 'xs'},	
        {'label': 'S', value: 's'},	
        {'label': 'M', value: 'm'},	
        {'label': 'L', value: 'l'},	
        {'label': 'XL', value: 'xl'},	
        {'label': 'XXL', value: 'xxl'},
      ]
    },
    AuthorField,
  ],
  endpoints: [
    {
      path: '/models',
      method: 'post',
      handler: async (req, res, next) => {

        const productModels = await req.payload.find({
          collection: 'products',
          sort: 'createdAt',
          where: {
            or: [
              {
                clientModel: {
                  equals: false
                }
              },
              {
                and: [
                  {
                    clientModel: {
                      equals: true
                    },
                  },
                  {
                    author: {
                      equals: req.body.userId
                    }
                  }
                ]
              },
            ]
          }
        });
        res.send(productModels);
      }
    }
  ]

}

export default Products;