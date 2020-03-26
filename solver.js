// todo edit renderer.render to show coordinates to easily
// write the indexes for the box values

class Solver
{
    constructor()
    {
        this.sudoku;
        this.rows;
        this.cols = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.boxes = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.boxesCordinates = [
            [0,0],[2,2],
            // [3,3],[,2]
        ];

        this.missingCoordinates = [];
    }

    solve = function ()
    {
        // code
    }

    analyse = function()
    {
        for (let i in this.sudoku)
        {
            for (let j in this.sudoku[i])
            {
                let val = this.sudoku[i][j];
                if(val == 0)
                {
                    this.missingCoordinates.push([i,j]);
                }
            }
        }
    }

    SetSudoku = function (sudoku)
    {
        this.sudoku = sudoku;
        this.rows = sudoku;
        sudoku = sudoku.toString().replace(/,/g,"")
        for (let i in sudoku)
        {
            let val = sudoku[i];
            this.cols[i % 9].push(val);
        }
        // for (let i=0;i<9;i += 2)
        // {
        //     this.boxes[0].push(
        //         matrixRangeValues(this.boxesCordinates[i],this.boxesCordinates[i+1],this.sudoku)
        //         );
        // }
        // for (let i in this.sudoku)
        // {
        //     for (let j in this.sudoku[i])
        //     {
        //         switch([i,j])
        //         {
        //             case []:
        //         }
        //     }
        // }
    }
}

/* load , analyse methods*/