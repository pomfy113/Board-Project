// DEFAULT rotations in degrees
let rotX = 70;
let rotY = 0;
let rotZ = -45;
let zoom = 1;
// DEFAULT zoom
// Each height in layers
let layerHeight = 100;
let gridArray;

// ==============
// === Helper ===
// ==============

// Just a shortcut for get element ID
function getElement(id) {
  return document.getElementById(id);
}

// MAY need this in the future, possibly
// // Make strings neater for formatting strings
// String.prototype.format = function() {
//   string = this;
//   for (num in arguments) {
//     string = string.replace("{" + num + "}", arguments[num])
//   }
//   return string
// }


function resetGrid(){
    if (gridArray){
        gridArray.forEach((grid) => {
            grid.remove();
        });
        gridArray = [];
        while(gridvisibility.hasChildNodes()){
            gridvisibility.removeChild(gridvisibility.firstChild);
        }
    }

    // Reset position
    currentX = 0;
    currentY = 0;
    // Reset rotations
    rotX = 70;
    rotY = 0;
    rotZ = -45;
    zoom = 1;
    //
    layerHeight = 100;

}

// ==============
// ==== Move ====
// ==============
const moveUp = getElement("mv-up");
const moveDown = getElement("mv-down");
const moveLeft = getElement("mv-left");
const moveRight = getElement("mv-right");
let currentX = 0;
let currentY = 0;

if(gridArray !== 'undefined'){
    // Move vertically
    moveUp.onclick = function(e){
        currentY += 40;
        moveY((currentY + "px"));
    };

    moveDown.onclick = function(e){
        currentY -= 40;
        moveY((currentY + "px"));
    };

    // Move horizontally
    moveLeft.onclick = function(e){
        currentX += 40;
        moveX((currentX + "px"));
    };

    moveRight.onclick = function(e){
        currentX -= 40;
        moveX((currentX + "px"));
    };
}

// Let's not repeat ourselves
function moveX(x){
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--x", x);
    }
}

function moveY(y){
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--y", y);
    }
}

// ==============
// === Rotate ===
// ==============
// Rotate it by 90 degrees per button press
// The starting position is -45 degrees, with the 0,0 being at the top left

const cntClockwise = getElement("rotate-ccw");
const clockwise = getElement("rotate-cw");
const rtUp = getElement("rotate-up");
const rtDown = getElement("rotate-down");

let postGenHeight;
if(gridArray !== 'undefined'){
    cntClockwise.onclick = function(e){
        rotZ -= 90;
        rotateGridHor(rotZ, height);
    };

    clockwise.onclick = function(e){
        rotZ += 90;
        rotateGridHor(rotZ, height);
    };

    rtUp.onclick = function(e){
        rotX += 5;
        rotateGridVert(rotX, height);
    };

    rtDown.onclick = function(e){
        rotX -= 5;
        rotateGridVert(rotX, height);
    };
}

// Let's not repeat ourselves
function rotateGridHor(newRotZ, height){
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--rotZ", newRotZ+"deg");
    }
}

function rotateGridVert(newRotX, height){
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--rotX", newRotX+"deg");
    }
}
// ==============
// === Spread ===
// ==============
const spread = getElement("spread-in");
const contract = getElement("spread-out");

if(gridArray !== 'undefined'){
    spread.onclick = function(e){
        layerHeight += 50;
        adjustSpread(layerHeight, height);
    };

    contract.onclick = function(e){
        // Negative goes into flips
        if(layerHeight - 50 > 0){
            layerHeight -= 50;
            adjustSpread(layerHeight, height);
        }
    };
}

function adjustSpread(layerHeight, height){
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--trnZ", (layerHeight*lvl)+"px");
    }
}

// ==============
// ==== Zoom ====
// ==============

const zoomIn = getElement("zoom-in");
const zoomOut = getElement("zoom-out");

if(gridArray !== 'undefined'){
    zoomIn.onclick = function(e){
        zoom *= 1.2;
        zoomChange(zoom);
    };

    zoomOut.onclick = function(e){
        zoom /= 1.2;
        zoomChange(zoom);
    };
}

function zoomChange(zoom){
    if(zoom <= 0){}
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--zoom", zoom);
    }
}

// ==============
// ==== Grid ====
// ==============
const generate = getElement("generate");
const cubecont = getElement("cubecontainer");
const gridcont = getElement("container");
const gridvisibility = getElement("grid-visibility");

// Last button clicked
let lastClicked;
// For later use
let height, rows, cols;

generate.onclick = function(e){
    // Get the info when we actually click
    height = document.getElementById('height').value;
    rows = document.getElementById('row').value;
    cols = document.getElementById('column').value;

    // Remove and reset stats
    resetGrid();

    gridArray = clickableGrid(rows, cols, height);

    // Add grid to the container
    gridArray.forEach((grid) => {
        gridcont.appendChild(grid);
        createButton(grid);
    });
};

function clickableGrid(rows, cols, height, callback ){
    let i = 0;
    let allGrids = [];

    for(let h=0; h<height; ++h){
        let grid = document.createElement('table');
        grid.className = 'grid';
        grid.id = "grid-" + h;

        grid.style.width = (50 * cols) + "px";

        // grid.style.transform = defaultGrid + (h * 75) + "px)";
        grid.style.setProperty('--x', "0px");
        grid.style.setProperty('--y', "0px");

        grid.style.setProperty('--rotX', rotX + "deg");
        grid.style.setProperty('--rotY', rotY + "deg");
        grid.style.setProperty('--rotZ', rotZ + "deg");
        grid.style.setProperty('--trnZ', layerHeight * (h) + "px");

        grid.setAttribute('level', h);


        // Need this for going through all grid and doing proper transforms

        // Creating tables w/ proper rows and columns
        for (let r = 0; r < rows; ++r){
            let tr = grid.appendChild(document.createElement('tr'));
            for (let c = 0; c < cols; ++c){
                let cell = tr.appendChild(document.createElement('td'));
                // Read into immediately invocables
                cell.addEventListener('click', cellListener(cell, r, c, h));
            }
        }
        allGrids.push(grid);
    }
    return allGrids;
}


// For hiding
function createButton(grid){
    let newbutton = gridvisibility.insertBefore(document.createElement('button'), gridvisibility.childNodes[0]);
    let level = grid.getAttribute("level");
    newbutton.id = "vis-" + level;
    newbutton.innerHTML = "Level " + level;
    newbutton.onclick = function(){ gridtoggle(grid, newbutton); } ;
}

function gridtoggle(target, button){
    if(target.style.display === "none"){
        target.style.display = "block";
        button.style.color = "black";
        button.style.backgroundColor = "white";

    }
    else{
        target.style.display = "none";
        button.style.color = "grey";
        button.style.backgroundColor = "lightgrey";
    }
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

// ===============
// == Generator ==
// ===============
// Redundant
let generator = getElement("cubegen");
let cubeNum = 0;

generator.onmousedown = function(e) {
    const model = document.createElement('div');
    model.id = "cube-" + cubeNum;
    cubeNum +=  1;
    model.classList.add('cube');
    model.setAttribute("draggable", "true");
    model.setAttribute("ondragstart", "drag(event)");

    cubeNum += 1;

    for (let i=0; i<6; ++i){
        let face = document.createElement('div');
        face.classList.add('face');
        model.appendChild(face);
    }
    // append the element to the DOM
    container.appendChild(model);
};
