
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
// (function ($){
//    var WellSlide = {};
//
//
//    WellSlide = (function() {
//       var width = parseFloat($('#slideshow').css('width'));
//       //For debug
//       $('#rail').append('<img src="img/1.jpg" data-index="0">')
//                 .append('<img src="img/2.jpg" data-index="1">')
//                 .append('<img src="img/3.jpg" data-index="2">')
//                 .append('<img src="img/1.jpg" data-index="3">')
//                 .append('<img src="img/2.jpg" data-index="4">')
//                 .append('<img src="img/3.jpg" data-index="5">')
//                 .css('right', width+'px')
//                 .css('width', $('#rail img').length * width+'px');
//
//
//       WellSlide.prototype.autoPlay = function(){
//          var _ = this;
//          _.autoPlayClear();
//          // var autoPlay =
//       }
//
//       WellSlide.prototype.slideToLeft = function(){
//          this.animate({
//           right: "-="+width,
//          }, 1000, function() {
//              $('#rail').prepend($('img:last'));
//              $(this).css('right',parseFloat($('#rail').css('right'))+width);
//          });
//       }
//
//       WellSlide.prototype.slideToRight = function(){
//          this.animate({
//            right: "+="+width,
//          }, 1000, function() {
//              $('#rail').append($('img:first'));
//              $(this).css('right',parseFloat($('#rail').css('right'))-width);
//          });
//       }
//
//    });
//
//    $.fn.wellslide = function() {
//       new WellSlide();
//       return this;
//    };
//
// })(jQuery);


//Lets see magic

// var width = parseFloat($('#slideshow').css('width'));
// $('#rail').css('right', width+'px');
// //https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions?redirectlocale=en-US&redirectslug=CSS%2FTutorials%2FUsing_CSS_transitions#Detecting_the_completion_of_a_transition
// var fire = true;
// el = document.getElementById('rail');
// el.addEventListener("transitionend", function(){
//     fire = true;
// }, true);

//TODO Default value for speed etc + let possibility to edit
//TODO Utiliser promise() ?
//TODO SlideToSlide (On click on left or right, put slideToSlide to the prev or next and launch slideToSlide function())
//TODO rajouter possibilité de cacher le play pause button
//TODO height: se caler sur la première image ?
//TODO responsive attribute data-index

var width = parseFloat($('#slideshow').css('width'));

//For debug
// $('#rail').append('<img src="img/1.jpg" data-index="0" class="slideToSlide">')
//           .append('<img src="img/2.jpg" data-index="1">')
//           .append('<img src="img/3.jpg" data-index="2">')
//           .append('<img src="img/1.jpg" data-index="3">')
//           .append('<img src="img/2.jpg" data-index="4">')
//           .append('<img src="img/3.jpg" data-index="5">')

// // Call des fichiers json (trop lourd)
// var json = $.getJSON('https://www.skrzypczyk.fr/slideshow.php',function(data){
//     console.log(data);
//     data.forEach(function(el){
//         $('#rail').append('<img src="'+el.url+'" data-desc="'+el.desc+'" data-title="'+el.title+'">');
//     })
// });

//For animation purpose
$first = $('#rail img:first');
$last = $('#rail img:last');
$last.clone().addClass('ghost').prependTo('#rail');
$first.clone().addClass('ghost').appendTo('#rail');

$('#rail').css('width', $('#rail img').length * width+'px');
$('#rail').css('right',width);

$(document).ready(function() {
    //Se passer de document.ready + breakpoint + on resize under breakpoint
    $('img').css('width',width);
});

//Responsive
$('img:not(.ghost)').first().addClass('actualSlide');
$(window).resize(function(){
    $('img').css('width',parseFloat($('#slideshow').css('width')));
    $('#rail').css('width', ($('#rail img').length * parseFloat($('#slideshow').css('width')))+'px');
});


function wellslide(el){
    'use strict';
    var _, play = false, moving = false;
    var slideToSlide;

    //TODO Try to make the thing identic as
    function moveBullet(){
        $('.actualDots').removeClass('actualDots');
        $('.dots button').each(function(){
            _ = $(this);
            if(parseFloat($('#rail').css('right')) == (_.data('index')+1)*width){
                _.addClass('actualDots');
            }
        });
    }

    function moveRight(){
        if(moving ==false){
            moving = true;
            el.animate({
                right:parseFloat(el.css('right'))+width+'px',
            }, 1000,function(){
                if(parseFloat(el.css('right')) >= ($('#rail img').length-1)*width){
                    el.css('right',width+'px');
                }
                moveBullet();
                //Move actual Slide (for responsive)
                $('img.actualSlide').next('img:not(.ghost)').addClass('actualSlide')
                $('img.actualSlide:first').removeClass('actualSlide')
                
                moving = false;
            });
        }
    }

    function moveLeft(){
        if(moving == false){
            moving = true;
            el.animate({
              right:parseFloat(el.css('right'))-width+'px',
            }, 1000,function(){
                if(parseFloat(el.css('right')) <= 0){
                    el.css('right',($('#rail img').length-2)*width+'px');
                }
                moveBullet();
                moving = false;
            });
        }
    }

    // function moveToSlide(index){
    //     $('.actualSlide').data('index') > index ? '-' : '';
    //     el.animate({
    //         right: width * index +'px';
    //     }, 1000, function(){
    //         moveBullet();
    //     });
    // }

    /* Partie Dots */
    el.after('<ul class="dots"></ul>');
    for(var i = 0; i < $('img:not(".ghost")').length; i++){
        $('.dots').append('<li><button type="button" data-role="none" role="button" data-index="'+i+'"></button>');
    }

    $('.dots button:first').addClass('actualDots');

    $('.dots button').click(function(){
        _ = $(this);
        $('.actualDots').removeClass('actualDots');
        _.addClass('actualDots');
        el.animate({
          right: _.data('index')*width+width+'px',
      }, 1000);
      if(play != false){
          clearInterval(play);
          play = window.setInterval(moveRight,2000);
      }
    })

    $('#previous').click(function(e){
        moveLeft();
        // slideToSlide = $('.slideToSlide').data('id') + 1;
        // moveToSlide(slideToSlide);
    });

    $('#next').click(function(){
        moveRight();
    });


    //PLAY AND HOVER PAUSE GOOD + Fix
    $('#play').click(function(){
        $(this).find('.fa').toggleClass('fa-pause-circle-o fa-play-circle-o');
        if(play == false){
            moveRight();
            play = window.setInterval(moveRight,2000);
        } else {
            clearInterval(play);
            play = false;
        }
    });

    $('#container').hover(function(){
        if(play != false){
            clearInterval(play);
            play = 'pause';
        }
    }, function(){
        if(play == 'pause'){
            moveRight();
            play = window.setInterval(moveRight,2000);
        }
    });

}
