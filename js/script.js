
// précedent : on tire l'image vers le debut puis on déplace le cadre
//Rajouter nb slide voulu
//Ajouter attribut :

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
//To isolate jQuery and execute function
(function ($){

})(jQuery);


var width = parseFloat($('#slideshow').css('width'));
$('#rail').css('right', width+'px');
//https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions?redirectlocale=en-US&redirectslug=CSS%2FTutorials%2FUsing_CSS_transitions#Detecting_the_completion_of_a_transition
// var fire = true;
// el = document.getElementById('rail');
// el.addEventListener("transitionend", function(){
//     fire = true;
// }, true);

//Call des fichiers json (trop lourd)
// var json = $.getJSON('https://www.skrzypczyk.fr/slideshow.php',function(data){
//     data.forEach(function(el){
//         $('#rail').append('<img src="'+el.url+'" alt="'+el.desc+'">');
//     })
// });

//For debug
$('#rail').append('<img src="img/1.jpg" data-index="0">')
$('#rail').append('<img src="img/2.jpg" data-index="1">')
$('#rail').append('<img src="img/3.jpg" data-index="2">')
$('#rail').append('<img src="img/1.jpg" data-index="3">')
$('#rail').append('<img src="img/2.jpg" data-index="4">')
$('#rail').append('<img src="img/3.jpg" data-index="5">')

$('#rail').css('width', $('#rail img').length * width+'px');

var play; //Global scope
function maelSlider() {
   'use strict';


   var el = arguments[0].el; // Correspond à #rail //Necessaire pour introduire dans une fonction ? Pk ?
   //Autoplay
   if(arguments[0].autoPlay){
      autoPlay(arguments[0].el);
      $('button:nth-of-type(2)').text('Pause');
   }
   if(arguments[0].bullets){
      $(el).parent().append('<ul class="dots"></ul>');
      for(var i = 0; i < $('img').length; i++){
         $('.dots').append('<li><button type="button" data-role="none" role="button" data-index="'+i+'"></button>');
      }
   }

   function moveToSlide(index){ //Prepare it (because actually it is launching it self) est-ce que c'est pcq .dots est crée ?
      console.log(index);
      //Move to Index * width (transition do the style)
      //possibility for last and first : check if width = 0 or width = max and if so do the same as in the actual version
   }
   $('.dots button').click( moveToSlide('a') );


   //Slide Right
   $('#previous').click(function(){
       $(el).slideRight();
   })
   //Slide Left
   $('#next').click(function(){
       $(el).slideLeft();
   })

   //Pause, play
   $('#action').click(function(){
      if(play){
         $('button:nth-of-type(2)').text('Play');
         clearInterval(play);
         play = null;
      } else {
         $('button:nth-of-type(2)').text('Pause');
         play = window.setInterval(autoPlay(el), 2000);
      }
   })
   return this;
};

// function play(slide, direction = 'left', time){
//    play = window.setInterval(function(){
//       $(slide).slideLeft();
//    }, time)
// }

function autoPlay(slide){
   play = window.setInterval(function(){
      $(slide).slideLeft();
   }, 2000);
}

$.fn.extend({
    slideLeft: function(){
        this.animate({
          right: "+="+width,
        }, 1000, function() {
            $('#rail').append($('img:first'));
            $(this).css('right',parseFloat($('#rail').css('right'))-width);
        });
    },
    slideRight: function(){
        this.animate({
          right: "-="+width,
        }, 1000, function() {
            $('#rail').prepend($('img:last'));
            $(this).css('right',parseFloat($('#rail').css('right'))+width);
        });
    }
});
