import express from 'express';

import attachments from './attachments/index.js';
import budgetReports from './budget-reports/index.js';
import budgets from './budgets/index.js';
import categories from './categories/index.js';
import deposits from './deposits/index.js';
import employers from './employers/index.js';
import expenses from './expenses/index.js';
import funds from './funds/index.js';
import householdMembers from './household-members/index.js';
import households from './households/index.js';
import incomes from './incomes/index.js';
import loanPayments from './loan-payments/index.js';
import loans from './loans/index.js';
import monthlyReports from './monthly-reports/index.js';
import subcategories from './subcategories/index.js';
import subcategoryAnnualReports from './subcategory-annual-reports/index.js';
import users from './users/index.js';
import vendors from './vendors/index.js';

export default (app) => {
  app.use('/attachments', attachments(express.Router(), app));
  app.use('/budget-reports', budgetReports(express.Router(), app));
  app.use('/budgets', budgets(express.Router(), app));
  app.use('/categories', categories(express.Router(), app));
  app.use('/deposits', deposits(express.Router(), app));
  app.use('/employers', employers(express.Router(), app));
  app.use('/expenses', expenses(express.Router(), app));
  app.use('/funds', funds(express.Router(), app));
  app.use('/household-members', householdMembers(express.Router(), app));
  app.use('/households', households(express.Router(), app));
  app.use('/incomes', incomes(express.Router(), app));
  app.use('/loan-payments', loanPayments(express.Router(), app));
  app.use('/loans', loans(express.Router(), app));
  app.use('/monthly-reports', monthlyReports(express.Router(), app));
  app.use('/subcategories', subcategories(express.Router(), app));
  app.use('/subcategory-annual-reports', subcategoryAnnualReports(express.Router(), app));
  app.use('/users', users(express.Router(), app));
  app.use('/vendors', vendors(express.Router(), app));
};
