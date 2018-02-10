(function(){
// Let's create a Grid; initialization
    function Grid(rows, cols, height, container, visibility){
        // Initial values
        this.rows = rows;
        this.cols = cols;
        this.height = height;
        // Variables + setup of containers
        this.gridArray = [];                    // All of the grids; can be single if height is only 1
        this.container = container;             // Where are we putting the grid?
        this.visibility = visibility;           // Where to put button visibilities
        // And so we begin
        this.create();
        // Manipulations
    }

    // Full creation of grid
    Grid.prototype.create = function(){
        this.setPropertyDefaults();                         // Setup of defaults
        this.gridSetup(this.rows, this.cols, this.height);  // Creation of grid
        this.createGrid();
    };
// =========================================
// For resetting and reinitializing defaults
// =========================================
        // Set properties for each individual table
        Grid.prototype.setProperties = function(el, h){
            el.style.setProperty('--x', "0px");
            el.style.setProperty('--y', "0px");
            el.style.setProperty('--rotX', this.rotX + "deg");
            el.style.setProperty('--rotY', this.rotY + "deg");
            el.style.setProperty('--rotZ', this.rotZ + "deg");
            el.style.setProperty('--trnZ', this.layerHeight * (h) + "px");
            el.setAttribute('level', h);
        };

        // For resetting the whole grid
        Grid.prototype.resetAll = function(rows, cols, height){
            // I certainly HOPE this exists when we reset
            if (this.gridArray){
                this.gridArray.forEach((grid) => {
                    grid.remove();      // Removing all the grids; saved for ease
                });

                this.gridArray = [];    // Gotta clear that array

                while(this.visibility.hasChildNodes()){
                    this.visibility.removeChild(this.visibility.firstChild);
                }
            }
            this.rows = rows;
            this.cols = cols;
            this.height = height;

            this.create();
        };

        // Sets defaults for reset
        Grid.prototype.setPropertyDefaults = function(){
            // Reset position
            this.currentX = 0;
            this.currentY = 0;
            // Reset rotations
            this.rotX = 70;
            this.rotY = 0;
            this.rotZ = -45;
            this.zoom = 1;
            // Height
            this.layerHeight = 100;

            this.zoom = 1.0;
        };
// =========================================
// Setting up the grid prior to creation
// =========================================
        Grid.prototype.gridSetup = function(){
            for(let h = 0; h < this.height; ++h){
                let layer = document.createElement('table');
                layer.className = 'grid';
                layer.id = "grid-" + h;
                layer.style.width = (50 * this.cols) + "px";

                this.setProperties(layer, h);    // Setup properties for this layer

                // Need this for going through all grid and doing proper transforms
                // Creating tables w/ proper rows and columns
                for (let r = 0; r < this.rows; ++r){
                    let tr = layer.appendChild(document.createElement('tr'));
                    for (let c = 0; c < this.cols; ++c){
                        let cell = tr.appendChild(document.createElement('td'));
                        // Read into immediately invocables
                        cell.addEventListener('click', this.cellListener(cell, r, c, h));
                    }
                }
                this.gridArray.push(layer);
            }
        };

        // Helpers - the cell listening
        Grid.prototype.cellListener =  function(element, row, column, height){
            return function(){
                this.cellData(element, row, column, height);
            };
        };

        Grid.prototype.cellData = function(el, row, col, height){
                el.className='clicked';
                if (lastClicked) lastClicked.className='';
                lastClicked = el;
        };
// =========================================
// Actual grid creation
// =========================================
        Grid.prototype.createGrid = function(){
            this.gridArray.forEach((grid) => {
                this.container.appendChild(grid);
                this.createButton(grid, this.visibility);
            });
        };
            // CREATE GRID HELPER - creates buttons
            Grid.prototype.createButton = function(grid, btnContainer){
                let newbutton = btnContainer.insertBefore(
                    document.createElement('button'),
                    btnContainer.childNodes[0]
                );

                let level = grid.getAttribute("level");
                newbutton.id = "vis-" + level;
                newbutton.innerHTML = "Level " + level;
                newbutton.onclick = function(){ gridtoggle(grid, newbutton); } ;
            };

                // CREATE GRID HELPER HELPER - allows toggling of grid
                Grid.prototype.gridtoggle = function(target, button){
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
                };
// =========================================
// Manipulations
// =========================================
    Grid.prototype.manipulate = function(type, direction){
        switch(type){
            case "rotate":
                this.rotate(direction);
                break;
            case "mv":
                this.translate(direction);
                break;
            case "zoom":
                this.zoom(direction);
                break;
            default:
                console.log("Error");
        }
    };

    Grid.prototype.translate = function(direction){
        switch(direction){
            case "left":
                this.currentX -= 30;
                break;
            case "right":
                this.currentX += 30;
                break;
            case "up":
                this.currentY -= 30;
                break;
            case "down":
                this.currentY += 30;
                break;
        }
        if(direction === "left" || direction === "right"){
            this.gridArray.forEach((grid) => {
                grid.style.setProperty("--x", this.currentX + "px");
            });
        }
        else if(direction == "up" || direction === "down"){
            this.gridArray.forEach((grid) => {
                grid.style.setProperty("--y", this.currentY + "px");
            });
        }
    };

    Grid.prototype.rotate = function(direction){
        switch(direction){
            case "cw":
                this.rotZ -= 90;
                break;
            case "ccw":
                this.rotZ += 90;
                break;
            case "up":
                this.rotX -= 15;
                break;
            case "down":
                this.rotX += 15;
                break;
        }
        if(direction === "cw" || direction === "ccw"){
            this.gridArray.forEach((grid) => {
                grid.style.setProperty("--rotZ", this.rotZ + "deg");
            });
        }
        else if(direction == "up" || direction === "down"){
            this.gridArray.forEach((grid) => {
                grid.style.setProperty("--rotX", this.rotX + "deg");
            });
        }
    };


    Grid.prototype.zoom = function(direction){
        console.log(direction)
        switch(direction){
            case "in":
                this.zoom *= 1.2;
                break;
            case "out":
                this.zoom /= 1.2;
                break;
        }
        if(direction === "in"){
            this.gridArray.forEach((grid) => {
                grid.style.setProperty("--zoom", this.zoom);
            });
        }
        else if(direction == "out"){
            this.gridArray.forEach((grid) => {
                grid.style.setProperty("--zoom", this.zoom);
            });
        }
    };


// =========================================
// Init
// =========================================
    window.Grid = function(rows, cols, height, container, visibility){
        grid = new Grid(rows, cols, height, container, visibility);
        return grid;
    };

})();

function getElement(id) {
  return document.getElementById(id);
}

let container = getElement('container');
let visibility = getElement('grid-visibility');
let test = Grid(10, 10, 3, container, visibility);
let left = getElement('mv-left');
let generate = getElement('generate');


generate.onclick = function(e){
    test.reset(5, 5, 5);
};

document.querySelectorAll('.ctrl-btn').forEach((button) =>{
    let action = button.id.split('-');
    button.onclick = function(e){
        test.manipulate(action[0], action[1]);
    };
});
