const sudokus = [];

function generate_sudoku(gaps_seed) {
	const sudoku = [[], [], [], [], [], [], [], [], []];

	// dummy code to test the render
	let nums =
		"004300209005009001070060043006002087190007400050083000600000105003508690042910300"; // 46 gaps

	// nums = "653465465730008300029000200000882600005043003260020030000070040306000910100006022"; //solved // 43 gaps
	// nums = "079206002001677180000000260403320006000094007080002890008003000030000600050701508"; solved :limit40 // 47 gaps
	// nums = "254003000085010200000000600800005088700000373000030000000700000009000000020400000"; // not solved // written row wise // 59 gaps

	// nums =
	// 	"000000082000301600097008050060500003908000405400009010020900530006203000340000000"; // sudoku of the day https://www.sudokuwiki.org/Daily_Sudoku
	let gaps = 0;
	for (let i = 0; i < 81; i++) {
		sudoku[Math.floor(i / 9)][i % 9] = nums[i];
		if (nums[i] == 0) {
			gaps++;
		}
	}

	document.writeln(gaps);
	return sudoku;
}

let sudoku = generate_sudoku();
// [
// 	["0", "0", "0", "0", "0", "0", "0", "8", "2"],
// 	["0", "0", "0", "3", "0", "1", "6", "0", "0"],
// 	["0", "9", "7", "0", "0", "8", "0", "5", "0"],
// 	["0", "6", "2", "5", "0", "0", "0", "0", "3"],
// 	["9", "0", "8", "0", "0", "0", "4", "0", "5"],
// 	["4", "0", "0", "0", "0", "9", "0", "1", "0"],
// 	["0", "2", "1", "9", "0", "0", "5", "3", "0"],
// 	["0", "0", "6", "2", "0", "3", "0", "0", "0"],
// 	["3", "4", "0", "0", "0", "0", "0", "0", "0"],
// ];
const solved = [];
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

(function setup() {
	render = new Render(100, height - 100, ctx, sudoku, 10);
	render.renderBox();
	render.renderValues();

	solver = new Solver();
	solver.SetSudoku(sudoku);
	solver.analyse();
	setTimeout(function () {
		console.table(solver.missingCoordinates);
	}, 100);
	solver.solve();
})();

document.addEventListener("click", () => render.renderValues(true));

function gen_sudo(seed /* seed means the no of cells to fill */) {
	const sudoku = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
	];

	for (let i = 0; i < seed; ++i) {
		// initialise coordinates;
		const coor = { x: random9(), y: random9() };
		while (sudoku[coor.y][coor.x]) {
			coor.x = random9();
			coor.y = random9();
			continue;
		}
		//
		const sudo = new Solver();
		sudo.SetSudoku(sudoku);
		// const {rows, cols} = sudo;
		// const grid = sudo.boxes;
		// if (i > seed/2) {
		//     console.table({rows, cols, grid})
		//     debugger;
		// }

		// gen digit
		const digit = random9() + 1; // digits range from 1-9 but random9() ranges from 0-8

		// now before assignment we have to check that putting this val doesnt break the sudoku
		// meaning that the sudoku is still valid
		const row = sudo.rows[coor.y];
		const col = sudo.cols[coor.x];
		const grid = sudo.findGrid([coor.x, coor.y]);

		// console.table({row, col, grid})
		// debugger;

		if (
			row.includes(`${digit}`) ||
			col.includes(`${digit}`) ||
			grid.includes(`${digit}`)
		)
			continue;

		sudoku[coor.y][coor.x] = digit;
	}

	return sudoku;

	function random9() {
		return Math.floor(Math.random() * 9);
	}
}

function test() {
	for (let i = 0; i < 10; ++i) {
		let out = gen_sudo(26);
		// (out) ? console.log(out) : null;
		// sudoku = out; // fuck lol
	}
}

// test();

// try executing setup() code on the randomly generated sudokus;
// newly gen sudokus not getting solved because the value of Solver properties reamins the same
