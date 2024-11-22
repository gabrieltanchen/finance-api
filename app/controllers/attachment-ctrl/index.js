import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import createAttachment from './create-attachment.js';
import deleteAttachment from './delete-attachment.js';
import updateAttachment from './update-attachment.js';
import uploadAttachment from './upload-attachment.js';

export default class AttachmentCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
    this.s3Client = new S3Client({ region: 'us-east-1' });
    this.s3GetSignedUrl = getSignedUrl;
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
