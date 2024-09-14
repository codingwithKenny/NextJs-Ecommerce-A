import multiparty from 'multiparty';

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
    console.log('Files:', files.file.length);

    // Respond with a success message
    res.status(200).json({ message: 'Upload successful', fields, files });
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
