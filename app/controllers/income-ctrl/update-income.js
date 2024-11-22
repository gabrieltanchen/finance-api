import moment from 'moment';
import Sequelize from 'sequelize';
import _ from 'lodash';

import{ IncomeError } from '../../middleware/error-handler/index.js';

/**
 * @param {integer} amount
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {string} description
 * @param {string} employerUuid
 * @param {string} householdMemberUuid
 * @param {object} incomeCtrl Instance of IncomeCtrl
 * @param {string} incomeUuid
 */
export default async({
  amount,
  auditApiCallUuid,
  date,
  description,
  employerUuid = null,
  householdMemberUuid,
  incomeCtrl,
  incomeUuid,
}) => {
  const controllers = incomeCtrl.parent;
  const models = incomeCtrl.models;
  if (!incomeUuid) {
    throw new IncomeError('Income is required');
  } else if (!householdMemberUuid) {
    throw new IncomeError('Household member is required');
  } else if (!moment.utc(date).isValid()) {
    throw new IncomeError('Invalid date');
  } else if (isNaN(parseInt(amount, 10))) {
    throw new IncomeError('Invalid amount');
  } else if (!_.isString(description)) {
    throw new IncomeError('Invalid description');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new IncomeError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new IncomeError('Audit user does not exist');
  }

  const income = await models.Income.findOne({
    attributes: [
      'amount_cents',
      'date',
      'description',
      'employer_uuid',
      'household_member_uuid',
      'uuid',
    ],
    include: [{
      attributes: ['uuid'],
      model: models.HouseholdMember,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: incomeUuid,
    },
  });
  if (!income) {
    throw new IncomeError('Not found');
  }

  if (income.get('amount_cents') !== parseInt(amount, 10)) {
    income.set('amount_cents', parseInt(amount, 10));
  }
  if (moment(income.get('date')).format('YYYY-MM-DD') !== moment.utc(date).format('YYYY-MM-DD')) {
    income.set('date', moment.utc(date).format('YYYY-MM-DD'));
  }
  if (income.get('description') !== description) {
    income.set('description', description);
  }

  // Validate household member UUID.
  if (householdMemberUuid !== income.get('household_member_uuid')) {
    const householdMember = await models.HouseholdMember.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: householdMemberUuid,
      },
    });
    if (!householdMember) {
      throw new IncomeError('Household member not found');
    }
    income.set('household_member_uuid', householdMember.get('uuid'));
  }

  // Validate employer UUID.
  if (employerUuid !== income.get('employer_uuid')) {
    if (employerUuid) {
      const employer = await models.Employer.findOne({
        attributes: ['uuid'],
        where: {
          household_uuid: user.get('household_uuid'),
          uuid: employerUuid,
        },
      });
      if (!employer) {
        throw new IncomeError('Employer not found');
      }
      income.set('employer_uuid', employer.get('uuid'));
    } else {
      income.set('employer_uuid', null);
    }
  }

  if (income.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [income],
        transaction,
      });
    });
  }
};
