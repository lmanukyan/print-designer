const fs = require('fs');
const path = require('path');
const AdmZip = require("adm-zip");

export default async function OrderCreated({ doc, req,  operation }) {

  if(operation !== 'create'){
    //return;
  }

  const zip = new AdmZip();
  const payload = req.payload;
  const econf = payload.emailOptions;
  const fabricData = JSON.parse(doc.json);

  const emailContext = {
    ...doc,
    json: fabricData
  };

  // Front image
  const front = await payload.findByID({
    collection: 'media',
    id: doc.front
  });

  zip.addFile(
    `front/${path.basename(front.filename)}`,
    fs.readFileSync(`${__dirname}/../media/${front.filename}`)
  );

  // Back image
  if (doc.back) {
    const back = await payload.findByID({
      collection: 'media',
      id: doc.back
    });
  
    zip.addFile(
      `back/${path.basename(back.filename)}`,
      fs.readFileSync(`${__dirname}/../media/${back.filename}`)
    );
  }

  // Layer images
  const imageLayers = fabricData.canvasData.objects.filter(
    l => l.layerType === 'image'
  );
  for(let layer of imageLayers){
    const layerPath = layer.src.replace(payload.config.serverURL, '');
    zip.addFile(
      `layers/${path.basename(layerPath)}`,
      fs.readFileSync(`${__dirname}/../${layerPath}`)
    );
  }

  try {
    await payload.sendEmail({
      from: `${econf.fromName} <${econf.fromAddress}>`,
      to: econf.managerEmail,
      subject: 'New order',
      template: 'order-created',
      context: emailContext,
      attachments: [
        {
          filename: 'attachments.zip',
          content: zip.toBuffer()
        }
      ]
    });
  } catch(e) {
    fs.appendFile(
      `${payload.config.paths.configDir}/error.log`,
      JSON.stringify(e) + '\n',
      () => {}
    );
  }
}