function wellslide(obj){
    'use strict';

    var el = obj.el;
    var $el = $(el);
    var params = obj.params;
    //Définie width pour le responsive
    var width = parseFloat($('#slideshow').css('width'));

    //Initialise les élements
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
        //Set first Title and desc
        $('#title').text($('.actualSlide').data('title'));
        $('#description').text($('.actualSlide').data('desc'));
        //Bullets
        $el.append('<ul class="dots"></ul>');
        $('#rail img:not(.ghost)').each(function(index, el){
            $('.dots').append('<li><button type="button" data-role="none" role="button" data-index="'+index+'"></button>');
        });
        $('.dots button:first').addClass('actualDots');
        $('.dots button').click(function(){
            slideToSlide($(this).data('index'));
            $('.actualDots').removeClass('actualDots');
            $(this).addClass('actualDots');
        });
        //Options Hide and Show
        if(!options['bullets']){
            $('.dots').hide();
        }
        if(options['autoPlay']){
            playSlide();
        }
        if(options['hidePlay']){
            $('#play').remove();
        }
    });

    var _, play = false, moving = false;

    var options = {
        speed: 2500,
        arrow: true,
        bullets: true,
        autoPlay: false,
        hidePlay: false,
    }

    Object.keys(options).forEach(function(key){
        if(params[key] != undefined){
            options[key] = params[key];
        }
    });

    function slideToSlide(index){
        if(moving == false){
            moving = true;
            //Move Right
            $('.actualSlide').removeClass('actualSlide');
            $('#rail img[data-index="'+index+'"]').addClass('actualSlide');
            //Animate text
            animateText();
            //Animate Rail
            rail.animate({
                right: index*width+width+'px',
            }, options['speed'], function(){
                moving = false;
            });
            if(play != false){
                clearInterval(play);
                play = setInterval(moveRight,options['speed']);
            }
        }
    };

    //ARROW
    function moveRight(){
        if(moving == false){
            moving = true;
            //Pour eviter que le slide reparte quand le play est activé.
            if(play != false){
                clearInterval(play);
            }
            //Move actual Slide (for responsive)
            var next = $('#rail img.actualSlide').removeClass('actualSlide').next('#rail img:not(.ghost)');
            if( next.length != 0){
                next.addClass('actualSlide');
            } else {
                $('#rail img:not(.ghost):first').addClass('actualSlide')
            }

            rail.animate({
                right: parseFloat(rail.css('right'))+width+'px',
            }, options['speed'],function(){
                if(parseFloat(rail.css('right')) >= ($('#rail img').length-1)*width){
                    rail.css('right',width+'px');
                }
                moveBullet();
                moving = false;
                if(play != false){
                    clearInterval(play);
                    play = setInterval(moveRight,options['speed']);
                }
            });
            animateText();
        }
    };

    function moveLeft(){
        if(moving == false){
            moving = true;
            if(play != false){
                clearInterval(play);
            }
            var prev = $('#rail img.actualSlide').removeClass('actualSlide').prev('#rail img:not(.ghost)');
            if( prev.length != 0){
                prev.addClass('actualSlide');
            } else {
                $('#rail img:not(.ghost):last').addClass('actualSlide')
            }
            rail.animate({
               right:parseFloat(rail.css('right'))-width+'px',
            }, options['speed'],function(){
                if(parseFloat(rail.css('right')) <= 0){
                    rail.css('right',($('#rail img').length-2)*width+'px');
                }
                moveBullet();
                moving = false;
                if(play != false){
                    clearInterval(play);
                    play = setInterval(moveRight,options['speed']);
                }
            });
            animateText();
        }
    }

    $('#previous').click(function(e){
        moveLeft();
    });
    $('#next').click(function(){
        moveRight();
    });


    //TITLE & DESC
    function animateText(){
        $('#title').animate({
            left: -$('#title').width() * 2
        }, options['speed']/2, function(){
            $('#title').text($('.actualSlide').data('title'));
            $('#title').animate({
                left: 0
            }, options['speed']/2)
        });
        $('#description').fadeOut(options['speed']/2, function() {
            $('#description').text($('.actualSlide').data('desc'));
            $('#description').fadeIn(options['speed']/2)
        })
    }

    //DOTS
    function moveBullet(){
        $('.actualDots').removeClass('actualDots');
        $('.dots button').each(function(){
            _ = $(this);
            if(parseFloat($('#rail').css('right')) == (_.data('index')+1)*width){
                _.addClass('actualDots');
            }
        });
    };

    //RESPONSIVE
    $(window).resize(function(){
        width = parseFloat($('#slideshow').css('width'));
        $('#rail img').css('width',width);
        rail.css('width', ($('#rail img').length * width)+'px');
        rail.css('right', ($('.actualSlide').data('index')+1) * width); //1 for ghost
    });

    //PLAY AND HOVER PAUSE
    function playSlide(){
        $('#play').find('.fa').toggleClass('fa-pause-circle-o fa-play-circle-o');
        if(play == false){
            moveRight();
            play = setInterval(moveRight,options['speed']);
        } else {
            clearInterval(play);
            play = false;
        }
    };
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
            play = setInterval(moveRight,options['speed']);
        }
    });

    //Key press
    $(document).keydown(function(e) {
      if(e.keyCode == 37) { // left
          moveLeft();
      }
      if(e.keyCode == 39) { // right
          moveRight();
      }
    });

}
