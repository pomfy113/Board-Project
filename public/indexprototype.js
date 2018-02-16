// Shortcut
function getElement(id) {
  return document.getElementById(id);
}
let grid;
// Used for grid
let container = getElement('container');
let visibility = getElement('grid-visibility');
let generate = getElement('generate');
// For hiding
let hide = getElement('hide');
let generators = getElement('generators');


generate.onclick = function(e){
    height = getElement('height').value;
    rows = getElement('row').value;
    cols = getElement('column').value;
    if(!grid){
        grid = Grid(rows, cols, height, container, visibility);
    }
    else{
        grid.resetAll(rows, cols, height);
    }

};

hide.onclick = function(e){
    if(generators.style.display === "none"){
        generators.style.display = "grid";
    }
    else{
        generators.style.display = "none";
    }
};

// All manipulation functions
// document.querySelectorAll('.ctrl-btn').forEach((button) =>{
//     let action = button.id.split('-');
//     button.onclick = function(e){
//         if(grid){
//             grid.manipulate(action[0], action[1], action[2]);
//         }
//     };

document.querySelectorAll('button.inspector').forEach((button) =>{

    button.onclick = function(e){
        // Should grab the classes of what we grab
        let action = button.classList[1];
        let values = [];

        // Grab matching inputs
        document.querySelectorAll("input." + action).forEach(function(data){
            values.push(data.value);
        });

        if(grid){
            grid.manipulate('manual', action, values);
        }
        // For changing the actual text
        let text = "";
        switch(action){
            case "translate":
                text = `X: ${values[0]}, Y: ${values[1]}`;
                break;
            case "rotate":
                text = `X: ${values[0]}, Y: ${values[1]}, Z: ${values[2]}`;
                break;
        }
        getElement("current-" + action).innerHTML = text;

    };


});

function rangeUpdateZoom(value){
    if(grid){
        grid.manipulate('manual', 'zoom', value);
    }
    getElement("current-zoom").innerHTML = value;
}

function rangeUpdateSpread(value){
    console.log(value)
    if(grid){
        grid.manipulate('manual', 'spread', value);
    }
    getElement("current-spread").innerHTML = value;
}

// ==============
// ==== Drag ====
// ==============
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("token", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let cubeNum = 1;
    let data = ev.dataTransfer.getData("token");
    let dataObj = document.getElementById(data);

    if(ev.target.nodeName === 'TD'){
        if(dataObj.classList.contains("generator")){
                dataCopy = dataObj.cloneNode(true);
                dataCopy.id = "cube" + cubeNum;
                dataCopy.classList.remove("generator");
                cubeNum += 1;
                ev.target.appendChild(dataCopy);
        }
        // I might wanna be careful to be more specific on what I drop around
        else{
            ev.target.appendChild(dataObj);
        }
    }


}

// ==============
// =Key controls=
// ==============
document.body.onkeydown = function(e){
    if(grid){
        switch(e.key){
            // Translates
            case "ArrowLeft":
                grid.manipulate("translate", "left");
                break;
            case "ArrowRight":
                grid.manipulate("translate", "right");
                break;
            case "ArrowUp":
                grid.manipulate("translate", "up");
                break;
            case "ArrowDown":
                grid.manipulate("translate", "down");
                break;
            // Rotates
            case "w":
                grid.manipulate("rotate", "up");
                break;
            case "s":
                grid.manipulate("rotate", "down");
                break;
            case "a":
                grid.manipulate("rotate", "cw");
                break;
            case "d":
                grid.manipulate("rotate", "ccw");
                break;
            // Spread
            case "q":
                grid.manipulate("spread", "out");
                break;
            case "e":
                grid.manipulate("spread", "in");
                break;
            // Zoom
            case "z":
                grid.manipulate("zoom", "in");
                break;
            case "c":
                grid.manipulate("zoom", "out");
                break;

        }
    }

};
