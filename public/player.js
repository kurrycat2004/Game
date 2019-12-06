class player {
  constructor(spritesheet, x = 0, y = 0, steuerung = 0, id = undefined) {
    this.player = createSprite(x, y, 128, 128);
    this.id = id;
    initAnimations(this.player, spritesheet,
      [
        { "name": "spellcast_back", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "spellcast_left", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "spellcast_front", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "spellcast_right", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "thrust_back", "options": { "looping": false } },
        { "name": "thrust_left", "options": { "looping": false } },
        { "name": "thrust_front", "options": { "looping": false } },
        { "name": "thrust_right", "options": { "looping": false } },
        { "name": "walk_back" },
        { "name": "walk_left" },
        { "name": "walk_front" },
        { "name": "walk_right" },
        { "name": "run_back", "animName": "walk_back", "options": { "frameDelay": 4 } },
        { "name": "run_left", "animName": "walk_left", "options": { "frameDelay": 4 } },
        { "name": "run_front", "animName": "walk_front", "options": { "frameDelay": 4 } },
        { "name": "run_right", "animName": "walk_right", "options": { "frameDelay": 4 } },
        { "name": "slash_back", "options": { "looping": false } },
        { "name": "slash_left", "options": { "looping": false } },
        { "name": "slash_front", "options": { "looping": false } },
        { "name": "slash_right", "options": { "looping": false } },
        { "name": "shoot_back", "options": { "looping": false, "frameDelay": 4 } },
        { "name": "shoot_left", "options": { "looping": false, "frameDelay": 4 } },
        { "name": "shoot_front", "options": { "looping": false, "frameDelay": 4 } },
        { "name": "shoot_right", "options": { "looping": false, "frameDelay": 4 } },
        { "name": "hurt", "options": { "looping": false } },
        { "name": "stand_back" },
        { "name": "stand_left" },
        { "name": "stand_front" },
        { "name": "stand_right" },
        { "name": "oversize_back", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "oversize_left", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "oversize_front", "options": { "looping": false, "frameDelay": 8 } },
        { "name": "oversize_right", "options": { "looping": false, "frameDelay": 8 } },
      ]);
    this.player.changeAnim("stand_front")
    this.player.setCollider("rectangle", 0, 0, 64, 64);
    this.player.dir = "front";
    this.player.run = false;
    this.attacking = false;
    this.keys = {
      "up": KEYW,
      "down": KEYS,
      "left": KEYA,
      "right": KEYD,
      "shoot": KEYF,
      "slash_long": SPACE,
      "spellcast": KEYY,
      "slash": KEYX,
      "thrust": KEYE,
      "run": SHIFT,
    }
    if (Number.isInteger(steuerung)) {
      /* this.directionPressed = {
        get ["up"]() { return keyIsDown(player1.keys["up"]) },
        get ["down"]() { return keyIsDown(player1.keys["down"]) },
        get ["left"]() { return keyIsDown(player1.keys["left"]) },
        get ["right"]() { return keyIsDown(player1.keys["right"]) },
        get ["shoot"]() { return keyIsDown(player1.keys["shoot"]) },
        get ["slash_long"]() { return keyIsDown(player1.keys["slash_long"]) },
        get ["spellcast"]() { return keyIsDown(player1.keys["spellcast"]) },
        get ["slash"]() { return keyIsDown(player1.keys["slash"]) },
        get ["thrust"]() { return keyIsDown(player1.keys["thrust"]) },
        get ["run"]() { return keyIsDown(player1.keys["run"]) },
      } */
      this.directionPressed = {
        up: false,
        down: false,
        left: false,
        right: false,
        shoot: false,
        slash_long: false,
        spellcast: false,
        slash: false,
        thrust: false,
        run: false,
      }
    } else {
      this.directionPressed = steuerung;
    }

    this.arrows = [];
    this.extensions = [];
    this.shootArrow = false;
    this.attacked = false;
    this.hp = 100;

    this.text = createElement("input");
    this.text.id(this.id);
    this.text.attribute("value", this.id);
    this.text.attribute("readonly", "");
    this.text.attribute("maxlength", "12");
    if (!player1 || this.id == player1.id) {
      this.text.doubleClicked(function() {
        this.removeAttribute("readonly")
        focused = false;
      });
      document.getElementById(this.id).addEventListener("focusout", function() {
        document.getElementById(this.id).readOnly = true;
        focused = true;
      })
    }
    this.text.style("text-align", "center");
    this.text.style("background", "transparent");
    this.text.style("border", "none");
    this.text.style("color", "white");
  }
  updateData(data) {
    this.directionPressed = data;
  }

  updatePosition(pos) {
    this.player.position.x = pos.x;
    this.player.position.y = pos.y;
  }

  getData() {
    if (!focused) return {};
    let data = {
      up: this.directionPressed.up,
      down: this.directionPressed.down,
      left: this.directionPressed.left,
      right: this.directionPressed.right,
      shoot: this.directionPressed.shoot,
      slash_long: this.directionPressed.slash_long,
      spellcast: this.directionPressed.spellcast,
      slash: this.directionPressed.slash,
      thrust: this.directionPressed.thrust,
      run: this.directionPressed.run,
    };
    return data;
  }

  display() {
    this.text.position(this.player.position.x * min(windowWidth / 800, windowHeight / 400) - document.getElementById(this.id).getBoundingClientRect().width / 2, (this.player.position.y - 48) * min(windowWidth / 800, windowHeight / 400));
    this.text.style("font-size", (13.5 * min(windowWidth / 800, windowHeight / 400)) + "px");
    for (let i of this.extensions) {
      i.obj.display();
    }
    if (this.player.dir != "back")
      this.player.display();
    for (let i of this.arrows) {
      i.display();
    }
    if (this.player.dir == "back")
      this.player.display();
    noFill();
    stroke(0);
    rect(this.player.position.x - 40, this.player.position.y - 31.5, 80, 10);
    noStroke();
    fill(200, 20, 20);
    rect(this.player.position.x - 38.5, this.player.position.y - 30, this.hp / 100 * 78, 8);
    this.player.debug = debug;
  }

  isAttacking() {
    for (let i of Object.keys(this.directionPressed)) {
      if (this.directionPressed[i]) return true;
    }
    return false;
  }

  update() {
    this.player.collide(walls.walls)
    /* for (let i of this.arrows) {
      i.update();
    } */
    if (this.attacking && this.player.animation.getFrame() == this.player.animation.getLastFrame()) {
      this.attacking = false;
    }
    if (this.shootArrow && this.player.animation.getFrame() == 8) {
      this.arrows.push(new arrow(this, this.player.position.x, this.player.position.y, this.player.dir))
      this.shootArrow = false;
    }

    if (!this.attacking || !this.attacked) {

      if (this.directionPressed.shoot) {
        this.shoot();
      }
      if (this.directionPressed.slash_long) {
        this.slash_long();
      }
      if (this.directionPressed.spellcast) {
        this.spellcast();
      }
      if (this.directionPressed.slash) {
        this.slash();
      }
      if (this.directionPressed.thrust) {
        this.thrust();
      }
    }
    this.attacked = this.isAttacking();

    if (this.attacking) return;
    
    if (this.directionPressed.run && !this.player.run) {
      this.startRunning();
    }
    else if (this.player.run && !this.directionPressed.run) {
      this.stopRunning()
    }
    if (this.directionPressed.up) {

      if (!(this.player.velocity.x == 0 && this.player.velocity.y < 0)) {
        this.player.move("back");
      }
    } else if (this.directionPressed.left) {
      if (!(this.player.velocity.x < 0 && this.player.velocity.y == 0)) {
        this.player.move("left");
      }
    } else if (this.directionPressed.down) {
      if (!(this.player.velocity.x == 0 && this.player.velocity.y > 0)) {
        this.player.move("front");
      }
    } else if (this.directionPressed.right) {
      if (!(this.player.velocity.x > 0 && this.player.velocity.y == 0)) {
        this.player.move("right");
      }
    } else if (!this.attacking) {
      this.player.changeAnim("stand_" + this.player.dir)
      this.player.velocity.x = 0;
      this.player.velocity.y = 0;
    }
    for (let i of this.extensions) {
      i.obj.setPos(this.player.position.x + i.offX, this.player.position.y + i.offY);
    }
  }

  stop() {
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
    this.shootArrow = false;
    this.attacking = false;
    this.player.changeAnim("stand_" + this.player.dir);
  }

  slash() {
    this.stop();
    this.player.changeAnim("slash_" + this.player.dir);
    this.attacking = true;
  }
  thrust() {
    this.stop();
    this.player.changeAnim("thrust_" + this.player.dir);
    this.attacking = true;
  }
  spellcast() {
    this.stop();
    this.player.changeAnim("spellcast_" + this.player.dir);
    this.attacking = true;
  }
  shoot() {
    this.stop();
    this.player.changeAnim("shoot_" + this.player.dir);
    this.attacking = true;
    this.shootArrow = true;
  }
  hurt() {
    this.stop();
    this.player.changeAnim("hurt");
    this.attacking = true;
  }
  slash_long() {
    this.stop();
    this.player.changeAnim("oversize_" + this.player.dir);
    this.attacking = true;
  }
  startRunning() {
    this.player.run = true;
    if (this.directionPressed.up) {
      this.player.move("back");
    } else if (this.directionPressed.left) {
      this.player.move("left");
    } else if (this.directionPressed.down) {
      this.player.move("front");
    } else if (this.directionPressed.right) {
      this.player.move("right");
    }
  }
  stopRunning() {
    this.player.run = false;
    if (this.directionPressed.up) {
      this.player.move("back");
    } else if (this.directionPressed.left) {
      this.player.move("left");
    } else if (this.directionPressed.down) {
      this.player.move("front");
    } else if (this.directionPressed.right) {
      this.player.move("right");
    }
  }
}