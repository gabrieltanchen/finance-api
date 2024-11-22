import ApiCall from './api-call.js';
import Change from './change.js';
import Log from './log.js';

export default (sequelize) => {
  return {
    ApiCall: ApiCall(sequelize),
    Change: Change(sequelize),
    Log: Log(sequelize),
  };
};
