class MethodType {
	constructor(name) {
		this.name = name;
	}

	toString() {
		return this.name;
	}

	valueOf() {
		return this.name;
	}
}

MethodType.GET    = new MethodType("get");
MethodType.POST   = new MethodType("post");
MethodType.PUT    = new MethodType("put");
MethodType.DELETE = new MethodType("delete");
MethodType.PATCH  = new MethodType("patch");

module.exports = MethodType;
