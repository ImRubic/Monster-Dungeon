import Tilemap from './tilemap';
import data from './gameMap.json';
import monster from './monsters.json';
import item from './item.json';
import Item from './item';
import Monster from './monster'
import Player from './player';
import Room from './room';

export default class Game {
  constructor(width, height, context) {
    this.width = width;
    this.height = height;
    this.ctx = context;
    this.input = {
      dX: 0,
      dY: 0,
    };

    this.tilemap = new Tilemap(data);
    this.player = new Player(1,1, this.tilemap, this.ctx);
    this.room = new Room(1,4, this.tilemap, this.ctx);
    this.monsters = [];
    this.weapons = [];
    this.armor = [];
    this.item;
    this.roomN;
    this.bossCount = 3;
    this.equip = {
      weapon: 1,
      armor: 0,
    }

    this.score();

    window.onkeydown = this.handleKeyDown.bind(this);
    window.onkeyup =  this.handleKeyUp.bind(this);

    this.loop = this.loop.bind(this);
    this.interval = setInterval(this.loop, 100);
  }
  score() {
    var pdata = this.player.getScore();
    var life = pdata.life;
    var health = pdata.health;
    var message = document.getElementById("message");
    message.textContent = "Lives: " + life + " Health: " + health;
  }
  handleKeyDown(event) {
    event.preventDefault();
      switch(event.key){
        case 'a':
        case 'ArrowLeft':
          this.input.dX = -1;
          this.input.dY = 0;
          break;
        case 'd':
        case 'ArrowRight':
          this.input.dX = 1;
          this.input.dY = 0;
          break;
        case 'w':
        case 'ArrowUp':
          this.input.dX = 0;
          this.input.dY = -1;
          break;
        case 's':
        case 'ArrowDown':
          this.input.dX = 0;
          this.input.dY = 1;
          break;
        case 'z':
          var ppos = this.player.getPosition();
          var damage = this.player.getDamage();
          this.monsters.forEach((mon) => {
            if((mon.x-ppos.x < 2 && mon.x-ppos.x > -2) && (mon.y-ppos.y < 2 && mon.y-ppos.y > -2)) {
              var dead = mon.dealDamage(damage);
              if(dead) this.monsters.pop();
            }
          });
          break;
        case 'x':
          if(this.item) {
          var idata = this.item.getData();
          var ppos = this.player.getPosition();
          var roomN = this.room.getRoom();
          if(idata.x === ppos.x && idata.y === ppos.y) {
            if(idata.type === "armor") {
              if(this.equip.armor < idata.value) this.equip.armor = idata.value;
              this.armor.pop();
              this.player.setArmor(this.equip.armor);
            }
            else {
              if(this.equip.weapon < idata.value) this.equip.weapon = idata.value;
              this.weapons.pop();
              this.player.setWeapon(this.equip.weapon);
            }
            this.item.delete(roomN);
            this.item.undefined;
          }
        }
          break;
      }
  }
  handleKeyUp(event) {
    event.preventDefault();
        switch(event.key){
          case 'a':
          case 'ArrowLeft':
            this.input.dX = 0;
            this.input.dY = 0;
          case 'd':
          case 'ArrowRight':
            this.input.dX = 0;
            this.input.dY = 0;
          case 'w':
          case 'ArrowUp':
            this.input.dX = 0;
            this.input.dY = 0;
            break;
          case 's':
          case 'ArrowDown':
            this.input.dX = 0;
            this.input.dY = 0;
            break;
        }
  }
  gameStart() {

  }
  gameOver() {

  }
  gameWon() {

  }
  bossDefeat() {
    this.bossCount--;
    switch(this.bossCount) {
      case 2:
        break;
      case 1:
        break;
      case 0:
        this.gameWon();
        break;
    }
  }
  monsterC(roomN) {
    var x = roomN.roomX;
    var y = roomN.roomY;
    this.monsters.forEach((mon) => {
      this.monsters.pop();
    });

    if (monster.monsters0[y][x][0] !== null) {
      var id = monster.monsters0[y][x][0];
      monster.monsters.forEach((mon) => {
            if(id === mon.id) {
              this.monsters.push(new Monster(mon, this.tilemap, this.ctx));
            }
          });
    }
  }
  itemC(roomN){
    var x = roomN.roomX;
    var y = roomN.roomY;
    var z;

    this.armor.forEach((arm) => {
      this.armor.pop();
    });
    this.weapons.forEach((weap) => {
      this.weapons.pop();
    });

    if (item.item0[y][x][0] !== null) {
      var id = item.item0[y][x][0];

      item.weapons.forEach((weap) => {
            if(id === weap.id) {
              z = new Item(weap, this.tilemap, this.ctx, "weapon");
              this.weapons.push(z);
            }
          });
      item.armor.forEach((arm) => {
            if(id === arm.id) {
              z = new Item(arm, this.tilemap, this.ctx, "armor");
              this.armor.push(z);
            }
          });
        this. item = z;
    }
  }
  update() {
    var roomN = this.room.getRoom();
    var roomN2 = this.player.update(this.input, roomN, this.monsters);

    if (roomN.roomX !== roomN2.roomX || roomN.roomY !== roomN2.roomY) {
      this.room.update(roomN2);
      this.monsterC(roomN2);
      this.itemC(roomN2);
    }

    var ppos = this.player.getPosition();
    this.monsters.forEach((mon) => {
      var damage = mon.update(ppos, this.room.getRoom());
      var respawn = this.player.dealDamage(damage);
      if(respawn) {
        this.tilemap = new Tilemap(data);
        this.room = new Room(1,4, this.tilemap, this.ctx);
        this.monsters = [];
        this.weapons = [];
        this.armor = [];
      }
    });
    this.score();

  }
  render() {
    this.ctx.save();
    this.monsters.forEach((mon) => {
      mon.render();
    });
    this.armor.forEach((arm) => {
      arm.render();
    });
    this.weapons.forEach((weap) => {
      weap.render();
    });
    this.player.render();
    this.ctx.restore();
  }
  loop() {
    this.update();
    this.render();

  }
}
