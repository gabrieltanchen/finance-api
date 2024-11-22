import createVendor from './create-vendor.js';
import deleteVendor from './delete-vendor.js';
import updateVendor from './update-vendor.js';

export default class VendorCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createVendor({
    auditApiCallUuid,
    name,
  }) {
    return createVendor({
      auditApiCallUuid,
      name,
      vendorCtrl: this,
    });
  }

  async deleteVendor({
    auditApiCallUuid,
    vendorUuid,
  }) {
    return deleteVendor({
      auditApiCallUuid,
      vendorCtrl: this,
      vendorUuid,
    });
  }

  async updateVendor({
    auditApiCallUuid,
    name,
    vendorUuid,
  }) {
    return updateVendor({
      auditApiCallUuid,
      name,
      vendorCtrl: this,
      vendorUuid,
    });
  }
}
