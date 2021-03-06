//https://www.reinerstilesets.de
let player1;
let players = [];
let playerSpriteSheet = "images/person.png";
let frameDelay = 6;
let test;
let arrowImg = "images/arrow.png";
let walls;
let sprintSpeed = 3;
let walkSpeed = 1;
let imgFloor, imgWalls, imgArrow;

let spriteSheetTypes = {};
let animationTypes = {};

let mousex = 0, mousey = 0;
let locked = false;

let lastPos = {
  x: undefined,
  y: undefined,
}

let Canvas;

let socket;

let mapWidth = 800,
  mapHeight = 600;

let KEYW = 87,
  KEYA = 65,
  KEYS = 83,
  KEYD = 68,
  KEYF = 70,
  KEYY = 89,
  KEYX = 88,
  KEYE = 69,
  KEYC = 67,
  SPACE = 32,
  KEYF3 = 114,
  CTRL = 17,
  KEYB = 66;

let keysBeingPressed = {
  "KEYW": false,
  "KEYS": false,
  "KEYA": false,
  "KEYD": false,
  "KEYF": false,
  "SPACE": false,
  "KEYY": false,
  "KEYX": false,
  "KEYE": false,
  "CTRL": false,
}

let debug = false;

/* window.onbeforeunload = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.returnValue = "sicher?";
} */

function loadImg(filename) {
  document.getElementById("p5_loading").innerText = "Loading: " + filename;
  return loadImage(filename);
}

p5.prototype.Sprite.prototype.changeAnim = function(animation) {
  this.animation.rewind();
  this.changeAnimation(animation);
}
p5.prototype.Sprite.prototype.move = function(dir) {
  if (!(["front", "back", "right", "left"].includes(dir))) return;
  this.dir = dir;
  if (this.run) this.changeAnim("run_" + this.dir);
  else this.changeAnim("walk_" + this.dir);
  if (this.dir == "front") {
    this.velocity.x = 0;
    this.velocity.y = this.run ? sprintSpeed : walkSpeed;
  } else if (this.dir == "back") {
    this.velocity.x = 0;
    this.velocity.y = this.run ? -sprintSpeed : -walkSpeed;
  } else if (this.dir == "right") {
    this.velocity.x = this.run ? sprintSpeed : walkSpeed;
    this.velocity.y = 0;
  } else if (this.dir == "left") {
    this.velocity.x = this.run ? -sprintSpeed : -walkSpeed;
    this.velocity.y = 0;
  }
}
function initAnimation(player, playerSpriteSheet, name, options, animName) {
  let anim = animationTypes[animName || name];
  anim["frameDelay"] = frameDelay;
  for (let i of Object.keys(options)) {
    anim[i] = options[i];
  }
  player.addAnimation(name, anim);
}

function initAnimations(player, playerSpriteSheet, names) {
  for (let name of names) {
    initAnimation(player, playerSpriteSheet, name["name"], name["options"] || {}, name["animName"]);
  }
}
function preload() {
  console.log("Starting preload")
  let start = millis();
  document.getElementById("p5_loading").innerText = "Initializing";
  imgFloor = loadImg("images/floor.png");
  imgWalls = loadImg("images/walls.png");
  imgArrow = loadImg("images/arrow.png");
  for (let i of Object.keys(framePositions)) {
    document.getElementById("p5_loading").innerText = "Loading: Sprite " + i + " of " + playerSpriteSheet;
    spriteSheetTypes[i] = loadSpriteSheet(playerSpriteSheet, framePositions[i]);
    animationTypes[i] = loadAnimation(spriteSheetTypes[i]);
  }
  document.getElementById("p5_loading").innerText = "Connecting...";
  socket = io.connect();
  socket.on("init", function(data) {
    player1 = new player(playerSpriteSheet, lastPos.x || 100, lastPos.y || 100, 0, data.id);
    lastPos = { x: undefined, y: undefined, };
    players.push(player1);
    setTimeout(sendUpdate);
  });
  socket.on("disconnection", function(data) {
    let playerIndex = players.findIndex((ele) => ele.id == data.id);
    if (playerIndex != -1) {
      players[playerIndex].text.remove();
      players[playerIndex].player = null;
      players[playerIndex] = null;
      players.splice(playerIndex, 1);
    }
  });
  socket.on("disconnect", function(data) {
    lastPos = { x: player1.player.position.x, y: player1.player.position.y, };
    let playerIndex = players.findIndex((ele) => ele.id == player1.id);
    if (playerIndex != -1) {
      players[playerIndex].text.remove();
      players[playerIndex].player = null;
      players[playerIndex] = null;
      players.splice(playerIndex, 1);
    }
  });
  socket.on("update", function(data) {
    if (player1) {
      let p = players.find((ele) => ele.id == data.id) || new player(playerSpriteSheet, data.position.x, data.position.y, data.data, data.id, data.hp);
      if (!players.includes(p)) players.push(p);
      p.updateData(data.data);
      p.updatePosition(data.position);
      p.text.elt.value = data.name;
      //p.hp = data.hp;
    }
  });
  document.getElementById("p5_loading").innerText = "Done!";
  console.log("Ending preload. Took " + (millis() - start) + "ms.")
}

function updateKeys(code, state) {
  if (!player1) return;
  for (let i in Object.values(player1.keys)) {
    if (Object.values(player1.keys)[i] == code) {
      player1.directionPressed[Object.keys(player1.keys)[i]] = state;
    }
  }
}

function setup() {
  /* pointerLockInit(); */
  currentWidth = windowWidth;
  currentHeight = windowHeight;
  Canvas = createCanvas(displayWidth, displayHeight);
  walls = new wall(imgWalls);
  floor1 = new floor(imgFloor, "yellow");
  frameRate(60);
  setInterval(checkFocus, 200);

  document.addEventListener("keydown", function(e) {
    if (!focused) return;
    e = e || window.event;
    if (e.keyCode == KEYB) {
      e.returnValue = false;
      e.preventDefault()
      e.stopPropagation();
      debug = !debug;
      return false;
    }
    setTimeout(sendUpdate);
    if (Object.values(player1.keys).includes(e.keyCode)) {
      e.returnValue = false;
      e.preventDefault()
      e.stopPropagation();
      updateKeys(e.keyCode, true);
      return false;
    }
  }, false);

  document.addEventListener("keyup", function(e) {
    setTimeout(sendUpdate);
    if (Object.values(player1.keys).includes(e.keyCode)) {
      updateKeys(e.keyCode, false);
    }
  })
}

function checkFocus() {
  if (!document.hasFocus()) {
    player1.stop()
    setTimeout(sendUpdate);
  }
}

function draw() {
  scale(min(windowWidth / mapWidth, windowHeight / mapHeight));
  background(200);
  floor1.display();
  walls.display();
  players = players.sort((a, b) => { return a.player.position.y < b.player.position.y ? -1 : 1 })
  for (let player of players) {
    player.display();
    if (focused || player != player1) player.update();
  }
  walls.displayOver();
  fill(0);
  rect(0, -50, 10, 10);
}

function sendUpdate() {
  socket.emit("update", {
    data: player1.getData(),
    id: player1.id,
    position: {
      x: player1.player.position.x,
      y: player1.player.position.y
    },
    name: player1.text.elt.value,
    hp: player1.hp,
  })
}

function mousePressed() {
  fullscreen(true)
}
function windowResized() {
  console.log("resized")
}
