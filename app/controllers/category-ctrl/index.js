import createCategory from './create-category.js';
import createSubcategory from './create-subcategory.js';
import deleteCategory from './delete-category.js';
import deleteSubcategory from './delete-subcategory.js';
import updateCategory from './update-category.js';
import updateSubcategory from './update-subcategory.js';

export default class CategoryCtrl {
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

  async deleteSubcategory({
    auditApiCallUuid,
    subcategoryUuid,
  }) {
    return deleteSubcategory({
      auditApiCallUuid,
      categoryCtrl: this,
      subcategoryUuid,
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

  async updateSubcategory({
    auditApiCallUuid,
    categoryUuid,
    name,
    subcategoryUuid,
  }) {
    return updateSubcategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
      subcategoryUuid,
    });
  }
}
