function getRangeCoors(s, e, dbg=false){
	`this function returns array of coordinates of all positions between s and e in the format [x-pos, y-pos]`
    // s and e are arrays with std location formats with len 2 in which [0] represents the x pos and [1] represents the y pos.
	// s represent starting and e represent ending coordinates.
    const startValue = s[0] * s[1];
    // const endValue =   e[0] * e[1];
    const noOfCorsRequired = (e[0] + 1 - s[0]) * (e[1] + 1 - s[1])

    // +1 because 9 - 7 = 2 but there are 3 position ie [7,8,9]
    const verticalLimit = e[1] - s[1] + 1; // we dont actually need the verticalLimit var because we are filling in a horizontal fashion
    const HorizontalLimit = e[0] - s[0] + 1;
    
    const coordinatesRange = [];
    let yval = s[1];

    if(dbg)
        debugger;

    for (let i = startValue; i < startValue + noOfCorsRequired; i++){
        let xval = s[0] + i % HorizontalLimit;
        
        if( i != startValue && coordinatesRange.length % HorizontalLimit == 0){ // because 0 % anything == 0 : true
            // we increase the y value when we overflow the HorizontalLimit and the x value when we overflow the VerticalLimit
            // we didnt realise it till now because we were using ranges where hv and vv were the same
            // but we dont have to watch for the verticalOverflow because we fill coors in a horizontal fashion
            yval += 1;
        }
        // console.log(coordinatesRange.length);
        let corrs = [xval, yval];
        coordinatesRange.push(corrs)
    }
    // console.table(coordinatesRange);
    return coordinatesRange;
}

getRangeCoors.__test = (dbg=false) => {

    const experimentalValues = [
        [[6,0],[8,2],"sign"],
        [[7,2],[8,8],"!"],
        [[2,7],[6,8],"&"],
        [[0,6],[2,8],"E"]
    ];
    
    for (let i of experimentalValues) {
        console.table("testing for :", ...i);
        for (let j of getRangeCoors(i[0], i[1], dbg)) {
            // console.log(i[1], i[0],"hello");
            render.renderValueInPlace(i[2] || "*", {
                x: j[0],
                y: j[1] // matrixRangeValues returns it according to the coordinate sys
            }, true);
        }
    }
}
