class floor {
  constructor(img, type = "yellow") {
    this.floor = createSprite(mapWidth / 2, mapHeight / 2, mapWidth, mapHeight);
    this.type = type;
    this.imageSource = "images/floor.png";
    this.sourceImg = img;
    this.img = createImage(mapWidth, mapHeight);
    this.positions = floorPositions[this.type][0]["frame"];
    for (let x = 0; x < mapWidth; x += 21) {
      for (let y = 100; y < mapHeight; y += 16) {
        this.img.copy(this.sourceImg, this.positions["x"], this.positions["y"], this.positions["width"], this.positions["height"], x, y, 21, 16);
      }
    }
    this.floor.addImage("floor", this.img);
  }
  display() {
    this.floor.display();
  }
  updatePosition() {
    this.floor.position.x = mapWidth / 2;
    this.floor.position.y = mapHeight / 2;
  }
}