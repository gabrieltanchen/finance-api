const { S3Client } = require('@aws-sdk/client-s3');

const createAttachment = require('./create-attachment');
const deleteAttachment = require('./delete-attachment');
const updateAttachment = require('./update-attachment');
const uploadAttachment = require('./upload-attachment');

class AttachmentCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
    this.s3Client = new S3Client({ region: 'us-east-1' });
  }

  async createAttachment(params) {
    return createAttachment({
      ...params,
      attachmentCtrl: this,
    });
  }

  async deleteAttachment(params) {
    return deleteAttachment({
      ...params,
      attachmentCtrl: this,
    });
  }

  async updateAttachment(params) {
    return updateAttachment({
      ...params,
      attachmentCtrl: this,
    });
  }

  async uploadAttachment(params) {
    return uploadAttachment({
      ...params,
      attachmentCtrl: this,
    });
  }
}

module.exports = AttachmentCtrl;
