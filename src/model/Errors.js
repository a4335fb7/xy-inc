class ServiceError extends Error {
	constructor(message) {
		super(message || "Internal server error");

		this.code = 500;
		this.stringCode = "INTERNAL_ERROR";
	}
}

class InternalServerError extends ServiceError {}

class InvalidRequestError extends ServiceError {
	constructor(message) {
		super(message || "Invalid request");

		this.code = 400;
		this.stringCode = "INVALID_REQUEST";
	}
}
class UnauthorizedError extends ServiceError {
	constructor(message) {
		super(message || "Invalid authentication, make sure to login before using this resource");

		this.code = 401;
		this.stringCode = "UNAUTHORIZED";
	}
}

class UnprocessableEntityError extends ServiceError {
	constructor(message) {
		super(message || "Unprocessable entity");

		this.code = 422;
		this.stringCode = "UNPROCESSABLE_ENTITY";
	}
}

module.exports = { ServiceError, InternalServerError, InvalidRequestError, UnauthorizedError, UnprocessableEntityError };
