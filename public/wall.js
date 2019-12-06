class wall {
  constructor(img) {
    this.walls = Group();
    this.wallsOver = Group();
    this.imageSource = "images/walls.png";
    this.wall_top = createSprite(mapWidth / 2, 48, mapWidth, 128);
    this.wall_left = createSprite(0, mapHeight / 2, 64, mapHeight);
    this.wall_right = createSprite(mapWidth - 32, mapHeight / 2, 64, mapHeight);
    this.wall_bottom = createSprite(mapWidth / 2, mapHeight + 30, mapWidth, 128);
    this.img_top = createImage(mapWidth, 128);
    this.img_left = createImage(64, mapHeight);
    this.img_right = createImage(64, mapHeight);
    this.img_bottom = createImage(mapWidth, 128);
    this.sourceImage = img;

    this.img_top.copy(this.sourceImage, this._getPositions("cross")["x"], this._getPositions("cross")["y"], this._getPositions("cross")["width"], this._getPositions("cross")["height"], -53, 0, this._getPositions("cross")["width"], this._getPositions("cross")["height"]);

    for (let x = 75; x < mapWidth - 32; x += 64)
      this.img_top.copy(this.sourceImage, this._getPositions("wall")["x"], this._getPositions("wall")["y"], this._getPositions("wall")["width"], this._getPositions("wall")["height"], x, 0, this._getPositions("wall")["width"], this._getPositions("wall")["height"]);

    this.img_top.copy(this.sourceImage, this._getPositions("cross")["x"], this._getPositions("cross")["y"], this._getPositions("cross")["width"], this._getPositions("cross")["height"], mapWidth - 74, 0, this._getPositions("cross")["width"], this._getPositions("cross")["height"]);

    for (let y = 40; y < mapHeight + 24; y += 48)
      this.img_left.copy(this.sourceImage, this._getPositions("top_down")["x"], this._getPositions("top_down")["y"], this._getPositions("top_down")["width"], this._getPositions("top_down")["height"], 11, y, this._getPositions("top_down")["width"], this._getPositions("top_down")["height"]);

    for (let y = 40; y < mapHeight + 24; y += 48)
      this.img_right.copy(this.sourceImage, this._getPositions("top_down")["x"], this._getPositions("top_down")["y"], this._getPositions("top_down")["width"], this._getPositions("top_down")["height"], 22, y, this._getPositions("top_down")["width"], this._getPositions("top_down")["height"]);

    this.img_bottom.copy(this.sourceImage, this._getPositions("cross")["x"], this._getPositions("cross")["y"], this._getPositions("cross")["width"], this._getPositions("cross")["height"], -53, 0, this._getPositions("cross")["width"], this._getPositions("cross")["height"]);

    for (let x = 75; x < width - 32; x += 64)
      this.img_bottom.copy(this.sourceImage, this._getPositions("wall")["x"], this._getPositions("wall")["y"], this._getPositions("wall")["width"], this._getPositions("wall")["height"], x, 0, this._getPositions("wall")["width"], this._getPositions("wall")["height"]);

    this.img_bottom.copy(this.sourceImage, this._getPositions("cross")["x"], this._getPositions("cross")["y"], this._getPositions("cross")["width"], this._getPositions("cross")["height"], mapWidth - 75, 0, this._getPositions("cross")["width"], this._getPositions("cross")["height"]);

    this.wall_top.addImage("wall", this.img_top);
    this.wall_left.addImage("wall", this.img_left);
    this.wall_right.addImage("wall", this.img_right);
    this.wall_bottom.addImage("wall", this.img_bottom);

    this.wall_top.setCollider("rectangle", 0, -12, mapWidth, 48)
    this.wall_left.setCollider("rectangle", 16, 0, 20, mapHeight)
    this.wall_right.setCollider("rectangle", 16, 0, 20, mapHeight)
    this.wall_bottom.setCollider("rectangle", 0, -12, mapWidth, 48)

    this.wall_top.addToGroup(this.walls);
    this.wall_left.addToGroup(this.walls);
    this.wall_right.addToGroup(this.walls);
    this.wall_bottom.addToGroup(this.walls);
    this.wall_bottom.addToGroup(this.wallsOver);
  }
  display() {
    this.walls.draw();
  }
  displayOver() {
    this.wallsOver.draw();
  }
  _getPositions(type) {
    return wallsPositions[type][0]["frame"];
  }

  updatePosition() {
    this.wall_top.position.x = mapWidth / 2;
    this.wall_top.position.y = 48;
    this.wall_left.position.x = 0;
    this.wall_left.position.y = mapHeight / 2;
    this.wall_right.position.x = mapWidth - 32;
    this.wall_right.position.y = mapHeight / 2;
    this.wall_bottom.position.x = mapWidth / 2;
    this.wall_bottom.position.y = mapHeight + 30;
  }
}