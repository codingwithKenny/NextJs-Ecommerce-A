import { PutObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import multiparty from 'multiparty';
import fs from 'fs'
import mime from 'mime-types'

const BucketNmame = 'next-ecommerce-ridwat'

export default async function handler(req, res) {
  // Create a new instance of multiparty.Form
  const form = new multiparty.Form();

  try {
    // Parse the request
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    // Log the fields and files
    console.log('Fields:', fields);
    console.log('Files:', files);
     const  client = new S3Client({
      region:"eu-north-1",
      credentials:{
        accessKeyId:process.env.S3_Accesskey,
        secretAccessKey:process.env.S3_Secretaccesskey
      }
     })
     const links = []

     for (const file of files.file){
      const ext = file.originalFilename.split('.').pop()
      console.log(ext)

      const newFileName = Date.now() + '.' + ext

      client.send(new PutObjectCommand({
        Bucket:BucketNmame,
        Key:newFileName,
        Body:fs.readFileSync(file.path),
        ACL:"public-read",
        ContentType:mime.lookup(file.path)
       }))
     }
       
     const link = `https://${BucketNmame}.s3.amazonaws.com/${newFileName}`
        links.push(link)
    // Respond with a success message
    res.status(200).json({ message: 'Upload successful', links});
  } catch (error) {
    // Handle any errors
    console.error('Error processing form:', error);
    res.status(500).json({ error: 'Error processing form' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
