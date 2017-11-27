import Tilemap from './tilemap';
import item from './item.json';

export default class Item {
  constructor(item, tilemap, ctx, type) {
    this.x = item.x;
    this.y = item.y;
    this.rX;
    this.rY;
    this.value = item.value;
    this.type = type;

    this.tilemap = tilemap;
    this.ctx = ctx;
    this.data = this.tilemap.getData();
    this.data2 = this.tilemap.getData2();
    this.tileN = item.id;
  }
  getData() {
    return {x: this.x, y: this.y, type: this.type, value: this.value};
  }
  update() {

  }
  delete(roomN) {
    var x = roomN.roomX;
    var y = roomN.roomY;

    item.item0[y][x] = [];
  }
  render() {
    this.ctx.save();
    this.tilemap.renderTile(this.ctx, this.x, this.y, this.tileN);
    this.ctx.restore();
  }
}
