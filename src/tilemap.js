export default class Tilemap {
  constructor(tilemapData) {
    this.images = [];
    this.tiles = [];

    // Load the map data
    this.mapWidth = tilemapData.width;
    this.mapHeight = tilemapData.height;
    this.tileWidth = tilemapData.tilewidth;
    this.tileHeight = tilemapData.tileheight;
    // Load our tiles from tilesets
    tilemapData.tilesets.forEach((tileset) => {
      // Create an image for the tileset's image
      var image = new Image();
      image.src = tileset.image;
      this.images.push(image);

      // Create tiles for tileset
      var id = tileset.firstgid;
      for(let y = 0; y < tileset.imageheight; y += tileset.tileheight) {
        for(let x = 0; x < tileset.imagewidth; x += tileset.tilewidth) {
          this.tiles[id] = {
            image: image,
            sx: x,
            sy: y
          };
          id++;
        }
      }
    });

    // Load the map layer data
    // CHEAT: Assume only one layer
    // NOTE: we can use a typed array for better efficiency
    this.data = new Uint16Array(tilemapData.layers[0].data);
    this.data2 = new Uint16Array(tilemapData.layers[1].data);
  }
  getData() {
    return this.data;
  }
  getData2() {
    return this.data2;
  }
  boss1() {
    this.data2[(0+(11*3)) * this.mapWidth + (4+(11*1))] = 0;
    this.data2[(0+(11*3)) * this.mapWidth + (5+(11*1))] = 0;
    this.data2[(0+(11*3)) * this.mapWidth + (6+(11*1))] = 0;
  }
  boss2() {
    this.data2[(4+(11*0)) * this.mapWidth + (10+(11*5))] = 0;
    this.data2[(5+(11*0)) * this.mapWidth + (10+(11*5))] = 0;
    this.data2[(6+(11*0)) * this.mapWidth + (10+(11*5))] = 0;
  }

  renderFloor(ctx, roomX, roomY) {
    var rX = roomX;
    var rY = roomY;
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
