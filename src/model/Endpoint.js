const { EventEmitter } = require("events");
const fs = require("fs");

const { UnauthorizedError } = require("./Errors");

class Endpoint extends EventEmitter {
	constructor(server, method, service) {
		super();

		this.server  = server;
		this.method  = method;
		this.service = service;
		// true sss o usuário deve estar logado para usar
		this.isProtected = false;

		this.server.app[this.method](this.service, async (req, res, next) => {
			if(this.isProtected) {
				try {
					let token = req.headers.authentication;
					if(!token) // Sem header Authentication
						throw new UnauthorizedError();

					token = token.toString();
					if(token.length !== 64) // Token inválido
						throw new UnauthorizedError();

					const result = await this.server.db.query(/*sql*/`
						SELECT
							xyuser
						FROM
							xysession
						WHERE
							token = $1 AND
							removed_on IS NULL
						;
					`, [token]);

					if(result.rowCount === 0)
						throw new UnauthorizedError(); // Token inexistente ou expirado

					// Setando xyuser no request para não usar nos endpoints, se necessário
					req.xyuser = result.rows[0].xyuser;
				} catch (e) {
					next(e); // Mandando erro pro errorHandler definido em Server.js
					return;
				}
			}

			this.emit("execute", req, res, next);
		});
	}

	static loadEndpoints(server) {
		const path = __dirname + "/../controller/endpoints";

		let endpoints = fs.readdirSync(path);
		endpoints = endpoints.map(e => require(`${path}/${e}`));
		endpoints = endpoints.map(e => new e(server));

		server.endpoints.push(...endpoints);
	}
}

module.exports = Endpoint;
