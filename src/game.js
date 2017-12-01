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
    this.over = false;
    this.tilemap = new Tilemap(data);
    this.player = new Player(1,1, this.tilemap, this.ctx);
    this.room = new Room(1,4, this.tilemap, this.ctx);
    this.monsters = [];
    this.weapons = [];
    this.armor = [];
    this.potion;
    this.item;
    this.bossCount = 3;
    this.roomN = {
      roomX: 1,
      roomY: 4
    }
    this.equip = {
      weapon: 1,
      armor: 0,
    }
    this.aSpeed = 10;
    this.cd = 0;

    this.data2 = new Uint16Array(data.layers[1].data);
    setTimeout(() => {
      this.score();
    }, 10);

    document.getElementById("message2").textContent = "Find the key to the castle";

    window.onkeydown = this.handleKeyDown.bind(this);
    window.onkeyup =  this.handleKeyUp.bind(this);


    this.loop = this.loop.bind(this);
    this.interval = setInterval(this.loop, 100);
  }
  score() {
    var pdata = this.player.getScore();
    var temp = ["message", "phealth", "pdamage", "parmor"];
    var temp2 = ["Lives: " + pdata.life, "Health: " + pdata.health, "Power: " + this.equip.weapon, "Armor: " + this.equip.armor];

    for(var i = 0; i<temp.length; i++) {
      document.getElementById(temp[i]).textContent = temp2[i];
    }

    this.monsters.forEach((mon) => {
      var mdata = mon.getStats();
      document.getElementById("mhealth").textContent = "Enemy Health: " + mdata.health;
      document.getElementById("mdamage").textContent = "Enemy Damage: " + mdata.damage;
    });

  }
  attackEnemy() {
    var ppos = this.player.getPosition();
    var damage = this.player.getDamage();
    this.monsters.forEach((mon) => {
      if((ppos.y === mon.y && ppos.x === mon.x-1) ||
         (ppos.y === mon.y && ppos.x === mon.x+1) ||
         (ppos.y === mon.y-1 && ppos.x === mon.x) ||
         (ppos.y === mon.y+1 && ppos.x === mon.x)
        ) {
          if(this.cd === 0) {
            this.cd = this.aSpeed;
            var dead = mon.dealDamage(damage);
            if(dead) {
              this.dropPotion(mon);
              this.clearEdata();
              if(mon.type === "boss") this.bossDefeat();
              this.monsters.pop();
              this.cd = 0;

            }
          } else this.cd--;
      }
    });
  }
  dropPotion(mon) {
    if(!this.item) {
      var rand = Math.floor(Math.random() * (100 - 1)) + 1;
      rand += mon.damage;
      if(rand > 74) {
        if(rand > 90) var z = new Item(item.potion2, this.tilemap, this.ctx, "potion");
        else var z = new Item(item.potion, this.tilemap, this.ctx, "potion");
        this.potion = z;
        this.item = z;
        this.potion.setLocation(mon.x, mon.y);
        this.potion.render();
      }
    }
  }
  clearEdata() {
    document.getElementById("mhealth").textContent = "";
    document.getElementById("mdamage").textContent = "";
    document.getElementById("message2").textContent = "";
    document.getElementById("message3").textContent = "";
  }
  itemPickup() {
    if(this.item) {
    var idata = this.item.getData();
    var ppos = this.player.getPosition();
    var text = "";

      if(idata.x === ppos.x && idata.y === ppos.y) {
        if(idata.type === "armor") {
          if(this.equip.armor < idata.value) {
            this.equip.armor = idata.value;
            text = "You picked up a stronger piece of armor!";
          } else text = "You picked up a weaker piece of armor and discarded it!";
          this.armor.pop();
          this.player.setArmor(this.equip.armor);
        }
        else if(idata.type === "weapon"){
          if(this.equip.weapon < idata.value) {
            this.equip.weapon = idata.value;
            text = "You picked up a stronger weapon!";
          } else text = "You picked up a weaker weapon and discarded it!";
          this.weapons.pop();
          this.player.setWeapon(this.equip.weapon);
        }
        else if(idata.type === "potion"){
          text = "You drank a poition and gained " + this.potion.value + " health!";
          this.player.drinkPotion(this.potion.value);
          this.potion = undefined;
        }
        document.getElementById("message3").textContent = text;
        this.item.delete(this.roomN);
        this.item = undefined;
      }
    }
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
            this.attackEnemy();
          break;
        case 'x':
            this.itemPickup();
          break;
      }
  }
  handleKeyUp(event) {
    event.preventDefault();
        switch(event.key){
          case 'a':
          case 'ArrowLeft':
            if(this.input.dX === -1) this.input.dX = 0;
          case 'd':
          case 'ArrowRight':
            if(this.input.dX === 1) this.input.dX = 0;
            this.input.dY = 0;
          case 'w':
          case 'ArrowUp':
            if(this.input.dY === -1) this.input.dY = 0;
            break;
          case 's':
          case 'ArrowDown':
            if(this.input.dY === 1) this.input.dY = 0;
            break;
        }
  }
  gameStart() {

  }
  gameOver() {
    document.getElementById("message2").textContent = "You lost all your lives! Game Over!";
    this.over= true;
  }
  gameWon() {
    document.getElementById("message2").textContent = "You won!";
    this.over = true;
  }
  bossDefeat() {
    this.bossCount--;
    switch(this.bossCount) {
      case 2:
        this.tilemap.boss1();
        document.getElementById("message2").textContent = "You've obtained a key to the castle!";
        break;
      case 1:
      this.tilemap.boss2();
      document.getElementById("message2").textContent = "You've obtained a key to the dungeon!";
        break;
      case 0:
        this.gameWon();
        break;
    }
  }
  monsterC() {
    var x = this.roomN.roomX;
    var y = this.roomN.roomY;
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
  itemC(){
    var x = this.roomN.roomX;
    var y = this.roomN.roomY;
    var z;

    this.armor.forEach((arm) => {
      this.armor.pop();
    });
    this.weapons.forEach((weap) => {
      this.weapons.pop();
    });
    this.potion = undefined;

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
      if(id === item.potion2.id) {
        z = new Item(item.potion2, this.tilemap, this.ctx, "potion");
        this.potion = z;
      }
        this.item = z;
    }
  }
  respawn() {
    this.clearEdata();
    this.roomN = {
      roomX: 1,
      roomY: 4
    }
    this.monsters = [];
    this.weapons = [];
    this.armor = [];
    this.room.update(this.roomN);
    document.getElementById("message2").textContent = "You died!";
    if(this.player.getScore().life === 0) this.gameOver();
  }
  monsterD() {
    var ppos = this.player.getPosition();
    this.monsters.forEach((mon) => {
      var damage = mon.update(ppos, this.room.getRoom());
      var respawn = this.player.dealDamage(damage);
      if(respawn) {
        this.respawn();
      }
    });
  }
  update() {
    var roomN2 = this.player.update(this.input, this.roomN, this.monsters);

    if (this.roomN.roomX !== roomN2.roomX || this.roomN.roomY !== roomN2.roomY) {
      this.clearEdata();
      this.roomN = roomN2;
      this.room.update(this.roomN);
      this.monsterC();
      this.itemC();
    }

    this.monsterD();

    this.score();

  }
  render() {
    this.ctx.save();
    this.armor.forEach((arm) => {
      arm.render();
    });
    this.weapons.forEach((weap) => {
      weap.render();
    });
    if(this.potion) this.potion.render();
    this.monsters.forEach((mon) => {
      mon.render();
    });
    this.player.render();
    this.ctx.restore();
  }
  loop() {
    if(!this.over) {
      this.update();
      this.render();
    }
  }
}
