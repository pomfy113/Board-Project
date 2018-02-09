(function(){
// Let's create a Grid; initialization
    function Grid(rows, cols, height, container, visibility){
        // Initial values
        this.rows = rows;
        this.cols = cols;
        this.height = height;

        // Functions
        this.reset = resetAll;                 // Resets
        this.create = createAll;               // Creates

        this.setDefaults = setDefaults;         // Setting some defaults first and run it
        this.setProperties = setProperties;     // For setting individual grid properties later
        this.gridSetup = gridSetup;             // Setup for grid
        this.createGrid = createGrid;           // Actually creating the grid when finished

        // Variables + setup of containers
        this.gridArray = [];                    // All of the grids; can be single if height is only 1
        this.container = container;             // Where are we putting the grid?
        this.visibility = visibility;           // Where to put button visibilities
        // And so we begin
        console.log(this.visibility)
        this.create();

    }

        function createAll(){
            this.setDefaults();
            this.gridSetup(this.rows, this.cols, this.height);
            this.createGrid();
        }


// =========================================
// For resetting and reinitializing defaults
// =========================================
        // Set properties for each individual table
        function setProperties(el, h){
            el.style.setProperty('--x', "0px");
            el.style.setProperty('--y', "0px");
            el.style.setProperty('--rotX', this.rotX + "deg");
            el.style.setProperty('--rotY', this.rotY + "deg");
            el.style.setProperty('--rotZ', this.rotZ + "deg");
            el.style.setProperty('--trnZ', this.layerHeight * (h) + "px");
            el.setAttribute('level', h);
        }

        // For resetting the whole grid
        function resetAll(rows, cols, height){
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


        }

        // Sets defaults for reset
        function setDefaults(){
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
        }
// =========================================
// Setting up the grid prior to creation
// =========================================
        function gridSetup(){
            for(let h = 0; h < this.height; ++h){
                let grid = document.createElement('table');
                grid.className = 'grid';
                grid.id = "grid-" + h;
                grid.style.width = (50 * this.cols) + "px";

                this.setProperties(grid, h);

                // Need this for going through all grid and doing proper transforms
                // Creating tables w/ proper rows and columns
                for (let r = 0; r < this.rows; ++r){
                    let tr = grid.appendChild(document.createElement('tr'));
                    for (let c = 0; c < this.cols; ++c){
                        let cell = tr.appendChild(document.createElement('td'));
                        // Read into immediately invocables
                        cell.addEventListener('click', cellListener(cell, r, c, h));
                    }
                }
                this.gridArray.push(grid);
            }
        }
        // Helpers - the cell listening
        function cellListener(element, row, column, height){
            return function(){
                cellData(element, row, column, height);
            };
        }

        function cellData(el, row, col){
                el.className='clicked';
                if (lastClicked) lastClicked.className='';
                lastClicked = el;
        }


// =========================================
// Actual grid creation
// =========================================
        function createGrid(){
            this.gridArray.forEach((grid) => {
                createButton(grid, this.visibility);
                this.container.appendChild(grid);
            });
        }
            // CREATE GRID HELPER - creates buttons
            function createButton(grid, btnContainer){
                let newbutton = btnContainer.insertBefore(
                    document.createElement('button'),
                    btnContainer.childNodes[0]
                );

                let level = grid.getAttribute("level");
                newbutton.id = "vis-" + level;
                newbutton.innerHTML = "Level " + level;
                newbutton.onclick = function(){ gridtoggle(grid, newbutton); } ;
            }

                // CREATE GRID HELPER HELPER - allows toggling of grid
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

// =========================================
// Init
// =========================================
    window.Grid = function(rows, cols, height, container, visibility){
        grid = new Grid(rows, cols, height, container, visibility);
        return grid;
    };

})();

let container = document.getElementById('container');
let visibility = document.getElementById('grid-visibility');
let test = Grid(10, 10, 3, container, visibility);

let generate = document.getElementById('generate');


generate.onclick = function(e){
    test.reset(5, 5, 5);
};
