const createAttachment = require('./create-attachment');

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
}

module.exports = AttachmentCtrl;
