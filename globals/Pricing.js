const Pricing = {
    slug: 'pricing',
    fields: [
      {
        name: 'items',
        type: 'array',
        required: true,
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
                name: 'price',
                type: 'number',
                required: true,
                admin: {
                  width: '33.3%',
                },
              },
            ],
          }
        ]
      },
    ]
}

export default Pricing;