export class ValidatorError extends Error {
  constructor(errors) {
    super();
    this.errors = errors;
  }

  get message() {
    return this.errors;
  }

  get name() {
    return "ValidatorError";
  }
}
