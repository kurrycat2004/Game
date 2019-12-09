class arrow {
  constructor(parent, x, y, dir) {
    this.arrow = createSprite(x, y, 64, 64);
    this.arrow.addImage("arrow", imgArrow);
    this.arrow.rotateToDirection = true;
    this.direction = {}
    this.parent = parent;
    if (dir == "front") {
      this.direction.x = 0;
      this.direction.y = 5;
    } else if (dir == "back") {
      this.direction.x = 0;
      this.direction.y = -5;
    } else if (dir == "left") {
      this.direction.x = -5;
      this.direction.y = 0;
    } else if (dir == "right") {
      this.direction.x = 5;
      this.direction.y = 0;
    }
    this.arrow.setVelocity(this.direction.x, this.direction.y)
    this.arrow.setCollider("rectangle", 0, 0, 32, 8)
    this.arrow.life = 300;
    this.shot;
    this.updateArrow = setInterval(this.update, 1000 / 60, this);
  }
  update(obj = this) {
    if (obj.arrow.life == 0) {
      if (obj.parent.arrows.indexOf(obj) != -1) obj.parent.arrows.splice(obj.parent.arrows.indexOf(obj), 1);
      if (obj.shot && obj.shot.extensions.findIndex((ele) => { return ele.obj == obj }) != -1) obj.shot.extensions.splice(obj.shot.extensions.findIndex((ele) => { return ele.obj == obj }), 1);
      obj.arrow.remove();
      clearInterval(obj.updateArrow);
      delete obj.updateArrow;
      delete obj.arrow;
      return;
    }
    for (let player of players) {
      if (player == obj.parent) continue;
      if (player.player.overlapPixel(obj.arrow.position.x, obj.arrow.position.y)) {
        obj.arrow.setVelocity(0, 0);
        obj.parent.arrows.splice(obj.parent.arrows.indexOf(obj), 1);
        obj.arrow.life = 1000;
        obj.shot = player;
        player.extensions.push({
          obj: obj,
          offX: obj.arrow.position.x - player.player.position.x,
          offY: obj.arrow.position.y - player.player.position.y
        });
        player.hp -= 10;
        player.hp = constrain(player.hp, 0, 100)
        clearInterval(obj.updateArrow);
        delete obj.updateArrow;
      }
    }
    obj.arrow.collide(walls.walls)
  }
  setPos(x, y) {
    this.arrow.position.x = x;
    this.arrow.position.y = y;
  }
  display() {
    this.arrow.debug = debug;
    this.arrow.display();
  }
}