// DEFAULT rotations in degrees
let rotX = 70;
let rotY = 0;
let rotZ = -45;
let zoom = 1;
// DEFAULT zoom
// Each height in layers
let layerHeight = 100;

// ==============
// === Helper ===
// ==============

// Just a shortcut for get element ID
function getElement(id) {
  return document.getElementById(id)
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

// ==============
// ==== Move ====
// ==============
const moveUp = getElement("mv-up");
const moveDown = getElement("mv-down");
const moveLeft = getElement("mv-left");
const moveRight = getElement("mv-right");
let currentX = 0;
let currentY = 0;

// Move vertically
moveUp.onclick = function(e){
    if(gridArray){
        currentY -= 25;
        moveY((currentY + "px"));
    }
};

moveDown.onclick = function(e){
    if(gridArray){
        currentY += 25;
        moveY((currentY + "px"));
    }
};

// Move horizontally
moveLeft.onclick = function(e){
    if(gridArray){
        currentX -= 25;
        moveX((currentX + "px"));
    }
};

moveRight.onclick = function(e){
    if(gridArray){
        currentX += 25;
        moveX((currentX + "px"));
    }
};


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

const cntClockwise = getElement("rotate-ccw")
const clockwise = getElement("rotate-cw")

let postGenHeight;

cntClockwise.onclick = function(e){
    if(gridArray){
        rotZ = rotZ - 90;
        rotateGridHor(rotZ, height);
    }
};

clockwise.onclick = function(e){
    if(gridArray){
        rotZ = rotZ + 90;
        rotateGridHor(rotZ, height);
    }
};

// Let's not repeat ourselves
function rotateGridHor(newRotZ, height){
    for(let lvl=0; lvl<height;lvl++){
        let currentGrid = getElement("grid-"+lvl);
        currentGrid.style.setProperty("--rotZ", newRotZ+"deg");
    }
}

// ==============
// === Rotate ===
// ==============

const zoomIn = getElement("zoom-in");
const zoomOut = getElement("zoom-out");

zoomIn.onclick = function(e){
    if(gridArray){
        zoom += 0.2;
        zoomChange(zoom);
    }
};

zoomOut.onclick = function(e){
    if(gridArray){
        // Can't go past that
        if(zoom > 0){
            zoom -= 0.2;
        }
        zoomChange(zoom);
    }
};

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
const generate = getElement("generate")
const cubecont = getElement("cubecontainer")
const gridcont = getElement("container")

// Last button clicked
let lastClicked;
// Array of grids
let gridArray;
// For later use
let height, rows, cols;

generate.onclick = function(e){
    // Get the info when we actually click
    height = document.getElementById('height').value
    rows = document.getElementById('row').value
    cols = document.getElementById('column').value

    // Remove and reset stats
    if (gridArray){
        gridArray.forEach((grid) => {
            grid.remove()
        })
        // Reset rotation
        currentX = 0;
        currentY = 0;
        // Reset rotations
        rotX = 70;
        rotY = 0;
        rotZ = -45;
        zoom = 1;
    }

    gridArray = clickableGrid(rows, cols, height);

    // Add grid to the container
    gridArray.forEach((grid) => {
        gridcont.appendChild(grid);
    });


}

function clickableGrid(rows, cols, height, callback ){
    let i = 0;
    let allGrids = [];

    for(let h=0; h<height; ++h){
        let grid = document.createElement('table');
        grid.className = 'grid';
        grid.style.width = (50 * cols) + "px";

        // grid.style.transform = defaultGrid + (h * 75) + "px)";
        grid.style.setProperty('--x', "0px");
        grid.style.setProperty('--y', "0px");

        grid.style.setProperty('--rotX', rotX + "deg");
        grid.style.setProperty('--rotY', rotY + "deg");
        grid.style.setProperty('--rotZ', rotZ + "deg");
        grid.style.setProperty('--trnZ', layerHeight * (h) + "px");

        console.log(rotZ + (90*h) + "deg");
        // Need this for going through all grid and doing proper transforms
        grid.id = "grid-" + h

        // Creating tables w/ proper rows and columns
        for (let r=0; r<rows; ++r){
            let tr = grid.appendChild(document.createElement('tr'));
            for (var c=0;c<cols;++c){
                var cell = tr.appendChild(document.createElement('td'));
                // Read into immediately invocables
                cell.addEventListener('click', (function(el, r, c, i){
                    return function(){
                        cellData(el, r, c, i);}
                    })(cell, r, c, i));
            }
        }
        allGrids.push(grid)
    }
    return allGrids;
}

// Extra data on cell; also adds "clicked" to highlight lass clicked
// I'll do something with clicked later
function cellData(element, row, col){
        element.className='clicked';
        if (lastClicked) lastClicked.className='';
        lastClicked = element;
}
// ==============
// ==== Drag ====
// ==============

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
// ===============
// == Generator ==
// ===============
let generator = getElement("cubegen")
let cubeNum = 0

generator.onmousedown = function(e) {
    const model = document.createElement('div')
    model.id = "cube-" + cubeNum
    cubeNum +=  1
    model.classList.add('cube')
    model.setAttribute("draggable", "true")
    model.setAttribute("ondragstart", "drag(event)")

    cubeNum += 1;

    for (let i=0; i<6; ++i){
        let face = document.createElement('div');
        face.classList.add('face');
        model.appendChild(face);
    }
    // append the element to the DOM
    container.appendChild(model);
}
