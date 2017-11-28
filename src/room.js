import Tilemap from './tilemap';

export default class Room {
  constructor(x, y, tilemap, context) {
    this.tilemap = tilemap;
    this.roomX = x;
    this.roomY = y;
    this.ctx = context;
    this.render();
  }
  getRoom() {
    var roomN = {
      roomX: this.roomX,
      roomY: this.roomY,
    };
    return roomN;
  }
  update(roomN) {
    if(roomN.roomX !== this.roomX || roomN.roomY !== this.roomY) {
      this.roomX = roomN.roomX;
      this.roomY = roomN.roomY;
      this.render();
    }
  }
  render() {
    setTimeout(() => {
      this.tilemap.renderFloor(this.ctx, this.roomX, this.roomY);
      this.tilemap.renderWall(this.ctx, this.roomX, this.roomY);
    }, 1)
  }
}
