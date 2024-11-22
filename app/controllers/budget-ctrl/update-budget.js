import Sequelize from 'sequelize';
import _ from 'lodash';

import { BudgetError } from '../../middleware/error-handler/index.js';

const Op = Sequelize.Op;

/**
 * @param {string} auditApiCallUuid
 * @param {integer} budgetCents
 * @param {object} budgetCtrl
 * @param {string} budgetUuid
 * @param {integer} month
 * @param {string} notes
 * @param {string} subcategoryUuid
 * @param {integer} year
 */
export default async({
  amount,
  auditApiCallUuid,
  budgetCtrl,
  budgetUuid,
  month,
  notes,
  subcategoryUuid,
  year,
}) => {
  const controllers = budgetCtrl.parent;
  const models = budgetCtrl.models;
  if (!budgetUuid) {
    throw new BudgetError('Budget is required');
  } else if (!subcategoryUuid) {
    throw new BudgetError('Category is required');
  } else if (isNaN(parseInt(year, 10))) {
    throw new BudgetError('Year is required');
  } else if (parseInt(year, 10) < 2000
      || parseInt(year, 10) > 2050) {
    throw new BudgetError('Invalid year');
  } else if (isNaN(parseInt(month, 10))) {
    throw new BudgetError('Month is required');
  } else if (parseInt(month, 10) < 0
      || parseInt(month, 10) > 11) {
    throw new BudgetError('Invalid month');
  } else if (isNaN(parseInt(amount, 10))) {
    throw new BudgetError('Invalid budget');
  } else if (!_.isString(notes)) {
    throw new BudgetError('Invalid notes');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new BudgetError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new BudgetError('Audit user does not exist');
  }

  const budget = await models.Budget.findOne({
    attributes: [
      'amount_cents',
      'month',
      'notes',
      'subcategory_uuid',
      'uuid',
      'year',
    ],
    include: [{
      attributes: ['uuid'],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
        where: {
          household_uuid: user.get('household_uuid'),
        },
      }],
      model: models.Subcategory,
      required: true,
    }],
    where: {
      uuid: budgetUuid,
    },
  });
  if (!budget) {
    throw new BudgetError('Not found');
  }

  if (budget.get('amount_cents') !== parseInt(amount, 10)) {
    budget.set('amount_cents', parseInt(amount, 10));
  }
  if (budget.get('month') !== parseInt(month, 10)) {
    budget.set('month', parseInt(month, 10));
  }
  if (budget.get('year') !== parseInt(year, 10)) {
    budget.set('year', parseInt(year, 10));
  }
  if (budget.get('notes') !== notes) {
    budget.set('notes', notes);
  }

  // Validate subcategory UUID
  if (budget.get('subcategory_uuid') !== subcategoryUuid) {
    const subcategory = await models.Subcategory.findOne({
      attributes: ['uuid'],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
        where: {
          household_uuid: user.get('household_uuid'),
        },
      }],
      where: {
        uuid: subcategoryUuid,
      },
    });
    if (!subcategory) {
      throw new BudgetError('Category not found');
    }
    budget.set('subcategory_uuid', subcategory.get('uuid'));
  }

  if (budget.changed()) {
    const duplicateBudget = await models.Budget.findOne({
      attributes: ['uuid'],
      where: {
        month: budget.get('month'),
        subcategory_uuid: budget.get('subcategory_uuid'),
        uuid: {
          [Op.ne]: budget.get('uuid'),
        },
        year: budget.get('year'),
      },
    });
    if (duplicateBudget) {
      throw new BudgetError('Duplicate budget');
    }

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [budget],
        transaction,
      });
    });
  }
};
