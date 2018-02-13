// Shortcut
function getElement(id) {
  return document.getElementById(id);
}
let grid;
let container = getElement('container');
let visibility = getElement('grid-visibility');
// let grid = Grid(10, 10, 3, container, visibility);
let generate = getElement('generate');


generate.onclick = function(e){
    height = document.getElementById('height').value;
    rows = document.getElementById('row').value;
    cols = document.getElementById('column').value;
    // if(grid){
    grid = Grid(height, rows, cols, container, visibility);
    // }
    // else{
        // grid.reset(height, rows, cols);


};

document.querySelectorAll('.ctrl-btn').forEach((button) =>{
    let action = button.id.split('-');
    button.onclick = function(e){
        grid.manipulate(action[0], action[1]);
    };
});

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
