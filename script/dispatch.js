define(['lib/underscore', 'lib/mousetrap', 'tiles',
   'tilesets/oryx', 'world', 'ui', 'lib/domReady'
],
   function(_, Mousetrap, Tiles, Tileset, World, Ui)
{
   var map = new World.RandomMap({
      width: 35,
      height: 50
   });

   var hunter = new World.Entity({
      x: 6,
      y: 6,
      shape: Tiles['hunter'],
      map: map
   });

   var mapview = new Ui.MapView({
      map: map,
      tiles: Tileset,
      extend: {width: 20, height: 15},
      actors: [hunter],
      player: hunter
   });

   var canvas = document.getElementById('stage');
   var context = canvas.getContext('2d');

   canvas.width = Tileset.width * mapview.getExtend().width;
   canvas.height = Tileset.height * mapview.getExtend().height;

   function redraw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      mapview.drawTo(context);
   }

   Tileset.ready.then(function() {
      mapview.drawTo(context);

      _.each({
         left: function() {
            hunter.setX(hunter.getX() - 1);
            redraw();
         },
         right: function() {
            hunter.setX(hunter.getX() + 1);
            redraw();
         },
         up: function() {
            hunter.setY(hunter.getY() - 1);
            redraw();
         },
         down: function() {
            hunter.setY(hunter.getY() + 1);
            redraw();
         }
      }, function(handler, key) {
         Mousetrap.bind(key, handler);
      });
   });
});
