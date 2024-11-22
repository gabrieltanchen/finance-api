import nconf from 'nconf';
import Sequelize from 'sequelize';

import Attachment from './attachment.js';
import Audit from './audit/index.js';
import Budget from './budget.js';
import Category from './category.js';
import Deposit from './deposit.js';
import Employer from './employer.js';
import Expense from './expense.js';
import Fund from './fund.js';
import Hash from './hash.js';
import Household from './household.js';
import HouseholdMember from './household-member.js';
import Income from './income.js';
import Loan from './loan.js';
import LoanPayment from './loan-payment.js';
import Subcategory from './subcategory.js';
import User from './user.js';
import UserLogin from './user-login.js';
import Vendor from './vendor.js';

export default class Models {
  constructor(databaseUrl) {
    let logging = console.log; // eslint-disable-line no-console
    if (nconf.get('NODE_ENV') === 'test') {
      logging = null;
    }
    this.sequelize = new Sequelize(databaseUrl, {
      define: {
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
      },
      dialect: 'postgres',
      logging,
      pool: {
        idle: 10000,
        max: 5,
        min: 0,
      },
    });

    this.Attachment = Attachment(this.sequelize);
    this.Audit = Audit(this.sequelize);
    this.Budget = Budget(this.sequelize);
    this.Category = Category(this.sequelize);
    this.Deposit = Deposit(this.sequelize);
    this.Employer = Employer(this.sequelize);
    this.Expense = Expense(this.sequelize);
    this.Fund = Fund(this.sequelize);
    this.Hash = Hash(this.sequelize);
    this.Household = Household(this.sequelize);
    this.HouseholdMember = HouseholdMember(this.sequelize);
    this.Income = Income(this.sequelize);
    this.Loan = Loan(this.sequelize);
    this.LoanPayment = LoanPayment(this.sequelize);
    this.Subcategory = Subcategory(this.sequelize);
    this.User = User(this.sequelize);
    this.UserLogin = UserLogin(this.sequelize);
    this.Vendor = Vendor(this.sequelize);

    // Attachment
    this.Attachment.belongsTo(this.Expense, {
      foreignKey: 'entity_uuid',
      constraints: false,
      as: 'Expense',
    });

    // Audit.ApiCall
    this.Audit.ApiCall.hasOne(this.Audit.Log, {
      foreignKey: 'audit_api_call_uuid',
    });
    this.Audit.ApiCall.belongsTo(this.User, {
      foreignKey: 'user_uuid',
    });

    // Audit.Change
    this.Audit.Change.belongsTo(this.Audit.Log, {
      foreignKey: 'audit_log_uuid',
    });

    // Audit.Log
    this.Audit.Log.belongsTo(this.Audit.ApiCall, {
      foreignKey: 'audit_api_call_uuid',
    });
    this.Audit.Log.hasMany(this.Audit.Change, {
      foreignKey: 'audit_log_uuid',
    });

    // Budget
    this.Budget.belongsTo(this.Subcategory, {
      foreignKey: 'subcategory_uuid',
    });

    // Category
    this.Category.hasMany(this.Subcategory, {
      foreignKey: 'category_uuid',
    });
    this.Category.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });

    // Deposit
    this.Deposit.belongsTo(this.Fund, {
      foreignKey: 'fund_uuid',
    });

    // Employer
    this.Employer.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
    this.Employer.hasMany(this.Income, {
      foreignKey: 'employer_uuid',
    });

    // Expense
    this.Expense.hasMany(this.Attachment, {
      foreignKey: 'entity_uuid',
      constraints: false,
      scope: {
        entity_type: 'expense',
      },
    });
    this.Expense.belongsTo(this.Fund, {
      foreignKey: 'fund_uuid',
    });
    this.Expense.belongsTo(this.HouseholdMember, {
      foreignKey: 'household_member_uuid',
    });
    this.Expense.belongsTo(this.Subcategory, {
      foreignKey: 'subcategory_uuid',
    });
    this.Expense.belongsTo(this.Vendor, {
      foreignKey: 'vendor_uuid',
    });

    // Fund
    this.Fund.hasMany(this.Deposit, {
      foreignKey: 'fund_uuid',
    });
    this.Fund.hasMany(this.Expense, {
      foreignKey: 'fund_uuid',
    });
    this.Fund.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });

    // Household
    this.Household.hasMany(this.Category, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Employer, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Fund, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.HouseholdMember, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Loan, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.User, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Vendor, {
      foreignKey: 'household_uuid',
    });

    // HouseholdMember
    this.HouseholdMember.hasMany(this.Expense, {
      foreignKey: 'household_member_uuid',
    });
    this.HouseholdMember.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
    this.HouseholdMember.hasMany(this.Income, {
      foreignKey: 'household_member_uuid',
    });

    // Income
    this.Income.belongsTo(this.Employer, {
      foreignKey: 'employer_uuid',
    });
    this.Income.belongsTo(this.HouseholdMember, {
      foreignKey: 'household_member_uuid',
    });

    // Loan
    this.Loan.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
    this.Loan.hasMany(this.LoanPayment, {
      foreignKey: 'loan_uuid',
    });

    // LoanPayment
    this.LoanPayment.belongsTo(this.Loan, {
      foreignKey: 'loan_uuid',
    });

    // Subcategory
    this.Subcategory.hasMany(this.Budget, {
      foreignKey: 'subcategory_uuid',
    });
    this.Subcategory.belongsTo(this.Category, {
      foreignKey: 'category_uuid',
    });
    this.Subcategory.hasMany(this.Expense, {
      foreignKey: 'subcategory_uuid',
    });

    // User
    this.User.hasMany(this.Audit.ApiCall, {
      foreignKey: 'user_uuid',
    });
    this.User.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
    this.User.hasOne(this.UserLogin, {
      foreignKey: 'user_uuid',
    });

    // UserLogin
    this.UserLogin.belongsTo(this.User, {
      foreignKey: 'user_uuid',
    });

    // Vendor
    this.Vendor.hasMany(this.Expense, {
      foreignKey: 'vendor_uuid',
    });
    this.Vendor.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
  }
}
