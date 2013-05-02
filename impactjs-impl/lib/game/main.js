ig.module( 
  'game.main' 
)
.requires(
  'impact.game',
  'impact.entity',
  'impact.collision-map',
  'impact.background-map',
  'impact.font'
)
.defines(function(){
  MatchGame = ig.Game.extend({
    clearColor: '#fff',
    tiles: new ig.Image( 'media/tiles.png' ),
    instructText: new ig.Font('media/04b03.font.png'),
    map: [],
    score: 0,
    speed: 95,
    init: function() {
      this.generateMap();
      var bgmap = new ig.BackgroundMap( 30, this.map, this.tiles );
      this.backgroundMaps.push( bgmap );
    },
    update: function() {
      this.speed += ig.system.tick * (10/this.speed);
      this.screen.x += ig.system.tick * this.speed;
      document.getElementById("screenX").innerHTML = "ScreenX: " + this.screen.x;
      document.getElementById("speed").innerHTML = "Speed: " + this.speed;
      if(this.screen.x > 30){
        this.screen.x -= 30;
        this.maintainColumns();
      }
      this.parent();
    },
    draw: function() {
      for( var i = 0; i < this.backgroundMaps.length; i++ ) {
        this.backgroundMaps[i].draw();
      }
      this.parent();
    },
    generateMap: function() {
      for( var y = 0; y < 8; y++ ) {
        this.map[y] = this.generateColumn();
      }
    },
    generateColumn: function() {
      var col = [];
      for( var x = 0; x < 15; x++ ) {
        col[x] = this.randomTile();
      }
      return col;
    },
    randomTile: function() {
      return Math.floor(Math.random()*5) + 1;
    },
    maintainColumns: function() {
      // actually more effecient than a for loop
      this.map[0].shift();
      this.map[0].push(this.randomTile());
      this.map[1].shift();
      this.map[1].push(this.randomTile());
      this.map[2].shift();
      this.map[2].push(this.randomTile());
      this.map[3].shift();
      this.map[3].push(this.randomTile());
      this.map[4].shift();
      this.map[4].push(this.randomTile());
      this.map[5].shift();
      this.map[5].push(this.randomTile());
      this.map[6].shift();
      this.map[6].push(this.randomTile());
      this.map[7].shift();
      this.map[7].push(this.randomTile());
    }
  });
  ig.main( '#canvas', MatchGame, 60, 320, 240, 2 );
});
