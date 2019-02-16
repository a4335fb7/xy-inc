const express = require("express");
const bodyParser = require("body-parser");

const Logger    = require("./model/Logger");
const ColorType = require("./model/ColorType");
const Endpoint  = require("./model/Endpoint");
const Database  = require("./model/Database");
const { ServiceError } = require("./model/Errors");

class Server extends Logger {
	constructor(settings) {
		super();

		this._port     = settings.port;
		this.app       = express();
		this.db        = new Database();
		this.endpoints = [];

		this.addLoggingType("info");
		this.addLoggingType("warn",  ColorType.YELLOW);
		this.addLoggingType("error", ColorType.RED);

		this.app.use(bodyParser.json());
		Endpoint.loadEndpoints(this);
		this.app.use(this.errorHandler.bind(this));
		this.app.listen(this.port, () => this.emit("ready"));

		this.db.on("connect", () => this.info("Connected to the database"));
		this.db.on("connectionError", e => {
			this.error("!!!FATAL ERROR!!!");
			this.error("Couldn't connect to the database, make sure to set the environment vars PGUSER, PGHOST, PGPASSWORD, PGDATABASE and PGPORT");
			this.error(e.stack);
			process.exit(1);
		});
	}

	get port() {
		return this._port;
	}
	set port(_) {
		throw new Error("Port can't be changed while the server is running");
	}

	/**
	 * Error handler middleware
	 */
	errorHandler(err, req, res, next) {
		// Erro emitido pelo endpoint para ser enviado ao usuário
		if(err instanceof ServiceError) {
			res.status(err.code).json({
				success: false,
				error: {
					code: err.stringCode,
					message: err.message
				}
			});
		}else{ // Erro inesperado
			this.error(`Unhandled error on '${req.url}':\n${err.stack}`);

			res.status(500).json({
				success: false,
				error: {
					code:    "INTERNAL_ERROR",
					message: "Internal server error"
				}
			});
		}

		next();
	}
}

module.exports = Server;
