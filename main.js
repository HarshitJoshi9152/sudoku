const sudokus = [];

function generate_sudoku(gaps_seed)
{
    const sudoku = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]

    // dummy code to test the render
    let nums = "004300209005009001070060043006002087190007400050083000600000105003508690042910300"

    for (let i = 0; i < 81; i++){
        sudoku[Math.floor(i/9)][i%9] = nums[i];
    }

    return sudoku;
}

let sudoku = generate_sudoku();

let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

(function setup()
{
    render = new Render(100, height-100, ctx, sudoku, 10)
    render.renderBox();
    render.renderValues();

    solver = new Solver();
    solver.SetSudoku(sudoku);
    solver.analyse();
    // console.table(solver.missingCoordinates);

})();


function matrixRangeValues(s, e, matrix)
{
    // if(s[0] !== s[1] || e[0] !== e[1])
    //     throw new Error("values not supported by the function");
    let ysize = 0;
    let coors = [];
    let rowsize = e[0] - s[0] + 1; // coz indexing starts at 0
    let start = s[0]*s[1];
    let limit = (e[0]+1-s[0])*(e[1]+1-s[1]);
    // console.log(limit);
    for (let i = start; i < limit; i++)
    {
        let coor = [i % rowsize, ysize] // x-cor, y-cor
        if(i !== s[0]*s[1] && i % rowsize == rowsize-1)
        {
            // if this is not the first loop interval and we have outgrown the row
            ysize += 1;
        }
        coors.push(coor);
    }
    return coors;
}

// checking if the matrixRangeValues() function works if s[0] !== s[1] || e[0] !== e[1] by shading output cells yellow

let yellowgrp = matrixRangeValues([0,0],[5,2])


let acc = 0;
for (let i of yellowgrp){
    acc++;
    // console.log(i[1], i[0],"hello");
    render.renderValueInPlace("$",{
        x:i[0], // 0,1 because the renderValueInPlace takes arg like the coordinate sys not like array indexes and
        y:i[1]  // matrixRangeValues returns it according to the coordinate sys
    },true);
}
console.log(acc);