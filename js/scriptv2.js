/*
    Fonctionnalités :
    - Animation de l'afficage des titres et descriptions (alt) diff de l'animation des images
    - Rognage des images ou autre solution
    - Suivant, précédent, play, pause
    - Hover Play pause
    - Responsive et BEAU
    - Administrable via une lsite de variable en haut de script
    - Module de controle
*/

//Code propre :
// To isolate jQuery and execute function
// (function ($){
//    var wellslide = {};
//
//    wellslide = (function() {
//
//
//       wellslide.prototype.autoPlay = function(){
//          var _ = this;
//          _.autoPlayClear();
//          // var autoPlay =
//       }
//
//       wellslide.prototype.slideToLeft = function(){
//          this.animate({
//           right: "-="+width,
//          }, options['speed'], function() {
//              $('#rail').prepend($('#rail img:last'));
//              $(this).css('right',parseFloat($('#rail').css('right'))+width);
//          });
//       }
//
//       wellslide.prototype.slideToRight = function(){
//          this.animate({
//            right: "+="+width,
//          }, options['speed'], function() {
//              $('#rail').append($('#rail img:first'));
//              $(this).css('right',parseFloat($('#rail').css('right'))-width);
//          });
//       }
//
//    });
//
//    $.fn.wellslide = function() {
//       new wellslide();
//       return this;
//    };
//
//    // Object.prototype.toLocaleString();
//
// })(jQuery);
