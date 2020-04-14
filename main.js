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
const solved = [];
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
    solver.solve();

})();