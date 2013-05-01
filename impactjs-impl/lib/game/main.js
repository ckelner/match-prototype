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
    speed: 1,
    init: function() {
      this.generateMap();
      var bgmap = new ig.BackgroundMap( 30, this.map, this.tiles );
      this.backgroundMaps.push( bgmap );
    },
    update: function() {
      this.speed += ig.system.tick * (10/this.speed);
      this.screen.x += ig.system.tick * this.speed;
      if( Math.round( this.screen.x % 11 ) == 0 ) {
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
      // rows
      for( var y = 0; y < 8; y++ ) {
        // cols
        this.map[y] = this.generateColumn();
      }
    },
    generateColumn: function() {
      var col = [];
      for( var x = 0; x < 11; x++ ) {
        col[x] = this.randomTile();
      }
      return col;
    },
    randomTile: function() {
      return Math.floor(Math.random()*5) + 1;
    },
    maintainColumns: function() {
      for( var y = 0; y < 8; y++ ) {
          for( var x = 0; x <= 11; x++ ) {
            if( x != 11) {
              this.map[y][x] = this.map[y][x + 1];
            } else {
              this.map[y][x] = this.randomTile();
            }
          }
      }
    }
  });
  ig.main( '#canvas', MatchGame, 60, 320, 240, 2 );
});
