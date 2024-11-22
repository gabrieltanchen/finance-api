import { validationResult } from 'express-validator';
import _ from 'lodash';

export default class Validator {
  validateRequest() {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: _.map(errors.array(), (error) => {
            return {
              source: {
                pointer: `/${error.path.replace(/\./g, '/')}`,
              },
              detail: error.msg,
            };
          }),
        });
      }
      return next();
    };
  }
}
