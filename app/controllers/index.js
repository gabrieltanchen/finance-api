import AttachmentCtrl from './attachment-ctrl/index.js';
import AuditCtrl from './audit-ctrl/index.js';
import BudgetCtrl from './budget-ctrl/index.js';
import CategoryCtrl from './category-ctrl/index.js';
import EmployerCtrl from './employer-ctrl/index.js';
import ExpenseCtrl from './expense-ctrl/index.js';
import FundCtrl from './fund-ctrl/index.js';
import HouseholdCtrl from './household-ctrl/index.js';
import IncomeCtrl from './income-ctrl/index.js';
import LoanCtrl from './loan-ctrl/index.js';
import UserCtrl from './user-ctrl/index.js';
import VendorCtrl from './vendor-ctrl/index.js';

export default class Controllers {
  constructor(models) {
    this.models = models;

    this.AttachmentCtrl = new AttachmentCtrl(this, models);
    this.AuditCtrl = new AuditCtrl(this, models);
    this.BudgetCtrl = new BudgetCtrl(this, models);
    this.CategoryCtrl = new CategoryCtrl(this, models);
    this.EmployerCtrl = new EmployerCtrl(this, models);
    this.ExpenseCtrl = new ExpenseCtrl(this, models);
    this.FundCtrl = new FundCtrl(this, models);
    this.HouseholdCtrl = new HouseholdCtrl(this, models);
    this.IncomeCtrl = new IncomeCtrl(this, models);
    this.LoanCtrl = new LoanCtrl(this, models);
    this.UserCtrl = new UserCtrl(this, models);
    this.VendorCtrl = new VendorCtrl(this, models);
  }
}
