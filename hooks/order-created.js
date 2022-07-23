export default async function OrderCreated({ doc, req,  operation }) {

  if(operation !== 'create'){
    //return;
  }

  const payload = req.payload;
  const econf = payload.emailOptions;

  const emailContext = {
    ...doc,
    json: JSON.parse(doc.json)
  };

  await payload.sendEmail({
    from: `${econf.fromName} <${econf.fromAddress}>`,
    to: econf.managerEmail,
    subject: 'New order',
    template: 'order-created',
    context: emailContext
  })
  

}