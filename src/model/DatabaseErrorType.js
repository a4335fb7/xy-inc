class DatabaseErrorType {
	constructor(code) {
		this.code = code;
	}

	toString() {
		return this.code;
	}

	valueOf() {
		return this.code;
	}
}

DatabaseErrorType.DUPLICATE_KEY = new DatabaseErrorType(23505);

module.exports = DatabaseErrorType;
