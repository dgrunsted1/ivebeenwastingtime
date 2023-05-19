import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.LINODE_S3_ACCESS_KEY,
  secretAccessKey: process.env.LINODE_S3_SECRET_KEY,
  endpoint: 'https://<your-linode-region>.linodeobjects.com',
});

async function uploadImage(file) {
  const params = {
    Bucket: '<your-linode-bucket-name>',
    Key: file.name,
    Body: file,
    ContentType: file.type,
  };

  await s3.putObject(params).promise();

  const url = s3.getSignedUrl('getObject', {
    Bucket: '<your-linode-bucket-name>',
    Key: file.name,
    Expires: 3600, // URL expires in 1 hour
  });

  return url;
}

export default {
  uploadImage,
};
