module.exports = class AttachmentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AttachmentError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find attachment.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
}
