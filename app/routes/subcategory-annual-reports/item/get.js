import Sequelize from 'sequelize';
import { CategoryError } from '../../../middleware/error-handler/index.js';

const Op = Sequelize.Op;

export default (app) => {
  const models = app.get('models');

  return async(req, res, next) => {
    try {
      let year = req.params.id.substr(-5);
      if (year.length !== 5
          || year.substr(0, 1) !== '-'
          || isNaN(year.substr(1))) {
        throw new CategoryError('Invalid year');
      }
      year = parseInt(year.substr(1), 10);
      const uuid = req.params.id.substr(0, 36);

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new CategoryError('Unauthorized');
      }

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
          uuid,
        },
      });
      if (!subcategory) {
        throw new CategoryError('Not found');
      }

      const budgetYears = (await models.Budget.findAll({
        attributes: [
          [Sequelize.literal('DISTINCT("Budget"."year")'), 'year'],
        ],
        order: [['year', 'ASC']],
        where: {
          subcategory_uuid: subcategory.get('uuid'),
        },
      })).map((budgetYear) => {
        return parseInt(budgetYear.get('year'), 10);
      });
      const expenseYears = (await models.Expense.findAll({
        attributes: [
          [Sequelize.literal('EXTRACT(YEAR FROM "Expense"."date")'), 'year'],
        ],
        group: ['year'],
        order: [[Sequelize.literal('year ASC')]],
        where: {
          subcategory_uuid: subcategory.get('uuid'),
        },
      })).map((expenseYear) => {
        return parseInt(expenseYear.get('year'), 10);
      });
      const years = [...new Set([...budgetYears, ...expenseYears])];
      let hasNextYear = false;
      let hasPrevYear = false;
      for (const y of years) {
        if (y < year) {
          hasPrevYear = true;
        } else if (y > year) {
          hasNextYear = true;
        }
      }

      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const monthReports = await Promise.all(months.map(async(month) => {
        return {
          budget: await models.Budget.findOne({
            attributes: ['amount_cents'],
            where: {
              month,
              subcategory_uuid: subcategory.get('uuid'),
              year,
            },
          }),
          month,
          expenseSum: await models.Expense.findAll({
            attributes: [
              [Sequelize.fn('sum', Sequelize.col('Expense.amount_cents')), 'amount_cents'],
              [Sequelize.fn('sum', Sequelize.col('Expense.reimbursed_cents')), 'reimbursed_cents'],
            ],
            where: {
              subcategory_uuid: subcategory.get('uuid'),
              [Op.and]: [
                Sequelize.literal(`EXTRACT(YEAR FROM "Expense"."date") = ${year}`),
                Sequelize.literal(`EXTRACT(MONTH FROM "Expense"."date") = ${(month + 1)}`),
              ],
            },
          }),
        };
      }));

      return res.status(200).json({
        'data': {
          'attributes': {
            'apr-actual': monthReports[3].expenseSum[0].get('amount_cents') - monthReports[3].expenseSum[0].get('reimbursed_cents'),
            'apr-budget': monthReports[3].budget ? monthReports[3].budget.get('amount_cents') : 0,
            'aug-actual': monthReports[7].expenseSum[0].get('amount_cents') - monthReports[7].expenseSum[0].get('reimbursed_cents'),
            'aug-budget': monthReports[7].budget ? monthReports[7].budget.get('amount_cents') : 0,
            'dec-actual': monthReports[11].expenseSum[0].get('amount_cents') - monthReports[11].expenseSum[0].get('reimbursed_cents'),
            'dec-budget': monthReports[11].budget ? monthReports[11].budget.get('amount_cents') : 0,
            'feb-actual': monthReports[1].expenseSum[0].get('amount_cents') - monthReports[1].expenseSum[0].get('reimbursed_cents'),
            'feb-budget': monthReports[1].budget ? monthReports[1].budget.get('amount_cents') : 0,
            'has-next-year': hasNextYear,
            'has-previous-year': hasPrevYear,
            'jan-actual': monthReports[0].expenseSum[0].get('amount_cents') - monthReports[0].expenseSum[0].get('reimbursed_cents'),
            'jan-budget': monthReports[0].budget ? monthReports[0].budget.get('amount_cents') : 0,
            'jul-actual': monthReports[6].expenseSum[0].get('amount_cents') - monthReports[6].expenseSum[0].get('reimbursed_cents'),
            'jul-budget': monthReports[6].budget ? monthReports[6].budget.get('amount_cents') : 0,
            'jun-actual': monthReports[5].expenseSum[0].get('amount_cents') - monthReports[5].expenseSum[0].get('reimbursed_cents'),
            'jun-budget': monthReports[5].budget ? monthReports[5].budget.get('amount_cents') : 0,
            'mar-actual': monthReports[2].expenseSum[0].get('amount_cents') - monthReports[2].expenseSum[0].get('reimbursed_cents'),
            'mar-budget': monthReports[2].budget ? monthReports[2].budget.get('amount_cents') : 0,
            'may-actual': monthReports[4].expenseSum[0].get('amount_cents') - monthReports[4].expenseSum[0].get('reimbursed_cents'),
            'may-budget': monthReports[4].budget ? monthReports[4].budget.get('amount_cents') : 0,
            'nov-actual': monthReports[10].expenseSum[0].get('amount_cents') - monthReports[10].expenseSum[0].get('reimbursed_cents'),
            'nov-budget': monthReports[10].budget ? monthReports[10].budget.get('amount_cents') : 0,
            'oct-actual': monthReports[9].expenseSum[0].get('amount_cents') - monthReports[9].expenseSum[0].get('reimbursed_cents'),
            'oct-budget': monthReports[9].budget ? monthReports[9].budget.get('amount_cents') : 0,
            'sep-actual': monthReports[8].expenseSum[0].get('amount_cents') - monthReports[8].expenseSum[0].get('reimbursed_cents'),
            'sep-budget': monthReports[8].budget ? monthReports[8].budget.get('amount_cents') : 0,
            'year': year,
          },
          'id': `${subcategory.get('uuid')}-${year}`,
          'type': 'subcategory-annual-reports',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
