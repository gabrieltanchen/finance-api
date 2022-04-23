const createAttachment = require('./create-attachment');
const updateAttachment = require('./update-attachment');

class AttachmentCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createAttachment(params) {
    return createAttachment({
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
}

module.exports = AttachmentCtrl;
