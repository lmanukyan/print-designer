const fs = require('fs');

export default async function OrderCreated({ doc, req,  operation }) {

  if(operation !== 'create'){
    //return;
  }

  const attachments = [];
  const payload = req.payload;
  const econf = payload.emailOptions;

  const emailContext = {
    ...doc,
    json: JSON.parse(doc.json)
  };

  if(doc.front || doc.back) {
    const images = await payload.find({
      collection: 'media',
      where: {
        id: {
          in: [doc.front, doc.back]
        }
      }
    });

    images.docs.forEach(
      (item) => attachments.push({
        filename: item.filename,
        content: fs.createReadStream(`${__dirname}/../media/${item.filename}`)
      })
    );
    console.log(attachments);

  }
  
  await payload.sendEmail({
    from: `${econf.fromName} <${econf.fromAddress}>`,
    to: econf.managerEmail,
    subject: 'New order',
    template: 'order-created',
    context: emailContext,
    attachments: attachments
  });
  
}