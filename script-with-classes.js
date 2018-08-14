// create game object for functions to live on
const game = {};

// declare score, update score dynamically 
game.score = 0;
game.lives = 10;
game.speed = 2000;
game.numberOfBalls = 20;

game.getScreenWidth = () => {
    const stageWidth = $(window).width() / 2;
    $('.stage').css('width', stageWidth);
}


game.responsiveResize = () => {
    // $('.stage').css('width', '50vw');
    // game.stageWidth = $('.stage').width()
    game.interval = $('.stage').width() / 3;
    $('#trump').css({
        'width': game.interval,
        'bottom': 0,
        'left': game.interval,
        'position': 'absolute',
    });
}

// function to move player left and right
game.moveTrump = () => {
    const trump = $('#trump');
    let trumpPositionX = trump.position().left;

    // using arrow keys
    $("body").keydown(function(e){
        console.log(game.interval);
        if ((e.keyCode || e.which)  == 37 && trumpPositionX > 0)  {
            // if left key is pressed, move 100px to the left  
            // trump.animate({
            //     left: "-=33.3333%"
            // }, 200);
            trumpPositionX -= game.interval;
            trump.css('left', trumpPositionX);
        } else if ((e.keyCode || e.which) == 37 && trumpPositionX == 0) {
            trumpPositionX = 0;
            trump.css('left', trumpPositionX);
        }

        if ((e.keyCode || e.which) == 39 && trumpPositionX < game.interval * 2) {
            console.log(game.interval);
            // if right key is pressed, move 100px to the right
            // trump.animate({
            //     left: "+=33.3333%"
            // }, 200);
            trumpPositionX += game.interval;
            trump.css('left', trumpPositionX);
        } else if ((e.keyCode || e.which) == 39 && trumpPositionX == game.interval * 2) {
            trumpPositionX = game.interval * 2;
            trump.css('left', trumpPositionX);
        }
    });  

    // using mouse
    $('#left').on('click', function() {
        if (trumpPositionX > 0)  {
            trumpPositionX -= game.interval;
            trump.css('left', trumpPositionX);
        } else if (trumpPositionX == 0) {
            trumpPositionX = 0;
            trump.css('left', trumpPositionX);
        }
    });
    $('#right').on('click', function() {
        if (trumpPositionX < game.interval * 2) {
            trumpPositionX += game.interval;
            trump.css('left', trumpPositionX);
        } else if (trumpPositionX == game.interval * 2) {
            trumpPositionX = 200;
            trump.css('left', trumpPositionX);
        }
    });
}

game.displayBall = (index) => {
    const $ball = $(`#ball${index}`);
    const ballHTML = `<img src="assets/hair.png" class="ball" id="ball${index}">`;
    $('.stage').append(ballHTML);
    $('.ball').css({
        // 'left': ( Math.floor(Math.random() * 3) )*game.interval,
        'width': game.interval,
        // 'background-color': 'red'
    });
}

// add a div called ball to the stage
// give it a random x position
// animate the ball so it falls to the bottom of the page;
game.moveBall = (index) => {
    const $ball = $(`#ball${index}`);
    $ball.css('left', (Math.floor(Math.random() * 3))*game.interval );
    $ball.animate({
        top: "+=700px"
      }, game.speed);
    game.checkPosition(index);

}


// get x and y position of ball
// get x position of box
// compare y positions of ball and box within 40px
// if they touch, add 1 to the score and delete the ball
game.checkPosition = (index) => {
    const stopCheck = setInterval(function(){
        const $ball = $(`#ball${index}`);
        const ballPositionY = $ball.position().top;
        const ballPositionX = $ball.position().left;

        const trump = $("#trump");
        const trumpPositionY = trump.position().top;
        const trumpPositionX = trump.position().left;
        // console.log(trumpPositionX);
        // console.log(boxPositionX, ballPositionX);
     
        if (ballPositionY > trumpPositionY - 50 // 550 - 580 
            && ballPositionY < trumpPositionY - 20
            // && trumpPositionX < ballPositionX + 10
            && trumpPositionX == ballPositionX ) {
            $ball.remove();
            game.score++;
            $('#score span').text(game.score);
            clearInterval(stopCheck);
            trump.attr('src', 'assets/trumpsmile.png');
            setTimeout(()=>{
                trump.attr('src', 'assets/trump.png');
            }, 500);
            
        } else if (ballPositionY > 550){
            game.lives--;
            $('#lives span').text(game.lives);
            $ball.remove();
            clearInterval(stopCheck);
            if (game.lives === 0) {
                clearInterval(stopCheck);
                if (alert('game over! play again?')) {
                } else {
                    window.location.reload()
                } 
            }
        }
    }, 100);
}

game.init = () => {
    game.moveTrump();
    for (let i = 0; i < game.numberOfBalls; i++) {
        setTimeout(()=>{
            game.displayBall(i);
            game.moveBall(i);
        }, Math.random()*20000);
    }  
}

$(function() {
    console.log("ready!");
    game.getScreenWidth();
    game.responsiveResize();
    $('#start').on('click', function(){
        $('#score span').text(game.score);
        $('#lives span').text(game.lives);
        $('#start').remove();
        game.init();  
    });
    $(window).resize(function(){
        game.responsiveResize();
    });
});

