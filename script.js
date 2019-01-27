document.addEventListener("DOMContentLoaded", (e) => {
    n  = Number(prompt("podaj liczbe"));
    //setting global variables
    // n = 3;
    
    //generating the puzzle array
    puzzleOrder = [];
    for(let t = 0; t < n*n; t++){
        puzzleOrder.push(t);
    }
    solvedPuzzle = puzzleOrder.slice(0);    //cpy array
    
    puzzleOrder.sort(function() { return 0.5 - Math.random() });
    // console.log("puzzle order:" + puzzleOrder);
    
    // isSolvable(puzzleOrder);
    // astar(puzzleOrder);
    
    // astar([0,1,2,3,7,4,6,8,5]);
    astar([0,1,2,8,3,4,6,7,5]);
});

function astar(puzzleToSolve){
    var open_list = [];
    var closed_list = []; 
    let heuristicValue = heuristic(puzzleToSolve);
    
    open_list.push(new Node(puzzleToSolve, null, 0, heuristicValue));
    
    while(open_list.length > 0){
        let min = findMinF(open_list);
        let node_current = open_list[min];
        open_list.splice(min, 1);
        if(isEqual(node_current.sequence, solvedPuzzle)){
            console.log(node_current.sequence);
            while(node_current.parent != null){
                console.log(node_current.parent.sequence);
                node_current = node_current.parent;
            }
            console.log("algorytm zakonczyl dzialanie");
            return 0;
        }
        else{
            let node_succesors = generateNodeSuccessors(node_current.sequence);
            node_succesors.forEach((element)=> {
                let successor_cost = node_current.g + 1;
                let heuristic_cost = heuristic(element);
                let shouldBeVisited = true;
                
                open_list.forEach((e, k) => {
                    if(isEqual(e.sequence, element)){
                        if(e.f <= (successor_cost+heuristic_cost)){
                            shouldBeVisited = false;
                        }else{
                            open_list.splice(k, 1);
                        }
                    }
                });
                closed_list.forEach((e, k) => {
                    if(isEqual(e.sequence, element)){
                        if(e.f <= (successor_cost+heuristic_cost)){
                            shouldBeVisited = false;
                        }else{
                            open_list.splice(k, 1);
                        }
                    }
                });
                if(shouldBeVisited){
                    open_list.push(new Node(element, node_current, successor_cost, heuristic_cost));
                }
            });
            closed_list.push(node_current);
        }   
    }
}

function heuristic(seq){
    var result = 0; 
    seq.forEach((e, i) => {
        let targetetIndex = e;
        let distance = Math.abs(targetetIndex-  i);
        while(distance >= n){
            result++;
            distance -= n;
        }
        result += distance;
    })
    return result;
}

function generateNodeSuccessors(ancestor){
    var zeroIndex;
    var successors_list = [];
    for(let i=0; i<ancestor.length; i++){
        if(ancestor[i] == ancestor.length-1){
            zeroIndex = i;
            break;
        }
    }
    
    if(!((zeroIndex)%n === 0)){
        // console.log("mozna przesunac w lewo")
        let tmpArray = ancestor.slice();
        let tmpVal = tmpArray[zeroIndex-1];
        tmpArray[zeroIndex-1] = tmpArray[zeroIndex];
        tmpArray[zeroIndex] = tmpVal;
        successors_list.push(tmpArray);
    }
    
    if((zeroIndex)%n !== (n-1)){
        // console.log("mozna przesunac w prawo")
        let tmpArray = ancestor.slice();
        let tmpVal = tmpArray[zeroIndex+1];
        tmpArray[zeroIndex+1] = tmpArray[zeroIndex];
        tmpArray[zeroIndex] = tmpVal;
        successors_list.push(tmpArray);
    }
    
    if(puzzleOrder[zeroIndex+n]){
        // console.log("mozna przesunac w dol")
        let tmpArray = ancestor.slice();
        let tmpVal = tmpArray[zeroIndex+n];
        tmpArray[zeroIndex+n] = tmpArray[zeroIndex];
        tmpArray[zeroIndex] = tmpVal;
        successors_list.push(tmpArray);
    }
    
    
    if(puzzleOrder[zeroIndex-n]){
        // console.log("mozna przesunac w gore")
        let tmpArray = ancestor.slice();
        let tmpVal = tmpArray[zeroIndex-n];
        tmpArray[zeroIndex-n] = tmpArray[zeroIndex];
        tmpArray[zeroIndex] = tmpVal;
        successors_list.push(tmpArray);
    }
    return successors_list;
}

function findMinF(arr){
    let minCost = arr[0].f;
    let index = 0;
    arr.forEach((e, i) => {
        if(e.f < minCost){
            minCost = e.f;
            index = i;
        }
    });
    return index;
}

function isSolvable(puzzle){
    
    // If the grid width is odd, then the number of inversions in a solvable situation is even.
    // If the grid width is even, and the blank is on an even row counting from the bottom (second-last, fourth-last etc),
    //     then the number of inversions in a solvable situation is odd.
    // If the grid width is even, and the blank is on an odd row counting from the bottom (last, third-last, fifth-last etc)
    //     then the number of inversions in a solvable situation is even.
    if(n % 2 === 1){
        
    }
    
}
function isEqual(a,b){
    for(let i=0; i< a.length; i++){
        if(a[i] != b[i]){
            return false;
        }
    }
    return true;
}
function Node(seq, parent, g, h) {
    this.sequence = seq;
    this.parent = parent;
    this.g = g;
    this.h = h;
    this.f = g+h;
}