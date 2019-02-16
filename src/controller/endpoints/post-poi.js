const Endpoint = require("../../model/Endpoint");
const { InvalidRequestError, UnprocessableEntityError } = require("../../model/Errors");

const MethodType = require("../../model/MethodType");
const DatabaseErrorType = require("../../model/DatabaseErrorType");

// POST /poi
module.exports = class extends Endpoint {
	constructor(server) {
		super(server, MethodType.POST, "/pois?");

		this.isProtected = true;
		this.on("execute", (req, res, next) => this.onExecute(req, res).catch(next));
	}
	
	validateRequest(req) {
		if(!("body" in req))
			throw new InvalidRequestError("Request body not present");

		if(!("name" in req.body && "x" in req.body && "y" in req.body))
			throw new InvalidRequestError("Body fields are missing");

		if(isNaN(req.body.x) || isNaN(req.body.y))
			throw new InvalidRequestError("Coordinates must be numbers");
		
		const payload = {
			name: req.body.name.toString(),
			x:    Math.round(Number(req.body.x)),
			y:    Math.round(Number(req.body.y))
		};

		if(payload.name.length < 2 || payload.name.length > 128)
			throw new InvalidRequestError("A POI name must be between 2 and 128 chars long");
		
		if(payload.x < 0 || payload.x > 2147483647 || payload.y < 0 || payload.y > 2147483647)
			throw new InvalidRequestError("Coordinates must be finite positive integers");
		
		return payload;
	}
	
	async onExecute(req, res) {
		const payload = this.validateRequest(req);
		const { name, x, y } = payload;

		try {
			await this.server.db.query(/*sql*/`
				INSERT INTO
					poi (coord_x, coord_y, name, added_by)
				VALUES
					($1, $2, $3, 'admin')
				;
			`, [x, y, name]);
		} catch (e) {
			if(e.code == DatabaseErrorType.DUPLICATE_KEY.code)
				throw new UnprocessableEntityError("POI already exists");
			
			// Reemitindo outros erros
			throw e;
		}

		this.server.info(`Added a new POI named ${name}`);
		res.status(201).json({
			success: true,
			data: payload
		});
	}
};
