let pixelSize = 16;
let width = 1;
let height = 1;
let playerSpawn = null;
let map = [""];


let materials = [
  { name: "Clear", material: " ", bgcolor: "#fff", fontcolor: "grey" },
  { name: "Brick", material: "=", bgcolor: "red", fontcolor: "grey" },
  { name: "Cliff", material: "c", bgcolor: "SaddleBrown", fontcolor: "grey" },
  { name: "Tall Grass", material: "g",bgcolor: "greenyellow",fontcolor: "grey"},
  { name: "Gravestone",material: "G",bgcolor: "#999",fontcolor: "lightgrey"},
  {name: "Hen",material: "h",bgcolor: "tomato",fontcolor: "lightgrey"},
  {name: "Kitty",material: "k",bgcolor: "orange",fontcolor: "dimgrey"},
  {name: "Cobblestone",material: "p",bgcolor: "#ddd",fontcolor: "#aaa"},
  {name: "Rock",material: "r",bgcolor: "tan",fontcolor: "grey"},
  {name: "Roof shingles",material: "^",bgcolor: "yellow",fontcolor: "grey"},
  {name: "Small tree",material: "t",bgcolor: "#00aa55",fontcolor: "grey"},
  {name: "Big tree",material: "T",bgcolor: "#005f16",fontcolor: "grey"},
  {name: "Dead tree",material: "+",bgcolor: "olive",fontcolor: "lightgrey"},
  { name: "Water", material: "w", bgcolor: "blue", fontcolor: "grey" },
  { name: "Black", material: "|", bgcolor: "black", fontcolor: "grey" },
  {name: "Level 0",material: "0",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 1",material: "1",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 2",material: "2",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 3",material: "3",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 4",material: "4",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 5",material: "5",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 6",material: "6",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 7",material: "7",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 8",material: "8",bgcolor: "purple",fontcolor: "grey"},
  {name: "Level 9",material: "9",bgcolor: "purple",fontcolor: "grey"},
  {name: "World 1-0",material: "①",bgcolor: "purple",fontcolor: "grey"},
  {name: "Player Spawn",material: "♀",bgcolor: "pink",fontcolor: "grey"}
];
let currentMaterial = "=";
let selected = null;

const addMaterialSelector = config => {
  let materialSelector = document.getElementById("materialSelector");
  let div = document.createElement("div");
  div.style.backgroundColor = config.bgcolor;
  // div.style.cssText = "display:inline-block;margin:10px;";
  let label = document.createElement("label");
  // label.style.cssText = "border-bottom:10px solid " + config.bgcolor;
  let input = document.createElement("input");
  input.type = "radio";
  input.id = config.name.replace(" ", "_");
  input.name = "current";
  input.value = config.material;
  input.addEventListener("click", () => {
    currentMaterial = config.material;
    grid.style.borderColor = config.bgcolor;
    div.classList.add('selected');
    if(selected != null) {
      selected.classList.remove('selected');
    }
    selected = div;
  });
  label.for = input.id;
  label.innerHTML = config.name;
  div.appendChild(label);
  label.appendChild(input);
  materialSelector.appendChild(div);
};
materials.forEach(addMaterialSelector);
let current = document.getElementById("current");
let grid = document.getElementById("grid");
let compile = document.getElementById("compile");
compile.addEventListener("click", () => {
  let output = document.getElementById("output");
  if(playerSpawn == null || !hasPlayerSpawn()){
    output.innerHTML = "Player Spawn location is missing!";
    return
  }
  output.innerHTML = "";
  let all = Array.from(grid.querySelectorAll("div"));
  let result = "[";
  for (let row = 0; row < height; row++) {
    result += '"';
    for (let col = 0; col < width; col++) {
      result += all[row * width + col].dataset["material"];
    }
    if(row < height-1){
      result += '", <br>';
    }
  }
  output.innerHTML = result + '"]';
});
const setCharAt = (str, index, chr) => {
  if (str && index > str.length - 1) return str;
  return str.substr(0, index) + chr + str.substr(index + 1);
};
const getBgColorForMaterial = materialChar =>
  materials.find(m => m.material === materialChar).bgcolor;
const getFontColorForMaterial = materialChar =>
  materials.find(m => m.material === materialChar).fontcolor;
