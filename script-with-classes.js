// create game object for functions to live on
const game = {};

// declare score, update score dynamically 

game.score = 0;
game.lives = 5;
game.speed = 2000;
game.time = 10000;
game.numberOfBalls =30;
game.ballTypes = [
    `assets/hair.png`,
    `assets/hilaryfixed.png`
];
game.catch = 'hair.png';
game.dodge = 'hilaryfixed.png';
game.player = 'trump.png';
game.playerSmile = 'trump-smile.png';
game.playerAngry = 'trump-angry.png';
game.noLivesText = `Hilary told the media that your hair is actually a toupe... Fake News!`;
game.goodScoreText = `You look amazing, Mr. President!`;
game.badScoreText = `Did you even try? Good luck getting a second term with THAT hair...`
game.finishImageGood = `assets/trump-win.png`;
game.finishImageBad = `assets/trump-pissed.png`;

game.showfinishScreen = (title, score, text, image) => {
    clearInterval(game.check);
    clearInterval(game.timer);
    $('#game-items').remove();
    $('#lives-score').remove();
    $('#finish-screen h1').text(title);
    $('#score-final').text(score);
    $('#finish-text').text(text);
    $('#finish-screen').toggle(true);
    $('.slide-up').attr('src', image);
    $('#replay').on('click', function(){
        window.location.reload();
        console.log('clickled');
    });
}

game.startTimer = () => {
    $('#timer').text(game.time /1000 + ':00');
    game.timer = setInterval(function () {
        game.time -= 1000;
        $('#timer').text(game.time /1000 + ':00');
        if (game.time < 0) {
            if (game.score > 9) {
                game.showfinishScreen(`Time's up!`, `Your score is ${game.score}`, game.goodScoreText, game.finishImageGood)
            } else {
                game.showfinishScreen(`Time's up!`, `Your score is ${game.score}`, game.badScoreText, game.finishImageBad);
            }
        } 
    }, 1000);
}

game.responsiveResize = () => {
    game.interval = $('.stage').width() / 3;
    $('#player').css({
        'width': game.interval,
        'bottom': 10,
        'left': game.interval,
        'position': 'absolute',
    });
}

// function to move player left and right
game.movePlayer = () => {
    const player = $('#player');
     let playerPositionX = game.interval;


    // using arrow keys
    $("body").keydown(function(e){
        if ((e.keyCode || e.which)  == 37 && playerPositionX > 0)  {
            console.log(playerPositionX);
            playerPositionX -= game.interval;
            player.animate({
                left: `-=${game.interval}`
            }, 200);
        } 

        if ((e.keyCode || e.which) == 39 && playerPositionX < game.interval * 2) {
            console.log(playerPositionX);
            playerPositionX += game.interval;
            player.animate({
                left: `+=${game.interval}`
            }, 200);
        } 
    });  

    // using mouse
    $('#left').on('click', function() {
        if (playerPositionX > 0)  {
            playerPositionX -= game.interval;
            player.animate({
                left: `-=${game.interval}`
            }, 200);
        } 
    });
    $('#right').on('click', function() {
        if (playerPositionX < game.interval * 2) {
            playerPositionX += game.interval;
            player.animate({
                left: `+=${game.interval}`
            }, 200);
        } 
    });
}

game.displayBall = (index) => {
    const $ball = $(`#ball${index}`);
    const ballHTML = `<img src="${game.ballTypes[Math.floor(Math.random() * 2)]}" class="ball" id="ball${index}">`;
    $('#game-items').append(ballHTML);
    $('.ball').css('width', game.interval);  
}

// add a div called ball to the stage
// give it a random x position
// animate the ball so it falls to the bottom of the page;
game.moveBall = (index) => {
    const $ball = $(`#ball${index}`);
    $ball.css('left', (Math.floor(Math.random() * 3))*game.interval );
    $ball.animate({
        top: `+=${$('.stage').height() + game.interval}`
      }, game.speed);
    game.checkPosition(index);

}


// get x and y position of ball
// get x position of box
// compare y positions of ball and box within 40px
// if they touch, add 1 to the score and delete the ball
game.checkPosition = (index) => {
    const check = setInterval(function(){
        const $ball = $(`#ball${index}`);
        const ballPositionY = $ball.position().top;
        const ballPositionX = $ball.position().left;

        const $player = $("#player");
        const playerPositionY = $player.position().top;
        const playerPositionX = $player.position().left;

        if (ballPositionY > playerPositionY - 100 // 550 - 580 
            && ballPositionY < playerPositionY + 20
            && ballPositionX < playerPositionX + 20
            && ballPositionX > playerPositionX - 20
            && $ball.attr('src') == `assets/${game.catch}`) {
            clearInterval(check);
            $ball.remove();
            game.score++;
            $('#score span').text(game.score);
            $player.attr('src', `assets/${game.playerSmile}`);
            setTimeout(()=>{
                $player.attr('src', `assets/${game.player}`);
            }, 500);
            
        } else if (ballPositionY > playerPositionY - 50 // 550 - 580 
            && ballPositionY < playerPositionY
            && playerPositionX == ballPositionX 
            && $ball.attr('src') == `assets/${game.dodge}`) {
            clearInterval(check);
            game.lives--;
            game.showLives(game.lives);
            $ball.remove();
            $player.attr('src', `assets/${game.playerAngry}`);
            setTimeout(()=>{
                $player.attr('src', `assets/${game.player}`);
            }, 500);
            if (game.lives === 0) {
                game.showfinishScreen('No more lives!', '', game.noLivesText, game.finishImageBad);
            }
        }
    }, 100);
}

game.showLives = (numberOfLives) => {
    console.log(numberOfLives);
    $('#lives').empty();
    for (let i = 0; i < numberOfLives; i++) {
        $('#lives').append(`<img src='assets/${game.player}'>`);
    }
}

game.playGame = () => {
    $('#counter').attr('src', `assets/${game.catch}`);
    $('#game-items').toggle(true);
    $('#loading-screen').toggle(false);
    $('#score span').text(game.score);
    game.startTimer();
    game.movePlayer();
    game.showLives(game.lives);
    for (let i = 0; i < game.numberOfBalls; i++) {
        setTimeout(()=>{
            game.displayBall(i);
            game.moveBall(i);
        }, Math.random()*game.time);
    }  

}

game.init = () => {
    game.responsiveResize();
    $('#loading-screen').toggle(true);
    $('#finish-screen').toggle(false);
    $('#game-items').toggle(false);
    $('.trump-head').on('click', function(){
        $('#player').attr('src', 'assets/trump.png')
        setTimeout(()=>{
            game.playGame();
        }, 1000);
    });
    $('.hilary-head').on('click', function(){
        $('#player').attr('src', 'assets/hilaryfixed.png');
        game.ballTypes = [
            `assets/email.png`,
            `assets/trump.png`
        ];
        game.player = 'hilaryfixed.png';
        game.catch = 'email.png';
        game.dodge = 'trump.png';
        game.playerSmile = 'hilary-smile.png';
        game.playerAngry = 'hilary-sad.png';  
        game.finishImageGood = `assets/hilary-win.png`;
        game.finishImageBad = `assets/hilary-shrug.png`;
        game.noLivesText = `Emails exposed... DAB!`;
        game.goodScoreText = `Great work getting all the emails!`;
        game.badScoreText = `Do you think this is a game? This is why you lost the election...`; 
        setTimeout(()=>{
            game.playGame();
        }, 1000);
    });
}

$(function() {
    console.log("ready!");
    game.init();
});

