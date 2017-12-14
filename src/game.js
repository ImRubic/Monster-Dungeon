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

    //Game Varaibles
    this.width = width;
    this.height = height;
    this.ctx = context;
    this.state = "Menu";

    //Input Varaibles
    this.input;
    this.roomN;
    this.attack = false;

    //Game State
    this.over = false;

    //Object Varaibles
    this.tilemap;
    this.player;
    this.room;
    this.monsters = [];
    this.weapons = undefined;
    this.armor = undefined;
    this.potion = [];
    this.item = [];

    //Counter Varaibles
    this.bossCount;
    this.equip;

    //Attack Speed varaibles
    this.aSpeed;
    this.cd;

    this.menuLoad();

    //Key handler
    window.onkeydown = this.handleKeyDown.bind(this);
    window.onkeyup =  this.handleKeyUp.bind(this);

    //Game Loop
    this.loop = this.loop.bind(this);
    this.interval = setInterval(this.loop, 100);
  }
  menuLoad() {
    this.ctx.save();
    this.ctx.font = "10px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Press Enter", 150, 200);
    this.ctx.restore();
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
      var rand = Math.floor(Math.random() * (100 - 1)) + 1;
      rand += mon.damage;
      if(rand > 74) {
        if(rand > 90) var z = new Item(item.potion[1], this.tilemap, this.ctx, "potion");
        else var z = new Item(item.potion[0], this.tilemap, this.ctx, "potion");
        this.potion.push(z);
        this.item.push(z);
        z.setLocation(mon.x, mon.y);
        z.render();
      }
  }
  clearEdata() {
    var temp = ["mhealth", "mdamage", "message2"];

    for(var i = 0; i<temp.length; i++) {
      document.getElementById(temp[i]).textContent = "";
    }
  }
  equipArmor(idata) {
    var text = "";

    if(this.equip.armor < idata.value) {
      this.equip.armor = idata.value;
      text = "You picked up a stronger piece of armor!";
    } else text = "You picked up a weaker piece of armor and discarded it!";
    this.armor = undefined;
    this.player.setArmor(this.equip.armor);
    return text;
  }
  equipWeapon(idata) {
    var text = "";

    if(this.equip.weapon < idata.value) {
      this.equip.weapon = idata.value;
      text = "You picked up a stronger weapon!";
    } else text = "You picked up a weaker weapon and discarded it!";
    this.weapons = undefined;
    this.player.setWeapon(this.equip.weapon);
    return text;
  }
  itemPickup() {
    this.item.forEach((itemObj) => {
      var idata = itemObj.getData();
      var ppos = this.player.getPosition();
      var text = "";

        if(idata.x === ppos.x && idata.y === ppos.y) {
          switch(idata.type) {
            case "armor":
              text = this.equipArmor(idata);
              break;
            case "weapon":
              text = this.equipWeapon(idata);
              break;
            case "potion":
              text = "You drank a poition and gained " + idata.value + " health!";
              this.player.drinkPotion(idata.value);
              this.potion.splice(this.potion.indexOf(itemObj), 1);
            break;
          }
          document.getElementById("message2").textContent = text;
          itemObj.delete(this.roomN);
          this.item.splice(this.item.indexOf(itemObj), 1);
        }
    });
  }
  handleKeyDown(event) {
    event.preventDefault();
    if(this.state === "Game"){
      switch(event.key){
        case 'a':
        case 'ArrowLeft':
          this.input.dX = -1;
          this.input.dY = 0;
          this.attack = false;
          break;
        case 'd':
        case 'ArrowRight':
          this.input.dX = 1;
          this.input.dY = 0;
          this.attack = false;
          break;
        case 'w':
        case 'ArrowUp':
          this.input.dX = 0;
          this.input.dY = -1;
          this.attack = false;
          break;
        case 's':
        case 'ArrowDown':
          this.input.dX = 0;
          this.input.dY = 1;
          this.attack = false;
          break;
        case 'z':
            this.attack = true;
          break;
        case 'x':
            this.attack = false;
            this.itemPickup();
          break;
      }
    } else if(this.state === "Menu"){
      switch(event.key){
        case 'Enter':
          this.state = "Game";
          this.gameStart();
          break;
      }
    }
  }
  handleKeyUp(event) {
    if(this.state === "Game") {
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
  }
  gameStart() {

    //Input Varaibles
    this.input = {
      dX: 0,
      dY: 0,
    };
    this.roomN = {
      roomX: 1,
      roomY: 4
    }

    //Game State
    this.over = false;

    //Object Varaibles
    this.tilemap = new Tilemap();
    this.player = new Player(1,1, this.tilemap, this.ctx);

    setTimeout(() => {
      this.room = new Room(this.roomN.roomX,this.roomN.roomY, this.tilemap, this.ctx);
    }, 100);

    this.monsters = [];
    this.weapons = undefined;
    this.armor = undefined;
    this.potion = [];
    this.item = [];

    //Counter Varaibles
    this.bossCount = 3;
    this.equip = {
      weapon: 1,
      armor: 0,
    }

    //Attack Speed varaibles
    this.aSpeed = 3;
    this.cd = 0;

    this.textStart();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  textStart() {
    setTimeout(() => {
      this.score();
    }, 10);
    document.getElementById("objH").textContent = "Objectives";
    document.getElementById("boss1").textContent = "Find the key to the castle!";
  }
  gameOver() {
    document.getElementById("message2").textContent = "You lost all your lives! Game Over!";
    this.over= true;
    this.state = "Over";
  }
  gameWon() {
    document.getElementById("message2").textContent = "";
    this.over = true;
    this.state = "Won";
  }
  bossDefeat() {
    this.bossCount--;
    switch(this.bossCount) {
      case 2:
        this.tilemap.boss1();
        document.getElementById("boss1").textContent = "You've obtained a key to the castle!";
        document.getElementById("boss1").style.color = "gray";
        document.getElementById("boss2").textContent = "Find the key to the dungeon!";
        break;
      case 1:
      this.tilemap.boss2();
      document.getElementById("boss2").textContent = "You've obtained a key to the dungeon!";
      document.getElementById("boss2").style.color = "gray";
      document.getElementById("boss3").textContent = "Locate and defeat the final boss!";
        break;
      case 0:
        document.getElementById("boss3").style.color = "gray";
        document.getElementById("boss3").textContent = "You've defeated the final boss! Well Done!";
        this.gameWon();
        break;
    }
  }
  monsterC() {
    var x = this.roomN.roomX;
    var y = this.roomN.roomY;

    this.monsters = [];

    monster.monsters0[y][x].forEach((monN) => {
      var id = monN;
      monster.monsters.forEach((mon) => {
        if(id === mon.id) {
          this.monsters.push(new Monster(mon, this.roomN, this.tilemap, this.ctx));
        }
      });
    });
  }
  itemC(){
    var x = this.roomN.roomX;
    var y = this.roomN.roomY;
    var z;

    this.armor = undefined;
    this.weapons = undefined;
    this.potion = [];
    this.item = [];

    item.item0[y][x].forEach((id) => {
      var id = item.item0[y][x][0];

      item.weapons.forEach((weap) => {
            if(id === weap.id) {
              z = new Item(weap, this.tilemap, this.ctx, "weapon");
              this.weapons = z;
            }
          });

      item.armor.forEach((arm) => {
            if(id === arm.id) {
              z = new Item(arm, this.tilemap, this.ctx, "armor");
              this.armor = z;
            }
          });

      item.potion.forEach((pot) => {
        if(id === pot.id) {
          z = new Item(item.potion[1], this.tilemap, this.ctx, "potion");
          this.potion.push(z);
        }
      });

      this.item.push(z);
    });
  }
  respawn() {
    this.clearEdata();
    this.roomN = {
      roomX: 1,
      roomY: 4
    }
    this.monsters = [];
    this.weapons = undefined;
    this.armor = undefined;
    this.room.update(this.roomN);
    document.getElementById("message2").textContent = "You died!";
    if(this.player.getScore().life === 0) this.gameOver();
  }
  monsterD() {
    var ppos = this.player.getPosition();
    this.monsters.forEach((mon) => {
      var damage = mon.update(ppos, this.monsters);
      var respawn = this.player.dealDamage(damage);
      if(respawn) {
        this.respawn();
      }
    });
  }
  update() {
    if(this.attack) {
      this.attackEnemy();
    }
    if(this.state !== "Menu") {
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
  }
  render() {
    if(this.state !== "Menu") {
    this.ctx.save();
    if(this.armor) this.armor.render();
    if(this.weapons) this.weapons.render();
    this.potion.forEach((pot) => {
      pot.render();
    });
    this.monsters.forEach((mon) => {
      mon.render();
    });
    this.player.render();
    this.ctx.restore();
  }
  }
  loop() {
    if(!this.over) {
      this.update();
      this.render();
    }
    else if(this.state === "Over"){
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.font = "10px Arial";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Game Over!", 150, 200);
      this.ctx.restore();
    }
    else {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.font = "10px Arial";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Game Won!", 150, 200);
      this.ctx.restore();
    }
  }
}
