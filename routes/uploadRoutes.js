const AWS = require('aws-sdk');
const uuid = require('uuid');

const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'us-east-2',
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
  }
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const {type} = req.query;
    const ext = type.split('/')[1];
    const key = `${req.user.id}/${uuid()}.${ext}`;

    const url = s3.getSignedUrl('putObject', {
      Bucket: 'nodeci-blogs-bucket',
      ContentType: type,
      Key: key,
      Expires: 60
    });

    return res.send({key, url});
  });
}