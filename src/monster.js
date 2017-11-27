import Tilemap from './tilemap';

export default class Monster {
  constructor(mon, tilemap, ctx) {
    this.x = mon.x;
    this.y = mon.y;
    this.rX;
    this.rY;
    this.alive = mon.alive;
    this.health = mon.health;
    this.damage = mon.damage;
    this.type = mon.type;

    this.tilemap = tilemap;
    this.ctx = ctx;
    this.data = this.tilemap.getData();
    this.data2 = this.tilemap.getData2();
    this.tileN = mon.id;


    this.cd = 10;
  }
  getType() {
    return this.type;
  }
  dealDamage(damage) {
    this.health -= damage;
    if(this.health <= 0) {
      this.alive = 0;
      this.ctx.save();
      this.tilemap.renderTile(this.ctx, this.x, this.y, this.data[((this.y)+(11*this.rY)) * 100 + ((this.x)+(11*this.rX))]);
      this.ctx.restore();
      return true;
    }
    return false;
  }
  update(player, roomN) {
    this.rX = roomN.roomX;
    this.rY = roomN.roomY;

    if(this.cd !== 0) this.cd--;
    else {
      this.ctx.save();
      this.tilemap.renderTile(this.ctx, this.x, this.y, this.data[((this.y)+(11*this.rY)) * 100 + ((this.x)+(11*this.rX))]);
      this.ctx.restore();

      if(player.y < this.y && player.x !== this.x && this.data2[((this.y-1)+(11*this.rY)) * 100 + ((this.x)+(11*this.rX))] === 0) {
        this.y--;
      }
      else if (player.y > this.y && player.x !== this.x && this.data2[((this.y+1)+(11*this.rY)) * 100 + ((this.x)+(11*this.rX))] === 0) {
        this.y++;
      }
      else if (player.x < this.x-1 && this.data2[((this.y)+(11*this.rY)) * 100 + ((this.x-1)+(11*this.rX))] === 0) {
        this.x--;
      }
      else if (player.x > this.x+1 && this.data2[((this.y)+(11*this.rY)) * 100 + ((this.x+1)+(11*this.rX))] === 0) {
        this.x++;
      }
      else if((player.y === this.y && player.x === this.x-1) ||
              (player.y === this.y && player.x === this.x+1) ||
              (player.y === this.y-1 && player.x === this.x) ||
              (player.y === this.y+1 && player.x === this.x)
      ) {
        this.cd = 10;
        return this.damage;
      }
      this.cd = 10;

    }
    return 0;
  }
  render() {
    this.ctx.save();
    this.tilemap.renderTile(this.ctx, this.x, this.y, this.tileN);
    this.ctx.restore();
  }
}
