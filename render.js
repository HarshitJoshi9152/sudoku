// TODO ::
/*  implement the FONTSIZE functionality
    figure out a better way to add padding to the boxes

    i think we should implement a better way to specify the location and size of the sudoku
    
*/
class Render {
	constructor(s, e, ctx, sudokuMap) {
		this.sudokuMap = sudokuMap;
		this.unit = (e - s) / 9;
		(this.x = s), (this.y = s);
		(this.endingX = e), (this.endingY = e);
		this.ctx = ctx;
		this.digitPadding = this.unit / 2;
		this.fontSize;
	}

	renderBox = function () {
		// draw the sudoku box
		let x = this.x,
			y = this.y;

		for (let i = 0; i < 10; i++) {
			// console.log("weird behaviour", y, this.ctx.lineWidth, this.ctx.lineCap)
			// paths
			this.ctx.beginPath();
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(this.x + this.unit * 9, y);
			this.ctx.stroke();
			this.ctx.closePath();
			y += this.unit;
		}

		(x = this.x), (y = this.y);
		for (let i = 0; i < 10; i++) {
			// console.log("weird behaviour", y, this.ctx.lineWidth, this.ctx.lineCap)
			// paths
			this.ctx.beginPath();
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(x, this.y + this.unit * 9);
			this.ctx.stroke();
			this.ctx.closePath();
			x += this.unit;
		}
	};

	renderValues = function (edit) {
		// code to display the sudoku
		for (let i = 0; i < this.sudokuMap.length; i++) {
			for (let j = 0; j < this.sudokuMap[i].length; j++) {
				const elm = this.sudokuMap[i][j];
				this.renderValueInPlace(
					elm,
					{
						x: j,
						y: i,
					},
					edit
				);
			}
		}
	};

	renderValueInPlace = function (val, { x: x, y: y }, edit = false) {
		// todo fix the overclearing error execute: render.renderValueInPlace("$",{x:5,y:0}, true)

		this.ctx.font = "15px sans-serif";
		this.ctx.fillText(
			`${x},${y}`,
			this.x + this.unit * x,
			this.y + this.unit * y
		);

		val = val == 0 ? "x" : val;

		x = this.x + this.unit * x;
		y = this.y + this.unit * y;

		edit == true
			? this.ctx.clearRect(
					x + this.ctx.lineWidth,
					y + this.ctx.lineWidth,
					this.unit - this.ctx.lineWidth,
					this.unit - this.ctx.lineWidth
			  )
			: null;

		x += this.digitPadding - this.digitPadding / 3;
		y += this.digitPadding + this.digitPadding / 4 + this.digitPadding / 12;

		this.ctx.font = "20px sans-serif";
		this.ctx.fillText(val, x, y);
		this.renderBox();
	};
}
