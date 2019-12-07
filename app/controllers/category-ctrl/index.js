const createCategory = require('./create-category');
const createSubcategory = require('./create-subcategory');
const deleteCategory = require('./delete-category');
const updateCategory = require('./update-category');

class CategoryCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createCategory({
    auditApiCallUuid,
    name,
  }) {
    return createCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      name,
    });
  }

  async createSubcategory({
    auditApiCallUuid,
    categoryUuid,
    name,
  }) {
    return createSubcategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
    });
  }

  async deleteCategory({
    auditApiCallUuid,
    categoryUuid,
  }) {
    return deleteCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
    });
  }

  async updateCategory({
    auditApiCallUuid,
    categoryUuid,
    name,
  }) {
    return updateCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
    });
  }
}

module.exports = CategoryCtrl;
