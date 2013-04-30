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
      ig.system.smoothPositioning = false;
      for( var y = 0; y < 30; y++ ) {    
        this.map[y] = this.getRow();
      }
      var data = [ [1,2,3,4,5] ];
      var bgmap = new ig.BackgroundMap( 30, this.map, this.tiles );
      this.backgroundMaps.push( bgmap );
    },
    getRow: function() {
      var row = [];
      for( var x = 0; x < 40; x++ ) {
        row[x] = Math.floor(Math.random()*5) + 1;
      }
      return row;
    },
    update: function() {
      // Do we need a new row?
      /*if( this.screen.y > 40 ) {  
        // Move screen and entities one tile up
        this.screen.y -= 8;
        for( var i =0; i < this.entities.length; i++ ) {
          this.entities[i].pos.y -= 8;
        }
        // Delete first row, insert new
        this.map.shift();
        this.map.push(this.getRow());
        // Place coin?
        if( Math.random() > 0.5 ) {
          this.placeCoin();
        }
      }*/
      // Update all entities and backgroundMaps
      this.parent();
    },
    draw: function() {
      for( var i = 0; i < this.backgroundMaps.length; i++ ) {
        this.backgroundMaps[i].draw();
      }
      this.parent();
    }
  });
  // Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
  ig.main( '#canvas', MatchGame, 60, 320, 240, 2 );
});
