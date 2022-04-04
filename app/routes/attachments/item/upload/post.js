const nconf = require('nconf');
const { S3Client, HeadObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'us-east-1' });

module.exports = () => {
  return async(req, res, next) => {
    try {
      // const results =
      await s3Client.send(new PutObjectCommand({
        Bucket: nconf.get('AWS_STORAGE_BUCKET'),
        Key: req.file.originalname,
        Body: req.file.buffer,
      }));
      // console.log('Result:');
      // console.log(results);

      // const response =
      await s3Client.send(new HeadObjectCommand({
        Bucket: nconf.get('AWS_STORAGE_BUCKET'),
        Key: req.file.originalname,
      }));
      // response.ContentLength
      // response.ContentType
      // response.ETag
    } catch (err) {
      return next(err);
    }

    // console.log(req.file);
    // req.file.buffer
    // req.file.originalname
    return res.sendStatus(200);
  };
};
