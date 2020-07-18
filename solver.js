// todo Test findGrid method and code the solve method
// edit renderer.render to show coordinates to easily DONE
// generate the indexes of box values programmatically.
// ! bug is there because we are calling this.setSudoku at the end of the while loop in this.solve
// ! investigate the type of data in this.missingCoordinates and this.solutionsBuffer;
// , kisme (konsi array) nahi he yaar
class Solver {
	constructor() {
		this.sudoku;
		this.rows;
		this.cols = [[], [], [], [], [], [], [], [], []];
		this.boxes = [[], [], [], [], [], [], [], [], []];

		this.boxesCoordinates = [[], [], [], [], [], [], [], [], []];
		// contains coordinates of all the unit boxes in 9 sub-boxes in string type in [xpos,ypos] format.
		// used in findGrid method.
		this.missingCoordinates = []; // this.missingCoordinates[] has arrays in [x-pos,y-pos] pattern, but we have to interact with the sudoku array like this sudoku[y-pos][x-pos]
		this.solutionsBuffer = {};
	}

	analyse = function () {
		for (let i in this.sudoku) {
			for (let j in this.sudoku[i]) {
				const val = this.sudoku[i][j];
				if (val == 0) {
					this.missingCoordinates.push([j, i]);
					// because the followed fashion is of x-pos and then y-pos.
				}
			}
		}
	};

	getValue = (pos /* x-axis-pos, y-axis-pos */) => {
		return this.sudoku[pos[1]][pos[0]];
		// because in 2d array first y-pos is given first then x-pos is given
	};

	SetSudoku = (sudoku) => {
		this.sudoku = sudoku;
		// SETTING [ROWS]
		this.rows = sudoku;

		sudoku = sudoku.toString().replace(/,/g, "");
		// sudoku = sudoku.join("");
		/*
        sudoku.toString().replace(/,/g,"")
                "004300209005009001070060043006002087190007400050083000600000105003508690042910300"
        sudoku.join("")
                "0,0,4,3,0,0,2,0,90,0,5,0,0,9,0,0,10,7,0,0,6,0,0,4,30,0,6,0,0,2,0,8,71,9,0,0,0,7,4,0,00,5,0,0,8,3,0,0,06,0,0,0,0,0,1,0,50,0,3,5,0,8,6,9,00,4,2,9,1,0,3,0,0"
        */

		// SETTING this.cols [COLUMNS]
		for (let i in sudoku) {
			let val = sudoku[i];
			this.cols[i % 9].push(val);
		}

		// SETTING this.boxes [BOXES]
		let acc = 0;
		for (let i of this.genBoxCoors()) {
			let smallGridCoors = getRangeCoors(i[0], i[1]);
			/* if you want to get coordinates only use : this.boxes[acc].push(this.sudoku[j[1]][j[0]]);*/

			for (let j of smallGridCoors) {
				// j represents the individual box (smallest unit box) coordinates. format :  [x-pos, y-pos].
				// if (this.sudoku[j[1]][j[0]])
				// 	// !why do we have this statement; STILL WORKS AFTER REMOVING THE IF STATEMENT
				this.boxes[acc].push(this.sudoku[j[1]][j[0]]); // this.sudoku[y-pos][x-pos]
				this.boxesCoordinates[acc].push(j.toString()); // !used later by the findGrid method ? 11 times the numbers
			}
			// because in arrays we first have to mention y-val then the x-val;
			acc++;
		}
	};

	genBoxCoors = () => {
		`return [x,y] (start) -> [x,y] (end) coordinates of small boxes`;
		// this first generates the x and y values of starting cube and then the x and y values of the corresponding cube by adding 2 to both x and y values
		// i got the idea for this function by observing the pattern between the starting and ending coordinates.
		const coors = [];
		// this loop populates the coors array in a vertical fashion meaning first all the possible vertical y pos value combination with the identified x value are generated and then we move on to the next x value.
		for (let i = 0; i < 9; i++) {
			if (i % 3 == 0) {
				for (let j = 0; j < 9; j++) {
					if (j % 3 == 0) {
						coors.push([
							[i, j],
							[i + 2, j + 2],
						]);
					}
				}
			}
		}
		return coors;
	};

