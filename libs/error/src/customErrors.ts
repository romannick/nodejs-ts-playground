export class CustomError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
    Error.captureStackTrace(this)
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(`Validation Error: ${message}`, 400)
  }
}
