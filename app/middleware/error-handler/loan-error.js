module.exports = class LoanError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoanError';
  }

  getApiResponse() {
    const message = this.message;
    switch(message) {
    case 'Not found':
      return {
        message: 'Unable to find loan.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};
