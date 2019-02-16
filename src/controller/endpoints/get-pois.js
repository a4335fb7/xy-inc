const Endpoint = require("../../model/Endpoint");

const MethodType = require("../../model/MethodType");

// GET /poi
module.exports = class extends Endpoint {
	constructor(server) {
		super(server, MethodType.GET, "/pois?");

		this.on("execute", (req, res, next) => this.onExecute(req, res).catch(next));
	}
	
	async onExecute(_req, res) {
		const pois = await this.server.db.query(/*sql*/`
			SELECT
				name,
				coord_x AS x,
				coord_y AS y
			FROM
				poi
			;
		`);

		res.json({
			success: true,
			data: pois.rows
		});
	}
};
