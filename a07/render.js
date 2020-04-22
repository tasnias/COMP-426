import Game from "./engine/game.js";

export const renderBoard = function (game) {
    $('h2').html(`Score: ${game.gameState.score}`);

    for (let i = 0; i < game.size; i++) {
        for (let j = 0; j < game.size; j++) {
            let tile = game.gameState.board[i * game.size + j] == 0 ?
            '' : game.gameState.board[i * game.size + j];
            $(`#tile${(i * game.size + j)}`).replaceWith(`<div class="type${tile}" id="tile${i * game.size + j}">${tile}</div>`);
        }
    }
}

export const loadGameStateIntoDOM = function (game) {
    $('h2').html(`Score: ${game.gameState.score}`);

    for (let i = 0; i < game.size; i++) {
        let row = '<div class="row">'
        for (let j = 0; j < game.size; j++) {
            let tile = game.gameState.board[i * game.size + j] == 0 ?
                '' : game.gameState.board[i * game.size + j];
            row +=
                `<div class="type${tile}" id="tile${i * game.size + j}">${tile}</div>`;
        }
        row += '</div>'
        $('#root div span').append(row);
    }

    document.addEventListener("keydown", function (event) {
        if (event.keyCode == 39) {
            game.move('right');
        }

        if (event.keyCode == 38) {
            game.move('up');
        }

        if (event.keyCode == 37) {
            game.move('left');
        }

        if (event.keyCode == 40) {
            game.move('down');
        }

        renderBoard(game);
    });

    $("button").click(() => {
        game.setupNewGame();
        $('#message').html('');
        renderBoard(game);
    })
}

$(function () {
    let game = new Game(4);
    game.onWin((gameState) => {
        $('#message').html('You win!!');
    });

    game.onLose((gamestate) => {
        $('#message').html('You lost :(');
    })
    loadGameStateIntoDOM(game);
});