const setMaterial = (element, material) => {
  if(element.dataset["material"]=="♀"){
    setPlayerSpawn(null, null);
  }
  let bgcolor = "white";
  material = material || " ";
  element.dataset["material"] = material;
  element.innerHTML = material;
  element.style.cssText =
    "width:" +
    pixelSize +
    "px;height:" +
    pixelSize +
    "px;font-size:" +
    pixelSize +
    "px;border: #ddd 0px solid;border-right:1px;border-bottom:1px;background-color:" +
    getBgColorForMaterial(material) +
    ";color:" +
    getFontColorForMaterial(material) +
    ";";
  let row = Math.floor(element.id / width);
  let col = element.id % width;
  if (row < map.length && col < map[row].length && map[row][col] != material) {
    map[row] = setCharAt(map[row], col, material);
    if (material == "♀") {
      setPlayerSpawn(row, col);
      drawGrid();
    }
  }
};
function setPlayerSpawn(row, col) {
  if (row == null || col == null){
    playerSpawn = null
    return
  }
  if (playerSpawn) {
    // only allow 1 player spawn point, remove old spawn point
    map[playerSpawn.row] = setCharAt(
      map[playerSpawn.row],
      playerSpawn.col,
      " "
    );
    playerSpawn = { row: row, col: col };
  } else {
    playerSpawn = { row: row, col: col };
  }
}
function hasPlayerSpawn(){
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (col < map[row].length && map[row][col] == "♀") {
        return true
      }
    }
  }
  return false
}
function drawGrid() {
  grid.innerHTML = "";
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (col < map[row].length) {
        let pixelElement = map[row][col];
        let pixel = document.createElement("div");
        pixel.className = "pixel";
        pixel.style.height = pixelSize + "px";
        pixel.style.lineHeight = pixelSize + "px";
        pixel.id = row * width + col;
        setMaterial(pixel, pixelElement);
        pixel.addEventListener("click", e => {
          e.srcElement.dataset["material"] = currentMaterial;
          setMaterial(e.srcElement, currentMaterial);
        });
        pixel.draggable = true;
        pixel.addEventListener('dragstart',e => {
          e.srcElement.dataset["material"] = currentMaterial;
          setMaterial(e.srcElement, currentMaterial);
        }, false);
        pixel.addEventListener('dragover', e => {
          e.srcElement.dataset["material"] = currentMaterial;
          setMaterial(e.srcElement, currentMaterial);
        }, false);
        grid.appendChild(pixel);
      }
    }
  }
}
function addRow() {
  height++;
  grid.style.gridTemplateRows = "repeat(" + height + ", 1fr)";
  drawGrid();
}
function addRowBottom() {
  map.push(" ".repeat(width + 1));
  addRow();
}
function addRowTop() {
  map.unshift(" ".repeat(width + 1));
  if(playerSpawn){
    playerSpawn.row++;
  }
  addRow();
}
function addColumn() {
  width++;
  grid.style.gridTemplateColumns = "repeat(" + width + ", 1fr)";
  drawGrid();
}
const addColRight = () => {
  for (let row = 0; row < height; row++) {
    map[row] += " ";
  }
  addColumn();
};
const addColLeft = () => {
  for (let row = 0; row < height; row++) {
    map[row] = " " + map[row];
  }
  if(playerSpawn){
    playerSpawn.col++;
  }
  addColumn();
};
function loadMap(idNum) {
  setPlayerSpawn(null,null)
  //drawGrid();
  if(idNum >= 0){
    let count=0;
    for (let world = 0; world < maps.length; world++) {
      for (let level = 0; level < maps[world].length; level++) {
        if(idNum == count){
          map = maps[world][level].map;
        }
        count++
      }
    }
  } else if (idNum == -1){
    map = [
      "ww            ",
      "ww            ",
      "w   ^^^       ",
      "w   ^^^       ",
      "w   ===       ",
      "w   =0=       ",
      "w             ",
      "wc     k      ",
      "wwc        T  ",
      "wwwc  ♀       ",
      "wwwwccccc     ",
      "wwrwwwwwcccccc",
      "wwwwwwwwwwwwww",

    ]
  } else {
    map = ["          ","          ","          ","          ","          ","          ","          ","          ","          ","          "]
  }
  height = map.length;
  grid = document.getElementById("grid");
  width = map[0].length;
  for (let row = 1; row < height; row++) {
    if (map[row].length > width) {
      width = map[row].length;
    }
  }
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (col < map[row].length && map[row][col] == "♀") {
        setPlayerSpawn(row, col);
      }
      if (col >= map[row].length) {
        // fill right edge with spaces, if necessary
        map[row] += " ";
      }
    }
  }
  grid.style.gridTemplateRows = "repeat(" + height + ", 1fr)";
  grid.style.gridTemplateColumns = "repeat(" + width + ", 1fr)";
  drawGrid();
}
function buildMapSelector() {
  let dropdown = document.getElementById("levelSelector")
  let counter = 0;
  for (let world = 0; world < maps.length; world++) {
    for (let level = 0; level < maps[world].length; level++) {
      let opt = document.createElement("option");
      opt.innerHTML = "World "+world+"-"+level;
      opt.value = counter++;
      dropdown.appendChild(opt)
    }
  }
  document.getElementById("Brick").checked=true;
  currentMaterial = "=";
  grid.style.background = "red";
  loadMap(-1);
}