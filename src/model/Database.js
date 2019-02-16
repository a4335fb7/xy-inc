const { EventEmitter } = require("events");
const { Client } = require("pg");

class Database extends EventEmitter {
	constructor() {
		super();
		this.init(); // Deferindo a inicialização porque ela é assíncrona
	}

	async init() {
		this.client = new Client();
		
		try {
			await this.client.connect();
		} catch(e) {
			this.emit("connectionError", e);
		}
		this.emit("connect");
	}

	query(...params) {
		return this.client.query(...params);
	}
}

module.exports = Database;
