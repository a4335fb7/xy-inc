class ColorType {
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

ColorType.BOLD       = new ColorType("bold");
ColorType.DIM        = new ColorType("dim");
ColorType.ITALIC     = new ColorType("italic");
ColorType.UNDERLINE  = new ColorType("underline");
ColorType.INVERSE    = new ColorType("inverse");
ColorType.STRIKETHROUGH = new ColorType("strikethrough");
ColorType.BLACK      = new ColorType("black");
ColorType.RED        = new ColorType("red");
ColorType.GREEN      = new ColorType("green");
ColorType.YELLOW     = new ColorType("yellow");
ColorType.BLUE       = new ColorType("blue");
ColorType.MAGENTA    = new ColorType("magenta");
ColorType.CYAN       = new ColorType("cyan");
ColorType.WHITE      = new ColorType("white");
ColorType.GRAY       = new ColorType("gray");
ColorType.BG_BLACK   = new ColorType("bgBlack");
ColorType.BG_RED     = new ColorType("bgRed");
ColorType.BG_GREEN   = new ColorType("bgGreen");
ColorType.BG_YELLOW  = new ColorType("bgYellow");
ColorType.BG_BLUE    = new ColorType("bgBlue");
ColorType.BG_MAGENTA = new ColorType("bgMagenta");
ColorType.BG_CYAN    = new ColorType("bgCyan");
ColorType.BG_WHITE   = new ColorType("bgWhite");

module.exports = ColorType;
