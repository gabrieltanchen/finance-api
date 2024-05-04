module.exports = class EmployerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmployerError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find employer.',
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
