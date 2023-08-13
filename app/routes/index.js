const express = require('express');

const attachments = require('./attachments');
const budgetReports = require('./budget-reports');
const budgets = require('./budgets');
const categories = require('./categories');
const deposits = require('./deposits');
const expenses = require('./expenses');
const funds = require('./funds');
const householdMembers = require('./household-members');
const households = require('./households');
const incomes = require('./incomes');
const loans = require('./loans');
const monthlyReports = require('./monthly-reports');
const subcategories = require('./subcategories');
const subcategoryAnnualReports = require('./subcategory-annual-reports');
const users = require('./users');
const vendors = require('./vendors');

module.exports = (app) => {
  app.use('/attachments', attachments(express.Router(), app));
  app.use('/budget-reports', budgetReports(express.Router(), app));
  app.use('/budgets', budgets(express.Router(), app));
  app.use('/categories', categories(express.Router(), app));
  app.use('/deposits', deposits(express.Router(), app));
  app.use('/expenses', expenses(express.Router(), app));
  app.use('/funds', funds(express.Router(), app));
  app.use('/household-members', householdMembers(express.Router(), app));
  app.use('/households', households(express.Router(), app));
  app.use('/incomes', incomes(express.Router(), app));
  app.use('/loans', loans(express.Router(), app));
  app.use('/monthly-reports', monthlyReports(express.Router(), app));
  app.use('/subcategories', subcategories(express.Router(), app));
  app.use('/subcategory-annual-reports', subcategoryAnnualReports(express.Router(), app));
  app.use('/users', users(express.Router(), app));
  app.use('/vendors', vendors(express.Router(), app));
};
