// todo Test findGrid method and code the solve method
// edit renderer.render to show coordinates to easily DONE
// generate the indexes of box values programmatically. 

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

        this.boxesCoordinates = [
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
        this.missingCoordinates = [];
        this.solutionsBuffer = {};
    }

    analyse = function()
    {
        for (let i in this.sudoku)
        {
            for (let j in this.sudoku[i])
            {
                const val = this.sudoku[i][j];
                if(val == 0)
                {
                    this.missingCoordinates.push([j,i]);
                    // because the followed fashion is of x-pos and then y-pos.
                }
            }
        }
    }

    getValue = (pos) => {
        return this.sudoku[pos[1]][pos[0]];
        // because in 2d array first y-pos is given then x-pos is given
    }

    SetSudoku = (sudoku) => {

        this.sudoku = sudoku;
        this.rows = sudoku;
        
        sudoku = sudoku.toString().replace(/,/g,"")
        for (let i in sudoku)
        {
            let val = sudoku[i];
            this.cols[i % 9].push(val);
        }

        let acc = 0;
        for (let i of this.genBoxCoors()){
            let coors = getRangeCoors(i[0],i[1]);
            /* if you want to get coordinates only use : this.boxes[acc].push(this.sudoku[coors[1]][coors[0]]);*/

            for (let j of coors) {
                this.boxes[acc].push(this.sudoku[j[1]][j[0]]);
                this.boxesCoordinates[acc].push(j.toString());
            }
            // because in arrays we first have to mention y-val then the x-val;
            acc++;
        }
    }

    genBoxCoors = () => {
        // this first generates the x and y values of starting cube and then the x and y values of the corresponding cube by adding 2 to both x and y values
        // i got the idea for this function by observing the pattern between the starting and ending coordinates.
        const coors = [];
        // this loop populates the coors array in a vertical fashion meaning first all the possible vertical y pos value combination with the identified x value are generated and then we move on to the next x value.
        for (let i = 0; i < 9; i++){
            if (i % 3 == 0){
                for (let j = 0; j < 9; j++) {
                    if (j % 3 == 0){
                        coors.push([
                            [i,j],
                            [i + 2, j + 2]
                        ]);
                    }
                }
            }
        }
        return coors;
    }

    solve = () => {
        const vals = ["1","2","3","4","5","6","7","8","9"];
        for (let i of this.missingCoordinates){            
            const bufferProp = i.toString();
            
            const row = this.rows[i[1]];
            const col = this.cols[i[0]]
            const grid = this.findGrid(i);
            
            for (let j of [row,col,grid]) {
                vals.forEach( val => {
                    // each value is tested for if it is included in the currently being looped over row, col or grid
                    if(!j.includes(val)){
                        if(this.solutionsBuffer[bufferProp]) {
                            if(this.solutionsBuffer[bufferProp].not && !this.solutionsBuffer[bufferProp].not.includes(val) && !this.solutionsBuffer[bufferProp].includes(val)) {
                                this.solutionsBuffer[bufferProp].push(val);
                            }
                        } 
                        else {
                            this.solutionsBuffer[bufferProp] = [val];
                        }
                    } 
                    else {
                        // if $j contains $val then we should remove $val from this.solutionsBuffer[bufferProp]
                        try {
                            // this line deletes the $val if it is already included in the solutionsBuffer
                            delete this.solutionsBuffer[bufferProp][this.solutionsBuffer[bufferProp].indexOf(val)];
                            
                            if(!this.solutionsBuffer[bufferProp].not.includes(val)) {
                                this.solutionsBuffer[bufferProp].not.push(val);
                            }
                        } catch(e) {
                            this.solutionsBuffer[bufferProp] = []; 
                            // this.solutionsBuffer[bufferProp] must be undefined
                            // so that this.solutionsBuffer[bufferProp].not can be defined
                            this.solutionsBuffer[bufferProp].not = [val];
                        }
                    }
                });
            }
        }
    }
    
    findGrid = (coors) => {
        let box;
        this.boxesCoordinates.forEach( (e, index) => {
            if (e.includes(coors.toString())){
                box = this.boxes[index];
            }
        })
        return box;
    }

    // testingPurposes
    __verifyMissingValueDiscrepancies = () => {
        const missingValueObj = {};
        for (let i of this.missingCoordinates){
            if(this.getValue([i[0], i[1]]) != 0){
                missingValueObj[i.toString()] = this.getValue([i[0], i[1]]);
            }
        }
        return Object.keys(missingValueObj).length > 0 ? missingValueObj : null;
    }
}

/* load , analyse methods*/