const crypto = require("crypto");

const Endpoint = require("../../model/Endpoint");
const { InvalidRequestError, UnauthorizedError } = require("../../model/Errors");

const MethodType = require("../../model/MethodType");

const TOKEN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// POST /auth/token
module.exports = class extends Endpoint {
	constructor(server) {
		super(server, MethodType.POST, "/auth/token");

		this.on("execute", (req, res, next) => this.onExecute(req, res).catch(next));
	}
	
	validateRequest(req) {
		if(!("body" in req))
			throw new InvalidRequestError("Request body not present");

		if(!("username" in req.body && "password" in req.body))
			throw new InvalidRequestError("Body fields are missing");
		
		const payload = {
			username: req.body.username.toString().toLowerCase(),
			password: req.body.password.toString()
		};

		if(payload.username.length < 4 || payload.username.length > 21)
			throw new UnauthorizedError("Username and password don't match");
		if(payload.password.length < 4 || payload.password.length > 1024)
			throw new UnauthorizedError("Username and password don't match");
		
		return payload;
	}

	generateToken(size) {
		let token = "";

		while(token.length < size)
			token += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)];

		return token;
	}

	async onExecute(req, res) {
		const { username, password } = this.validateRequest(req);

		// Hash da senha
		const hash = crypto
			.createHash("sha1")
			.update(password)
			.digest("hex");

		const result = await this.server.db.query(/*sql*/`
			SELECT NULL FROM
				xyuser
			WHERE
				username = $1 AND
				password = $2
			;
		`, [username, hash]);
		
		if(result.rowCount === 0)
			throw new UnauthorizedError("Username and password don't match");

		const token = this.generateToken(64);

		await this.server.db.query(/*sql*/`
			INSERT INTO
				xysession (token, xyuser)
			VALUES
				($1, $2)
			;
		`, [token, username]);

		this.server.info(`User '${username}' joined`);
		res.status(201).json({
			success: true,
			data: token
		});
	}
};
