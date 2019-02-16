const Endpoint = require("../../model/Endpoint");

const MethodType = require("../../model/MethodType");

// DELETE /auth/logout
module.exports = class extends Endpoint {
	constructor(server) {
		super(server, MethodType.DELETE, "/auth/logout");

		this.isProtected = true;
		this.on("execute", (req, res, next) => this.onExecute(req, res).catch(next));
	}
	
	async onExecute(req, res) {
		await this.server.db.query(/*sql*/`
			UPDATE xysession
			   SET removed_on = NOW()
			 WHERE token = $1;
		`, [req.headers.authentication]);

		res.json({
			success: true,
			data:    null
		});
	}
};
