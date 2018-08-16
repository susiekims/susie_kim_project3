// create game object for functions to live on
const game = {};

// declare score, update score dynamically 
game.score = 0;
game.lives = 3;
game.speed = 2000;
game.time = 5000;
game.numberOfBalls = game.time / 1000;
game.ballTypes = [
    'assets/hair.png',
    'assets/hilaryfixed.png'
];

let randomNum = Math.floor(Math.random() * 2);

// game.getScreenWidth = () => {
//     const stageWidth = $(window).width() / 2;
//     $('.stage').css('width', stageWidth);
// }

game.startTimer = () => {
    $('#timer').text(game.time /1000 + ':00');
    const timer = setInterval(function () {
        game.time -= 1000;
        $('#timer').text(game.time /1000 + ':00');
        if (game.time == 0) {
            clearInterval(timer);
            console.log(game.score);
            $('#score-final').text(game.score);
            $('#finish-screen').toggle(true);
            $('#replay').on('click', function(){
                window.location.reload();
                console.log('clickled');
            });
        } 
    }, 1000);
}

game.responsiveResize = () => {
    // $('.stage').css('width', '50vw');
    // game.stageWidth = $('.stage').width()
    game.interval = $('.stage').width() / 3;
    $('#trump').css({
        'width': game.interval,
        'bottom': 10,
        'left': game.interval,
        'position': 'absolute',
    });
}

// function to move player left and right
game.moveTrump = () => {
    const trump = $('#trump');
    // let trumpPositionX = trump.position().left;
     let trumpPositionX = game.interval;


    // using arrow keys
    $("body").keydown(function(e){
        // console.log(game.interval);
        if ((e.keyCode || e.which)  == 37 && trumpPositionX > 0)  {
            console.log(trumpPositionX);
            // if left key is pressed, move 100px to the left  
            // trump.animate({
            //     left: "-=33.3333%"
            // }, 200);
            trumpPositionX -= game.interval;
            trump.css('left', trumpPositionX);
        } else if ((e.keyCode || e.which) == 37 && trumpPositionX == 0) {
            console.log(trumpPositionX);
            trumpPositionX = 0;
            trump.css('left', trumpPositionX);
        }

        if ((e.keyCode || e.which) == 39 && trumpPositionX < game.interval * 2) {
            // console.log(game.interval);
            console.log(trumpPositionX);
            // if right key is pressed, move 100px to the right
            // trump.animate({
            //     left: "+=33.3333%"
            // }, 200);
            trumpPositionX += game.interval;
            trump.css('left', trumpPositionX);

        } else if ((e.keyCode || e.which) == 39 && trumpPositionX == game.interval * 2) {
            console.log('ouch!');
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
    const ballHTML = `<img src="${game.ballTypes[Math.floor(Math.random() * 2)]}" class="ball" id="ball${index}">`;
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
    // console.log( $('.ball').attr('src'));
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
            && trumpPositionX == ballPositionX 
            && $ball.attr('src') == 'assets/hair.png') {
            $ball.remove();
            game.score++;
            $('#score span').text(game.score);
            clearInterval(stopCheck);
            trump.attr('src', 'assets/trumpsmile.png');
            setTimeout(()=>{
                trump.attr('src', 'assets/trump.png');
            }, 500);
            
        } else if (ballPositionY > trumpPositionY - 50 // 550 - 580 
            && ballPositionY < trumpPositionY - 20
            && trumpPositionX == ballPositionX 
            && $ball.attr('src') == 'assets/hilaryfixed.png') {
            game.lives--;
            $('#lives span').text(game.lives);
            $ball.remove();
            clearInterval(stopCheck);
            trump.attr('src', 'assets/trump-angry.png');
            setTimeout(()=>{
                trump.attr('src', 'assets/trump.png');
            }, 500);
            if (game.lives === 0) {
                clearInterval(stopCheck);
                if (alert('game over! play again?')){} else {window.location.reload()} 
            }
        }
    }, 50);
}

game.init = () => {
    game.moveTrump();
    game.startTimer();
    for (let i = 0; i < game.numberOfBalls; i++) {
        setTimeout(()=>{
            game.displayBall(i);
            game.moveBall(i);
        }, Math.random()*game.time);
    }  
}

$(function() {
    console.log("ready!");
    // game.getScreenWidth();
    game.responsiveResize();
    $('#loading-screen').toggle(true);
    $('#finish-screen').toggle(false);
    $('#start').on('click', function(){
        $('#loading-screen').toggle(false);
        $('#score span').text(game.score);
        $('#lives span').text(game.lives);
        $('#start').remove();
        game.init();  
    });
    $(window).resize(function(){
        game.responsiveResize();
    });
});

