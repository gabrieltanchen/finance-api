import addUserToHousehold from './add-user-to-household.js';
import getToken from './get-token.js';
import loginWithPassword from './login-with-password.js';
import loginWithToken from './login-with-token.js';
import signUp from './sign-up.js';
import updateUserDetails from './update-user-details.js';

export default class UserCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
    this.jwtAlgorithm = 'HS256';
    this.hashParams = {
      N: 16384,
      r: 8,
      p: 1,
    };
    this.tokenExpiresIn = 7200;
  }

  async addUserToHousehold(params) {
    return addUserToHousehold({
      ...params,
      userCtrl: this,
    });
  }

  async getToken(userUuid) {
    return getToken({
      userCtrl: this,
      userUuid,
    });
  }

  async loginWithPassword({
    email,
    password,
  }) {
    return loginWithPassword({
      email,
      password,
      userCtrl: this,
    });
  }

  async loginWithToken(token) {
    return loginWithToken({
      token,
      userCtrl: this,
    });
  }

  /**
   * @param {string} auditApiCallUuid
   * @param {string} email
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} password
   */
  async signUp({
    auditApiCallUuid,
    email,
    firstName,
    lastName,
    password,
  }) {
    return signUp({
      auditApiCallUuid,
      email,
      firstName,
      lastName,
      password,
      userCtrl: this,
    });
  }

  async updateUserDetails(params) {
    return updateUserDetails({
      ...params,
      userCtrl: this,
    });
  }
}
