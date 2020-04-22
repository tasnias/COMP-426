/*
Add your code for Game here
 */
export default class Game {
    addTile() {
        if (!this.checkForEmpty())
            return;

        let probability = Math.floor(Math.random() * 10);
        let position;
        do {
            position = Math.floor(Math.random() * this.size * this.size);
        } while (this.gameState.board[position] != 0)
        this.gameState.board[position] = probability <= 8 ? 2 : 4;
    }

    setupNewGame() {
        for (let i = 0; i < this.size * this.size; i++) {
            this.gameState.board[i] = 0;
        }

        this.addTile();
        this.addTile();

        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
    }

    constructor(size) {
        this.size = size;
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false
        };
        this.setupNewGame();
        this.callbacks = {
            onMove: [],
            onWin: [],
            onLose: []
        }
    }

    loadGame(gameState) {
        this.gameState = gameState;
    }

    getTile(i, j) {
        return i * this.size + j;
    }

    move(direction) {
        let oldBoard = [...this.gameState.board];
        if (direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                let zeroes = this.size - 1;
                for (let j = this.size - 1; j >= 0; j--) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(i, zeroes--)] = this.gameState.board[this.getTile(i, j)];
                }

                while (zeroes >= 0) {
                    this.gameState.board[this.getTile(i, zeroes--)] = 0;
                }
            }

            //merge the first pair of matching numbers in each row starting from the right to left
            for (let i = this.size - 1; i >= 0; i--) {
                let k = this.size - 1;
                while (k > 0) {
                    if (this.gameState.board[this.getTile(i, k)] == this.gameState.board[this.getTile(i, k - 1)]) {
                        this.gameState.board[this.getTile(i, k)] += this.gameState.board[this.getTile(i, k - 1)];
                        this.gameState.score += this.gameState.board[this.getTile(i, k)];
                        if (this.gameState.board[this.getTile(i, k)] >= 2048)
                            this.gameState.won = true;
                        this.gameState.board[this.getTile(i, k - 1)] = 0;
                        k--;
                    }
                    k--;
                }
            }

            for (let i = 0; i < this.size; i++) {
                let zeroes = this.size - 1;
                for (let j = this.size - 1; j >= 0; j--) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(i, zeroes--)] = this.gameState.board[this.getTile(i, j)];
                }

                while (zeroes >= 0) {
                    this.gameState.board[this.getTile(i, zeroes--)] = 0;
                }
            }
            if (JSON.stringify(this.gameState.board) != JSON.stringify(oldBoard))
                this.addTile();
        }

        else if (direction === 'left') {
            for (let i = 0; i < this.size; i++) {
                let zeroes = 0;
                for (let j = 0; j < this.size; j++) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(i, zeroes++)] = this.gameState.board[this.getTile(i, j)];
                }

                while (zeroes < this.size) {
                    this.gameState.board[this.getTile(i, zeroes++)] = 0;
                }
            }

            //merge the first pair of matching numbers in each row starting from the left to right
            for (let i = 0; i < this.size; i++) {
                let k = 0;
                while (k < this.size - 1) {
                    if (this.gameState.board[this.getTile(i, k + 1)] == this.gameState.board[this.getTile(i, k)]) {
                        this.gameState.board[this.getTile(i, k)] += this.gameState.board[this.getTile(i, k + 1)];
                        this.gameState.score += this.gameState.board[this.getTile(i, k)];
                        if (this.gameState.board[this.getTile(i, k)] >= 2048)
                            this.gameState.won = true;
                        this.gameState.board[this.getTile(i, k + 1)] = 0;
                        k++;
                    }
                    k++;
                }
            }

            for (let i = 0; i < this.size; i++) {
                let zeroes = 0;
                for (let j = 0; j < this.size; j++) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(i, zeroes++)] = this.gameState.board[this.getTile(i, j)];
                }

                while (zeroes < this.size) {
                    this.gameState.board[this.getTile(i, zeroes++)] = 0;
                }
            }
            if (JSON.stringify(this.gameState.board) != JSON.stringify(oldBoard))
                this.addTile();
        }

        else if (direction === 'up') {
            for (let j = 0; j < this.size; j++) {
                let zeroes = 0;
                for (let i = 0; i < this.size; i++) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(zeroes++, j)] = this.gameState.board[this.getTile(i, j)];
                }
                while (zeroes < this.size) {
                    this.gameState.board[this.getTile(zeroes++, j)] = 0;
                }
            }

            //merge the first pair of matching numbers in each column starting from the top to bottom
            for (let j = 0; j < this.size; j++) {
                let k = 0;
                while (k < this.size - 1) {
                    if (this.gameState.board[this.getTile(k, j)] == this.gameState.board[this.getTile(k + 1, j)]) {
                        this.gameState.board[this.getTile(k, j)] += this.gameState.board[this.getTile(k + 1, j)];
                        this.gameState.score += this.gameState.board[this.getTile(k, j)];
                        if (this.gameState.board[this.getTile(k, j)] >= 2048)
                            this.gameState.won = true;
                        this.gameState.board[this.getTile(k + 1, j)] = 0;
                        k++;
                    }
                    k++;
                }
            }

            for (let j = 0; j < this.size; j++) {
                let zeroes = 0;
                for (let i = 0; i < this.size; i++) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(zeroes++, j)] = this.gameState.board[this.getTile(i, j)];
                }
                while (zeroes < this.size) {
                    this.gameState.board[this.getTile(zeroes++, j)] = 0;
                }
            }
            if (JSON.stringify(this.gameState.board) != JSON.stringify(oldBoard))
                this.addTile();
        }

        else if (direction === 'down') {
            for (let j = 0; j < this.size; j++) {
                let zeroes = this.size - 1;
                for (let i = this.size - 1; i >= 0; i--) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(zeroes--, j)] = this.gameState.board[this.getTile(i, j)];
                }

                while (zeroes >= 0) {
                    this.gameState.board[this.getTile(zeroes--, j)] = 0;
                }
            }

            //merge the first pair of matching numbers in each column starting from the bottom to top
            for (let j = 0; j < this.size; j++) {
                let k = this.size - 1;
                while (k > 0) {
                    if (this.gameState.board[this.getTile(k, j)] == this.gameState.board[this.getTile(k - 1, j)]) {
                        this.gameState.board[this.getTile(k, j)] += this.gameState.board[this.getTile(k - 1, j)];
                        this.gameState.score += this.gameState.board[this.getTile(k, j)];
                        if (this.gameState.board[this.getTile(k, j)] >= 2048)
                            this.gameState.won = true;
                        this.gameState.board[this.getTile(k - 1, j)] = 0;
                        k--;
                    }
                    k--;
                }
            }

            for (let j = 0; j < this.size; j++) {
                let zeroes = this.size - 1;
                for (let i = this.size - 1; i >= 0; i--) {
                    if (this.gameState.board[this.getTile(i, j)] != 0)
                        this.gameState.board[this.getTile(zeroes--, j)] = this.gameState.board[this.getTile(i, j)];
                }
                while (zeroes >= 0) {
                    this.gameState.board[this.getTile(zeroes--, j)] = 0;
                }
            }
            if (JSON.stringify(this.gameState.board) != JSON.stringify(oldBoard))
                this.addTile();
        }

        if (!this.checkForEmpty()) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size - 1; j++) {
                    if (this.gameState.board[this.getTile(i, j)] === this.gameState.board[this.getTile(i, j + 1)])
                        return;
                }
            }
            for (let j = 0; j < this.size; j++) {
                for (let i = 0; i < this.size - 1; i++) {
                    if (this.gameState.board[this.getTile(i, j)] === this.gameState.board[this.getTile(i + 1, j)])
                        return;
                }
            }
            this.gameState.over = true;
        }

        this.callbacks.onMove.forEach(callback => {
            callback(this.gameState);
        });
        if (this.gameState.won === true) {
            this.callbacks.onWin.forEach(callback => {
                callback(this.gameState);
            });
        }

        if (this.gameState.over === true) {
            this.callbacks.onLose.forEach(callback => {
                callback(this.gameState);
            });
        }
    }

    checkForEmpty() {
        let foundEmpty = false;
        for (let i = 0; i < this.size * this.size; i++) {
            if (this.gameState.board[i] == 0) {
                foundEmpty = true;
            }
        }
        return foundEmpty;
    }

    toString() {
        let row = ''
        for (let i = 0; i < this.size * this.size; i++) {
            row += '[' + this.gameState.board[i] + '] ';
            if ((i + 1) % this.size == 0) {
                console.log(row);
                row = '';
            }
        }

        console.log('Score: ' + this.gameState.score);
    }

    onMove(callback) {
        this.callbacks.onMove.push(callback);
    }

    onWin(callback) {
        this.callbacks.onWin.push(callback);
    }

    onLose(callback) {
        this.callbacks.onLose.push(callback);
    }

    getGameState() {
        return this.gameState;
    }
}