const Endpoint = require("../../model/Endpoint");
const { InvalidRequestError } = require("../../model/Errors");

const MethodType = require("../../model/MethodType");

// GET /poi/find
module.exports = class extends Endpoint {
	constructor(server) {
		super(server, MethodType.GET, "/pois?/find");

		this.on("execute", (req, res, next) => this.onExecute(req, res).catch(next));
	}
	
	validateRequest(req) {
		if(!("query" in req))
			throw new InvalidRequestError("Request query string not present");

		if(!("x" in req.query && "y" in req.query && "d" in req.query))
			throw new InvalidRequestError("Query fields are missing");

		if(isNaN(req.query.x) || isNaN(req.query.y) || isNaN(req.query.d))
			throw new InvalidRequestError("Coordinates must be numbers");
		
		const payload = {
			x: Math.round(Number(req.query.x)),
			y: Math.round(Number(req.query.y)),
			d: Math.round(Number(req.query.d))
		};

		if(payload.x === -Infinity || payload.x === Infinity ||
				payload.y === -Infinity || payload.y === Infinity ||
				payload.d <= 0)
			throw new InvalidRequestError("Coordinates must be finite integers");
		
		return payload;
	}
	
	async onExecute(req, res) {
		const payload = this.validateRequest(req);
		const { x, y, d } = payload;

		/*
		 * A solução trivial para esse problema seria mandar para o banco direto
		 * a equação para os pontos a `d` metros de (`x`, `y`), contudo, não é
		 * otimizada.
		 * 
		 * Usando um índice de BTREE no banco nos camos coord_x e coord_y é
		 * eficiente selecionar intervalos, diferente de indices HASH onde a busca
		 * em intervalos continuaria linear
		 * 
		 * Com isso em mente, estou selecionando os pontos em um quadrado de lado
		 * `2*d` centralizado em (`x`, `y`) e filtrando no próprio servidor a resposta
		 * para incluir somente aqueles que estão num raio de `d` metros de (`x`, `y`)
		 */

		let xM, xm, yM, ym;
		xm = Math.max(x - d, 0);
		xM = Math.min(x + d, 2147483647);
		ym = Math.max(y - d, 0);
		yM = Math.min(y + d, 2147483647);

		const dSq = d*d;

		const { rows } = await this.server.db.query(/*sql*/`
			SELECT
				name,
				coord_x AS x,
				coord_y AS y
			FROM
				poi
			WHERE
				coord_x BETWEEN $1 AND $2 AND
				coord_y BETWEEN $3 AND $4
			;
		`, [xm, xM, ym, yM]);
		
		const pois = rows.filter(p => (p.x - x)**2 + (p.y - y)**2 < dSq);

		res.json({
			success: true,
			data: pois
		});
	}
};
