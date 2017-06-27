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






function wellslide(obj){
    'use strict';

    var el = obj.el;
    var $el = $(obj.el);
    var params = obj.params;
    //Définie width pour le responsive
    var width = parseFloat($('#slideshow').css('width'));

    //Initialise les élements TODO Add or not in function of option
    $el.append('<div id="rail"></div>')
       .append('<button id="previous" style="z-index: 2"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>')
       .append('<button id="play" style="z-index: 2"><i class="fa fa-play-circle-o" aria-hidden="true"></i></button>')
       .append('<button id="next" style="z-index: 2"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>')
       .append('<div id="title">Ce titre est court</div>')
       .append('<div id="description">Description</div>');

    var rail = $el.find('#rail');

    // Call des fichiers json
    $.ajax({
        type: "GET",
        url: "https://www.skrzypczyk.fr/slideshow.php",
        dataType: "json",
        success: function(datas){
            datas.forEach(function(data,index){
                $('#rail').append('<img src="'+data.url+'" data-desc="'+data.desc+'" data-title="'+data.title+'">');
            });
        }
    }).done(function(){
        //For animation purpose
        var last = rail.find('img:last');
        var first = rail.find('img:first');
        last.clone().addClass('ghost').prependTo(rail);
        first.clone().addClass('ghost').appendTo(rail);
        //Attribu au rail la taille totale des images bord à bord.
        rail.css('width', rail.find('img').length * width+'px');
        //Décale d'un cran
        rail.css('right',width);
        rail.find('img').css('width',width);
        //Responsive
        rail.find('img:not(.ghost):first').addClass('actualSlide');
        //Add index without adding to ghost
        rail.find('img:not(.ghost)').each(function(index){
            $(this).attr('data-index',index);
        });
        //Bullets part ~~~TODO WTFFFF ??
        $el.append('<ul class="dots"></ul>');
        $('#rail img:not(.ghost)').each(function(index, el){
            $('.dots').append('<li><button type="button" data-role="none" role="button" data-index="'+index+'"></button>');
        });
        $('.dots button:first').addClass('actualDots');
        $('.dots button').click(function(){
            if(moving == false){
                moving = true;
                _ = $(this);

                $('.actualSlide').removeClass('actualSlide');
                $('#rail img:not(.ghost)[data-index="'+_.data('index')+'"]').addClass('actualSlide');

                $('.actualDots').removeClass('actualDots');
                _.addClass('actualDots');
                rail.animate({
                    right: _.data('index')*width+width+'px',
                }, options['speed'], function(){
                    moving = false;
                });
                if(play != false){
                    clearInterval(play);
                    play = window.setInterval(moveRight,options['speed']);
                }
            }
        });
    });

    var _, play = false, moving = false;

    var options = {
        autoPlay: true,
        speed: 3000,
        hidePlay: false,
        bullets: true,
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
            //Part title and desc
            $('#title').animate({
                left: -$('#title').width() * 2
            }, options['speed']/2, function(){
                //TODO FIND A BETTER SOLUTION THERE
                $('#title').text($('.actualSlide').next('#rail img:not(.ghost)').data('title'));
                $('#title').animate({
                    left: 0
                }, options['speed']/2)
            });
            $('#description').fadeOut(options['speed']/2, function() {
                $('#description').text($('.actualSlide').next('#rail img:not(.ghost)').data('desc'));
                $('#description').fadeIn(options['speed']/2)
            })

            rail.animate({
                right: parseFloat(rail.css('right'))+width+'px',
            }, options['speed'],function(){
                if(parseFloat(rail.css('right')) >= ($('#rail img').length-1)*width){
                    rail.css('right',width+'px');
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

            $('#title').animate({
                left: -$('#title').width() * 2
            }, options['speed']/2, function(){
                //TODO FIND A BETTER SOLUTION THERE
                $('#title').text($('.actualSlide').next('#rail img:not(.ghost)').data('title'));
                $('#title').animate({
                    left: 0
                }, options['speed']/2)
            });
            $('#description').fadeOut(options['speed']/2, function() {
                $('#description').text($('.actualSlide').next('#rail img:not(.ghost)').data('desc'));
                $('#description').fadeIn(options['speed']/2)
            })

            moving = true;
            rail.animate({
              right:parseFloat(rail.css('right'))-width+'px',
          }, options['speed'],function(){
                if(parseFloat(rail.css('right')) <= 0){
                    rail.css('right',($('#rail img').length-2)*width+'px');
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
    function moveBullet(){
        $('.actualDots').removeClass('actualDots');
        $('.dots button').each(function(){
            _ = $(this);
            if(parseFloat($('#rail').css('right')) == (_.data('index')+1)*width){
                _.addClass('actualDots');
            }
        });
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
    $el.hover(function(){
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

    if(options['bullets']){

    }
    if(options['autoPlay']){
        playSlide();
    }
    if(options['hidePlay']){
        $('#play').toggle();
    }

}
