import { PriceRangeField } from '../shared/fields'

const Pricing = {
  slug: 'pricing',
  access: {
    read: () => true,
  },
  fields: [
    PriceRangeField,
    {
      label: 'Quality percentage',
      name: 'quality',
      type: 'group',
      fields: [
        {
          name: 'thin',
          type: 'number',
          required: true,
        },
        {
          name: 'dense',
          type: 'number',
          required: true,
        }
      ],
    },
    {
      label: 'Urgency percentage',
      name: 'urgency',
      type: 'number',
      required: true,
    },
  ]
}

export default Pricing;