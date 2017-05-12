
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
// To isolate jQuery and execute function
(function ($){
   var wellslide = {};


   wellslide = (function() {


      wellslide.prototype.autoPlay = function(){
         var _ = this;
         _.autoPlayClear();
         // var autoPlay =
      }

      wellslide.prototype.slideToLeft = function(){
         this.animate({
          right: "-="+width,
         }, options['speed'], function() {
             $('#rail').prepend($('#rail img:last'));
             $(this).css('right',parseFloat($('#rail').css('right'))+width);
         });
      }

      wellslide.prototype.slideToRight = function(){
         this.animate({
           right: "+="+width,
         }, options['speed'], function() {
             $('#rail').append($('#rail img:first'));
             $(this).css('right',parseFloat($('#rail').css('right'))-width);
         });
      }

   });

   $.fn.wellslide = function() {
      new wellslide();
      return this;
   };

})(jQuery);


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
//TODO change moveRight or Left with MoveToSlide ?

var width = parseFloat($('#slideshow').css('width'));

//For debug
// $('#rail').append('<#rail img src="#rail img/1.jpg" data-index="0" class="slideToSlide">')
//           .append('<#rail img src="#rail img/2.jpg" data-index="1">')
//           .append('<#rail img src="#rail img/3.jpg" data-index="2">')
//           .append('<#rail img src="#rail img/1.jpg" data-index="3">')
//           .append('<#rail img src="#rail img/2.jpg" data-index="4">')
//           .append('<#rail img src="#rail img/3.jpg" data-index="5">')

// // Call des fichiers json (trop lourd)
// var json = $.getJSON('https://www.skrzypczyk.fr/slideshow.php',function(data){
//     console.log(data);
//     data.forEach(function(el){
//         $('#rail').append('<#rail img src="'+el.url+'" data-desc="'+el.desc+'" data-title="'+el.title+'">');
//     })
// });



//For animation purpose
$first = $('#rail img:first');
$last = $('#rail img:last');
$last.clone().addClass('ghost').prependTo('#rail');
$first.clone().addClass('ghost').appendTo('#rail');

$('#rail').css('width', $('#rail img').length * width+'px');
$('#rail').css('right',width);
$('#rail img').css('width',width);

$('#rail img:not(.ghost)').each(function(index){
    $(this).attr('data-index',index);
})

//Responsive
$('#rail img:not(.ghost)').first().addClass('actualSlide');


function wellslide(el,params){

    'use strict';
    var _, play = false, moving = false;

    var options = {
        autoPlay: true,
        speed: 3000,
        hidePlay: false,
        width: 'test',
        bullets: false,
        arrow: true,
    }

    Object.keys(options).forEach(function(key){
        if(params[key] != undefined){
            options[key] = params[key];
        }
    });

    //ARROW PART
    function moveRight(){
        if(moving ==false){
            moving = true;
            el.animate({
                right:parseFloat(el.css('right'))+width+'px',
            }, options['speed'],function(){
                if(parseFloat(el.css('right')) >= ($('#rail img').length-1)*width){
                    el.css('right',width+'px');
                }
                moveBullet();
                //Move actual Slide (for responsive)
                var next = $('#rail img.actualSlide').removeClass('actualSlide').next('#rail img:not(.ghost)');
                if( next.length != 0){
                    next.addClass('actualSlide');
                } else {
                    $('#rail img:not(.ghost):first').addClass('actualSlide')
                }
                moving = false;
            });
        }
    }
    function moveLeft(){
        if(moving == false){
            moving = true;
            el.animate({
              right:parseFloat(el.css('right'))-width+'px',
          }, options['speed'],function(){
                if(parseFloat(el.css('right')) <= 0){
                    el.css('right',($('#rail img').length-2)*width+'px');
                }
                moveBullet();
                var prev = $('#rail img.actualSlide').removeClass('actualSlide').prev('#rail img:not(.ghost)');
                if( prev.length != 0){
                    prev.addClass('actualSlide');
                } else {
                    $('#rail img:not(.ghost):last').addClass('actualSlide')
                }
                moving = false;
            });
        }
    }
    $('#previous').click(function(e){
        moveLeft();
    });
    $('#next').click(function(){
        moveRight();
    });

    /* Partie Dots */
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

    if(options['bullets']){
        el.after('<ul class="dots"></ul>');
        for(var i = 0; i < $('#rail img:not(".ghost")').length; i++){
            $('.dots').append('<li><button type="button" data-role="none" role="button" data-index="'+i+'"></button>');
        }
        $('.dots button:first').addClass('actualDots');

        $('.dots button').click(function(){
            if(moving == false){
                moving = true;
                _ = $(this);

                $('.actualSlide').removeClass('actualSlide');
                $('#rail img:not(.ghost)[data-index="'+_.data('index')+'"]').addClass('actualSlide');

                $('.actualDots').removeClass('actualDots');
                _.addClass('actualDots');
                el.animate({
                    right: _.data('index')*width+width+'px',
                }, options['speed'], function(){
                    moving = false;
                });
                if(play != false){
                    clearInterval(play);
                    play = window.setInterval(moveRight,options['speed']);
                }
            }
        })
    }

    //RESPONSIVE
    $(window).resize(function(){
        width = parseFloat($('#slideshow').css('width'));
        $('#rail img').css('width',width);
        $('#rail').css('width', ($('#rail img').length * width)+'px');
        $('#rail').css('right', ($('.actualSlide').data('index')+1) * width); //1 for ghost
    });


    //PLAY AND HOVER PAUSE GOOD + Fix
    function playSlide(){
        $('#play').find('.fa').toggleClass('fa-pause-circle-o fa-play-circle-o');
        if(play == false){
            moveRight();
            play = window.setInterval(moveRight,options['speed']);
        } else {
            clearInterval(play);
            play = false;
        }
    }
    $('#play').click(function(){
        playSlide();
    });
    $('#container').hover(function(){
        if(play != false){
            clearInterval(play);
            play = 'pause';
        }
    }, function(){
        if(play == 'pause'){
            moveRight();
            play = window.setInterval(moveRight,options['speed']);
        }
    });

    if(options['autoPlay']){
        playSlide();
    }
    if(options['hidePlay']){
        $('#play').toggle();
    }

}
