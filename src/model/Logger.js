const { EventEmitter } = require("events");
const Chalk = require("chalk");

const ColorType = require("./ColorType");

class Logger extends EventEmitter {
	constructor() {
		super();

		// Tamanho do nome do tipo do log para padronizar o tamanho de tudo entre []'s no console
		this._normaliseTo = 0;
	}

	addLoggingType(name, color = ColorType.WHITE) {
		this._normaliseTo = Math.max(this._normaliseTo, name.length);

		this[name.toLowerCase()] = function(rawMessage) {
			const   now = new Date();
			let prepend = name.toUpperCase(),
				message = "";

			while(prepend.length < this._normaliseTo)
				prepend += " ";
			
			prepend = `[${prepend} ${now.toISOString()}] `;
			message = prepend + rawMessage + "\n";

			process.stdout.write(Chalk[color](message));
		};
	}
}

module.exports = Logger;
