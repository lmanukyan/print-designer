import { PriceRangeField } from '../shared/fields'

const Pricing = {
  slug: 'pricing',
  access: {
    read: () => true,
  },
  fields: [
    PriceRangeField,
  ]
}

export default Pricing;