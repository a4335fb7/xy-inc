const settings = require("../settings");
const Server = require("./Server.js");

const server = new Server(settings);
server.on("ready", () => server.info(`Server started on port ${server.port}`));
