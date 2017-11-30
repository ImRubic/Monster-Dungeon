import Tilemap from './tilemap';

export default class Player {
  constructor(x, y, tilemap, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.tilemap = tilemap;
    this.health = 1000;
    this.life = 3;
    this.weaponPower = 1;
    this.armor = 0;
    this.data = this.tilemap.getData();
    this.data2 = this.tilemap.getData2();
    this.tileN = 133;
  }
  getPosition() {
    return {x: this.x, y: this.y};
  }
  getScore() {
    return {life: this.life, health: this.health};
  }
  getDamage() {
    return this.weaponPower;
  }
  setWeapon(value) {
    this.weaponPower = value;
  }
  setArmor(value) {
    this.armor = value;
  }
  dealDamage(damage) {
    if(this.armor < damage) this.health -= (damage-this.armor);
    if(this.health <= 0) {
      this.life--;
      this.health = 10;
      this.x = 1;
      this.y = 1;
      if(this.life <= 0) {
        //end game
      }
      return true;
    }
    return false;
  }
  update(input, roomN, monsters) {
    var dX = input.dX;
    var dY = input.dY;
    var rX = roomN.roomX;
    var rY = roomN.roomY;
    var mtile = false;

    //checks if a monster is in a given direction
    monsters.forEach((mon) => {
      if(mon.x === this.x+dX && mon.y === this.y+dY) {
        mtile = true;
      }
    });

    //Check if the tile in the direction of movement is a wall
    if(this.data2[((this.y+dY)+(11*rY)) * 100 + ((this.x+dX)+(11*rX))] === 0 && !mtile) {

      //render's floor tile over previous player tile.
      this.ctx.save();
      this.tilemap.renderTile(this.ctx, this.x, this.y, this.data[((this.y)+(11*rY)) * 100 + ((this.x)+(11*rX))]);
      this.ctx.restore();

      //update's position
      this.x = this.x+dX;
      this.y = this.y+dY;

      //Moves player to the enterance of the next room.
      if(this.x === -1) {
        this.x = 10;
        return {roomX: rX-1, roomY: rY};
      }
      else if(this.x === 11) {
        this.x = 0;
        return {roomX: rX+1, roomY: rY};
      }
      else if(this.y === -1) {
        this.y = 10;
        return {roomX: rX, roomY: rY-1};
      }
      else if(this.y === 11) {
        this.y = 0;
        return {roomX: rX, roomY: rY+1};
      }
    }

    return {roomX: rX, roomY: rY};

  }
  render() {
    this.ctx.save();
    this.tilemap.renderTile(this.ctx, this.x, this.y, this.tileN);
    this.ctx.restore();
  }
}
