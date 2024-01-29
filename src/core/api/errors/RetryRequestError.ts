export default class RetryRequestError extends Error {
  status: number;

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.status = 429;
  }
}
