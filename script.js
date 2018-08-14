// create game object for functions to live on
const game = {};

// declare score, update score dynamically 
let score = 0;
$('#score').append(score);

// function to move player left and right
game.moveBox = () => {
    const box = $('#box');
    const boxPositionX = box.position().left;
    $("body").keydown(function(e){
        if ((e.keyCode || e.which)  == 37 && boxPositionX >= 100) {
            // if left key is pressed, move 100px to the left   
            box.animate({
                left: "-=100px"
            }, 200);
        } 
        if ((e.keyCode || e.which) == 39) {
            // if right key is pressed, move 100px to the right
            box.animate({
                left: "+=100px"
            }, 200);
        } 
    });  
}

// get x and y position of ball and box
// compare y positions of ball and box within 40px
// if they touch, add 1 to the score and delete the ball
game.checkPosition = (index) => {
    setInterval(function(){
        const $ball = $(`#ball${index}`);
        const ballPositionY = $ball.position().top;
        const ballPositionX = $ball.position().left;

        const $box = $("#box");
        const boxPositionY = $box.position().top;
        const boxPositionX = $box.position().left;
     
        if (ballPositionY > boxPositionY - 120 
            && ballPositionY < boxPositionY + 80 
            && boxPositionX < ballPositionX + 10
            && boxPositionX > ballPositionX - 10) {
            $ball.remove();
            score++;
            $('#score').text(score);
            
        } else if (ballPositionY > 500){
            $ball.remove();
        }
    }, 100);
}

// add a div called ball to the stage
// give it a random x position, give it a random delay
// animate the ball so it falls to the bottom of the page;
game.makeBall = (xPosition, number) => {
    const ballHTML = `<div class="ball" id=ball${number}">`;
    $('.stage').append(ballHTML);
    $(`#ball${number}`).css('left', xPosition).animate({
        top: "+=700px"
    }, 2000);
}

// initialize game
// create for loop to call game.makeBall function 10 times, each with random x position and random delay
game.init = () => {
    game.moveBox();
    for (let i = 0; i < 5; i++) {
        // setInterval(() => {
        //     game.makeBall((Math.floor(Math.random() * 3))*100, i);
        //     game.checkPosition(i);
        // }, 2000);

        // // setInterval(() => {
        // //     game.makeBall((Math.floor(Math.random() * 3))*100);
        // //     game.checkPosition();
        // // }, Math.random*10000);

        setTimeout(() => {
            game.makeBall((Math.floor(Math.random() * 3))*100);
            game.checkPosition();
        }, Math.random() *10000);

        

    }
}

$(function() {
    console.log("ready!");
    $('#start').on('click', function(){
        $('#start').remove();
        game.init();  
    });
});
