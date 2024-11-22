export class AttachmentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AttachmentError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'No open queries':
      return {
        message: 'Expense ID is required.',
        status: 403,
      };
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
};
