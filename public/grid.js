(function(){
// Let's create a Grid; initialization
    function Grid(rows, cols, height, container, visibility){
        this.setDefaults = setDefaults;         // Setting some defaults first and run it
        this.setDefaults();
        this.setProperties = setProperties;     // For setting individual grid properties later
        this.createGrid = createGrid;           // Actually creating the grid when finished
        this.reset = resetGrid;                 // Create a reset button
        this.gridArray = [];                    // All of the grids; can be single if height is only 1
        this.container = container;             // Where are we putting the grid?
        this.visibility = visibility;           // Where to put button visibilities

        for(let h=0; h<height; ++h){
            let grid = document.createElement('table');
            grid.className = 'grid';
            grid.id = "grid-" + h;
            grid.style.width = (50 * cols) + "px";

            this.setProperties(grid, h);

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
            this.gridArray.push(grid);
        }

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
        function resetGrid(){
            if (this.gridArray){
                this.gridArray.forEach((grid) => {
                    grid.remove();
                });

                this.gridArray = [];

                while(this.gridvisibility.hasChildNodes()){
                    this.gridvisibility.removeChild(this.gridvisibility.firstChild);
                }
            }
            this.setDefaults();
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
        // Creating the ACTUAL grid
        function createGrid(){
            this.gridArray.forEach((grid) => {
                createButton(grid);
                this.container.appendChild(grid);
            });
        }
            // Helper - creates buttons
            function createButton(grid){
                let newbutton = this.visibility.insertBefore(
                    document.createElement('button'),
                    this.visibility.childNodes[0]
                );

                let level = grid.getAttribute("level");
                newbutton.id = "vis-" + level;
                newbutton.innerHTML = "Level " + level;
                newbutton.onclick = function(){ gridtoggle(grid, newbutton); } ;
            }

            // Helps the helper - allows toggling of grid
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
// Individual cell information
// =========================================
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
// Init
// =========================================

    window.Grid = function(rows, cols, height, container, visibility){
        gridArray = Grid(rows, cols, height, container, visibility);
    };

})();

let container = document.getElementById('container')
let visibility = document.getElementById('grid-visibility')
let test = Grid(10, 10, 3, container, visibility);