	solve = () => {
		const vals = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
		// while(this.missingCoordinates.length) {
		let counter = 40;
		// let solved = [];
		while (counter > 0) {
			// console.log("counter", counter);
			for (let i in this.missingCoordinates) {
				if (isNaN(i)) break; // because this.missingCoordinates also contains other values with string keys.
				const coor = this.missingCoordinates[i]; // format : [xpos, ypos]
				///////////////////////////////////////////
				const bufferProp = coor.toString();
				this.missingCoordinates[bufferProp] = i; // record index of the current coordinate identifiable by its index
				///////////////////////////////////////////

				const row = this.rows[coor[1]]; // finding the row specific to this coordinate
				const col = this.cols[coor[0]]; // finding the col specific to this coordinate
				const grid = this.findGrid(coor); // finding the grid specific to this coordinate

				// declare array to store possible solutions and inapplicable values (nested `not` array);
				this.solutionsBuffer[bufferProp] = [];
				this.solutionsBuffer[bufferProp].not = [];

				// prepare list of possible solutions for the current missingcoordinate.
				for (let j of [row, col, grid]) {
					vals.forEach((val) => {
						// each value is tested for if it is included in the currently being looped over row, col or grid
						if (!j.includes(val)) {
							if (
								!this.solutionsBuffer[bufferProp].not.includes(val) &&
								!this.solutionsBuffer[bufferProp].includes(val)
							) {
								this.solutionsBuffer[bufferProp].push(val);
							}
						} else {
							// not a vaild solution

							// remove for the list of eligible solutions if its already in there.
							if (this.solutionsBuffer[bufferProp].includes(val))
								this.solutionsBuffer[bufferProp].splice(
									this.solutionsBuffer[bufferProp].indexOf(val),
									1
								);
							// add to the list of inapplicable solutions if not already there.
							if (!this.solutionsBuffer[bufferProp].not.includes(val))
								this.solutionsBuffer[bufferProp].not.push(val);
						}
					});
				}
			}

			let possibleSolutions = 0;
			// const solved = [];
			for (let i in this.solutionsBuffer) {
				// i is like -> "0,0" or `${xpos},${ypos}`
				const elm = this.solutionsBuffer[i];
				if (elm.length == 1) {
					// put down the value and remove the coordinate from missing values list and also this.solutionsBuffer;
					const indexes = i.split(",");
					// this.sudoku[indexes[1]][indexes[0]] = elm.filter((item) => {
					// 	return !isNaN(item);
					// })[0]; // couldnt we just have used elm[0] ?

					this.sudoku[indexes[1]][indexes[0]] = elm[0];
					// ! still the same lol;
					// this.renderChange()
					// if (counter == 9)
					//     debugger;

					// console.log(this.missingCoordinates);
					// console.log("lollog",this.missingCoordinates[this.missingCoordinates[i]]);
					solved.push(
						// Array.from(this.missingCoordinates[this.missingCoordinates[i]])
						i.split(",")
						// still the same.
						// ! this.missingcoordinates does not contain a comma.
					);
					delete this.missingCoordinates[this.missingCoordinates[i]];
					delete this.missingCoordinates[i];
					delete this.solutionsBuffer[i];
				} else if (elm.length > 1) {
					// do nothing really.........
					// console.log(elm, elm.length, i);
					// well we will have to do something eventually.
				} else {
					// elm.length is < 0 ; which means that there is no possible solution
					// alert("the sudoku puzzle is Invalid/Broken")
					// console.error(elm, elm.length, i);
					// WTF 24 broken cases in solver.solutionsBuffer;
					// this error most of the time means that the row has already been filed
				}
				possibleSolutions += elm.length;
			}
			this.SetSudoku(this.sudoku);
			// console.log(possibleSolutions, solved.length, solved);
			--counter;
		}

		// THE REFACTORED VERSION OF THE LOOP
		// for (let i of this.missingCoordinates){
		//     const bufferProp = i.toString();
		//     this.solutionsBuffer[bufferProp] = [];
		//     this.solutionsBuffer[bufferProp].not = [];

		//     const row = this.rows[i[1]]; // subtract the set of the missing values in this
		//     const col = this.cols[i[0]];
		//     const grid = this.findGrid(i);

		//     for (let j of [row,col,grid]) {
		//         vals.forEach( val => {
		//             // each value is tested for if it is included in the currently being looped over row, col or grid
		//             if(!j.includes(val)){
		//                 if(!this.solutionsBuffer[bufferProp].not.includes(val) && !this.solutionsBuffer[bufferProp].includes(val))
		//                     this.solutionsBuffer[bufferProp].push(val);
		//             }
		//             else {
		//                 if (this.solutionsBuffer[bufferProp].includes(val))
		//                         this.solutionsBuffer[bufferProp].splice(this.solutionsBuffer[bufferProp].indexOf(val),1);

		//                 if(!this.solutionsBuffer[bufferProp].not.includes(val))
		//                         this.solutionsBuffer[bufferProp].not.push(val);
		//             }
		//         });
		//     }
		// }
	};

	// @findGrid (coors) [x-pos, y-pos]
	findGrid = (coors) => {
		// let box;
		this.boxesCoordinates.forEach((e, index) => {
			if (e.includes(coors.toString())) {
				return this.boxes[index];
			}
		});
		// return box;
	};

	// testingPurposes
	__verifyMissingValueDiscrepancies = () => {
		const missingValueObj = {};
		for (let i of this.missingCoordinates) {
			if (this.getValue([i[0], i[1]]) != 0) {
				missingValueObj[i.toString()] = this.getValue([i[0], i[1]]);
			}
		}
		return Object.keys(missingValueObj).length > 0 ? missingValueObj : null;
		// expensive return statement.
	};
}

/* load , analyse methods*/
