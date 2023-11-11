import { GlobalConfig } from 'payload/types'
import { PriceRangeField } from '../shared/fields'

const Pricing: GlobalConfig = {
  slug: 'pricing',
  access: {
    read: () => true,
  },
  fields: [
    PriceRangeField,
  ]
}

export default Pricing;