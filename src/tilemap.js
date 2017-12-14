import data from './gameMap.json';

export default class Tilemap {
  constructor() {
    this.images = [];
    this.tiles = [];

    // Load the map data
    this.mapWidth = data.width;
    this.mapHeight = data.height;
    this.tileWidth = data.tilewidth;
    this.tileHeight = data.tileheight;

    // Load our tiles from tilesets
    data.tilesets.forEach((tileset) => {
      // Create an image for the tileset's image
      var image = new Image();
      image.src = tileset.image;
      this.images.push(image);
      this.tiles[0] = undefined;

      // Create tiles for tileset
      for(let y = 0; y < tileset.imageheight; y += tileset.tileheight) {
        for(let x = 0; x < tileset.imagewidth; x += tileset.tilewidth) {
          this.tiles.push({
            image: image,
            sx: x,
            sy: y
          });
        }
      }
    });
    // Load the map layer data
    // CHEAT: Assume only one layer
    // NOTE: we can use a typed array for better efficiency
    this.data = new Uint16Array(data.layers[0].data);
    this.data2 = new Uint16Array(data.layers[1].data);
  }
  getData() {
    return this.data;
  }
  getData2() {
    return this.data2;
  }
  boss1() {
    //Removes blocking - Castle Gate
    this.data2[(0+(11*3)) * this.mapWidth + (4+(11*1))] = 0;
    this.data2[(0+(11*3)) * this.mapWidth + (5+(11*1))] = 0;
    this.data2[(0+(11*3)) * this.mapWidth + (6+(11*1))] = 0;
  }
  boss2() {
    //Removes blocking - Dungeon blocking
    this.data2[(4+(11*0)) * this.mapWidth + (10+(11*5))] = 0;
    this.data2[(5+(11*0)) * this.mapWidth + (10+(11*5))] = 0;
    this.data2[(6+(11*0)) * this.mapWidth + (10+(11*5))] = 0;
  }

  renderFloor(ctx, roomX, roomY) {
    var rX = roomX;
    var rY = roomY;

    //Draws the room.
    for(let y = 0; y < 11; y++) {
      for(let x = 0; x < 11; x++) {

        //(11*0) - 0 = Room Number to be generated (Different for x/y)
        var tileIndex = this.data[(y+(11*rY)) * this.mapWidth + (x+(11*rX))];

        if(tileIndex === 0) continue; // Skip non-existant tiles

        var tile = this.tiles[tileIndex];

        if(!tile.image) continue; // Don't draw a non-existant image
        ctx.drawImage(tile.image, tile.sx, tile.sy, this.tileWidth, this.tileHeight,
                      x * this.tileWidth, y * this.tileHeight,
                      this.tileWidth, this.tileHeight);
      }
    }
  }
  renderWall(ctx, roomX, roomY) {
    var rX = roomX;
    var rY = roomY;
    for(let y = 0; y < 11; y++) {
      for(let x = 0; x < 11; x++) {
        //(11*0) - 0 = Room Number to be generated (Different for x/y)
        var tileIndex2 = this.data2[(y+(11*rY)) * this.mapWidth + (x+(11*rX))];
        if(tileIndex2 === 0) continue; // Skip non-existant tiles
        var tile2 = this.tiles[tileIndex2];
        if(!tile2.image) continue; // Don't draw a non-existant image
        ctx.drawImage(tile2.image, tile2.sx, tile2.sy, this.tileWidth, this.tileHeight,
                      x * this.tileWidth, y * this.tileHeight,
                      this.tileWidth, this.tileHeight);
      }
    }
  }
  renderTile(ctx, x, y, tileN) {
    //this.tiles[#] where # = player on tilemap.
    var tile = this.tiles[tileN];
    ctx.drawImage(tile.image, tile.sx, tile.sy, this.tileWidth, this.tileHeight,
                  x * this.tileWidth, y * this.tileHeight,
                  this.tileWidth, this.tileHeight);
  }
}
